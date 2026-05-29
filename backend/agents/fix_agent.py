"""
FixAgent — the main autonomous repair pipeline.

Orchestrates the full end-to-end flow:
  1. Parse logs → extract failure context
  2. Fetch failing file from GitHub
  3. Generate AI patch
  4. Clone repo to temp workspace
  5. Apply patch
  6. Run Docker sandbox
  7. Gate: validate results
  8. Commit patch + create PR
"""

from __future__ import annotations

import difflib
import os
import subprocess
from datetime import datetime, timezone

from agents.prompts import FixEngine, make_unified_diff
from config import get_settings
from github.client import GitHubClient
from models.webhook import FailureContext
from models import LogLine, TimelineStep, FixDetail, DiffLine
from sandbox.docker_runner import DockerSandbox, create_workspace, cleanup_workspace
from services.log_parser import parse_logs
from services.state import deployment_service, log_service, fix_service
from services.event_bus import event_bus
from utils.logging import get_logger

logger = get_logger(__name__)

_MAX_PATCH_FILES = 5          # Gate: reject if AI wants to change > 5 files
_MIN_CONFIDENCE = 0.60        # Gate: reject patches with low confidence


class FixAgent:
    """Autonomous end-to-end deployment repair agent."""

    def __init__(self) -> None:
        self._engine = FixEngine()
        self._sandbox = DockerSandbox()

    def _update_status(self, run_id: str, status: str, timeline_label: str, icon_key: str, state: str = "done") -> None:
        """Helper to update deployment status and emit event."""
        deployment = deployment_service.get_sync(run_id)
        if not deployment:
            return

        deployment.status = status
        deployment.timeline.append(TimelineStep(
            t=datetime.now().strftime("%H:%M:%S"),
            label=timeline_label,
            state=state,
            iconKey=icon_key
        ))
        deployment_service.upsert(deployment)
        event_bus.publish("status.changed", deployment)

    def _log(self, run_id: str, lvl: str, src: str, msg: str) -> None:
        """Helper to append a log line and emit event."""
        line = LogLine(t=datetime.now().strftime("%H:%M:%S.%f")[:-3], lvl=lvl, src=src, msg=msg)
        log_service.append(run_id, line)
        
        deployment = deployment_service.get_sync(run_id)
        if deployment:
            deployment.logs.append(line)
            deployment_service.upsert(deployment)
            event_bus.publish("log.appended", {"run_id": run_id, "line": line.model_dump()})

    async def run(self, ctx: FailureContext, github: GitHubClient) -> None:
        settings = get_settings()
        run_id = str(ctx.run_id)

        logger.info("agent.started", repo=ctx.repo_full_name, run_id=run_id)
        self._update_status(run_id, "analyzing", "AI analysis started", "Sparkles", "running")
        self._log(run_id, "info", "runner", f"workflow run #{run_id} failed, fetching context...")

        # ── Phase 4: Parse logs ──────────────────────────────────────────────
        ctx = parse_logs(ctx.raw_logs, ctx)
        if not ctx.failing_file:
            logger.warning("agent.no_failing_file_detected", run_id=run_id)
            self._log(run_id, "warn", "autofix", "could not determine failing file from logs.")
            self._update_status(run_id, "failed", "Analysis failed", "XCircle", "error")
            return

        logger.info(
            "agent.failure_classified",
            type=ctx.failure_type,
            file=ctx.failing_file,
            line=ctx.line_number,
        )
        self._log(run_id, "ai", "autofix", f"▸ classifying failure: {ctx.failure_type}")
        self._log(run_id, "ai", "autofix", f"▸ fetching context: {ctx.failing_file}")

        # ── Phase 5: Fetch original file + generate patch ────────────────────
        try:
            original_content = await github.get_file_content(
                repo=ctx.repo_full_name,
                path=ctx.failing_file,
                ref=ctx.head_sha,
            )
        except Exception as e:
            logger.error("agent.file_fetch_failed", file=ctx.failing_file, error=str(e))
            self._log(run_id, "err", "github", f"failed to fetch {ctx.failing_file}")
            self._update_status(run_id, "failed", "File fetch failed", "XCircle", "error")
            return

        self._update_status(run_id, "generating_fix", "Patch generating", "Sparkles", "running")

        try:
            patched_content, confidence = await self._engine.generate_patch(ctx, original_content)
        except Exception as e:
            logger.error("agent.patch_generation_failed", error=str(e))
            self._log(run_id, "err", "ai", f"patch generation failed: {str(e)}")
            self._update_status(run_id, "failed", "Patch generation failed", "XCircle", "error")
            return

        # ── Gate: confidence check ───────────────────────────────────────────
        if confidence < _MIN_CONFIDENCE:
            logger.warning("agent.low_confidence_rejected", confidence=confidence, threshold=_MIN_CONFIDENCE)
            self._log(run_id, "warn", "ai", f"patch confidence ({confidence:.0%}) below threshold")
            self._update_status(run_id, "failed", "Low AI confidence", "XCircle", "error")
            return

        if patched_content == original_content:
            logger.warning("agent.patch_unchanged — nothing to commit")
            self._log(run_id, "warn", "ai", "patch is identical to original")
            self._update_status(run_id, "failed", "No changes needed", "XCircle", "error")
            return

        self._log(run_id, "ai", "autofix", "▸ patch proposed. preparing sandbox validation...")
        self._update_status(run_id, "validating", "Sandbox validation", "ShieldCheck", "running")

        # ── Phase 6: Clone repo + apply patch ───────────────────────────────
        workspace = create_workspace(run_id)
        try:
            await self._clone_and_patch(
                ctx=ctx,
                workspace=workspace,
                original_content=original_content,
                patched_content=patched_content,
                token=github._token,
                run_id=run_id
            )

            # ── Phase 7: Docker sandbox validation ──────────────────────────
            self._log(run_id, "info", "sandbox", "spinning isolated node container")
            sandbox_result = await self._sandbox.run(workspace)

        finally:
            cleanup_workspace(workspace)

        # ── Phase 9: Validation gates ────────────────────────────────────────
        if not sandbox_result.success:
            logger.warning(
                "agent.sandbox_failed — not committing",
                exit_code=sandbox_result.exit_code,
                stderr=sandbox_result.stderr[:500],
            )
            self._log(run_id, "err", "sandbox", "validation failed in sandbox")
            self._update_status(run_id, "failed", "Sandbox failed", "XCircle", "error")
            return

        if (sandbox_result.tests_failed or 0) > 0:
            logger.warning("agent.tests_still_failing", count=sandbox_result.tests_failed)
            self._log(run_id, "err", "sandbox", f"{sandbox_result.tests_failed} tests still failing")
            self._update_status(run_id, "failed", "Tests failing", "XCircle", "error")
            return

        logger.info(
            "agent.sandbox_passed",
            tests_passed=sandbox_result.tests_passed,
            duration=sandbox_result.duration_seconds,
        )
        self._log(run_id, "ok", "vitest", f"✓ Tests passed ({sandbox_result.tests_passed})")

        # Create Fix record
        diff_lines = []
        for line in list(difflib.unified_diff(original_content.splitlines(), patched_content.splitlines()))[2:]:
            if line.startswith("+") and not line.startswith("+++"):
                diff_lines.append(DiffLine(type="add", text=line[1:]))
            elif line.startswith("-") and not line.startswith("---"):
                diff_lines.append(DiffLine(type="del", text=line[1:]))
            else:
                diff_lines.append(DiffLine(type="context", text=line[1:]))

        fix = FixDetail(
            id=f"fix-{run_id}", pr="", pr_url="", org=ctx.repo_full_name.split("/")[0], repo=ctx.repo_full_name.split("/")[1],
            file=ctx.failing_file,
            summary=f"Fix {ctx.failure_type} in {ctx.failing_file}",
            lines={"add": sum(1 for d in diff_lines if d.type=="add"), "del": sum(1 for d in diff_lines if d.type=="del")},
            status="healed",
            created_at=datetime.now(timezone.utc),
            diff=diff_lines,
            sandbox_duration=sandbox_result.duration_seconds,
            tests_passed=sandbox_result.tests_passed or 0,
            commit_sha=ctx.head_sha[:7],
            ai_confidence=confidence,
            commit_message=f"[AutoFix] {ctx.failure_type} in {os.path.basename(ctx.failing_file)}"
        )

        # ── Phase 10: Commit + PR ────────────────────────────────────────────
        if not settings.auto_commit_enabled:
            logger.info("agent.auto_commit_disabled — dry run complete")
            self._log(run_id, "warn", "github", "auto-commit disabled. skipping PR.")
            self._update_status(run_id, "healed", "Healed (Dry Run)", "CheckCircle2", "success")
        else:
            await self._commit_and_pr(
                ctx=ctx,
                github=github,
                patched_content=patched_content,
                sandbox_result=sandbox_result,
                confidence=confidence,
                run_id=run_id,
                fix=fix
            )
            self._update_status(run_id, "healed", f"Commit pushed → PR {fix.pr}", "CheckCircle2", "success")

        # Save fix to service and update deployment
        fix_service.upsert(fix)
        deployment = deployment_service.get_sync(run_id)
        if deployment:
            deployment.fix = fix
            deployment_service.upsert(deployment)
            event_bus.publish("fix.generated", fix)

    async def _clone_and_patch(
        self,
        ctx: FailureContext,
        workspace: str,
        original_content: str,
        patched_content: str,
        token: str,
        run_id: str,
    ) -> None:
        """Clone the repo at head_sha and apply the AI patch."""
        settings = get_settings()
        clone_url = f"https://x-access-token:{token}@github.com/{ctx.repo_full_name}.git"

        logger.info("agent.cloning", repo=ctx.repo_full_name, sha=ctx.head_sha[:8])
        self._log(run_id, "info", "git", f"cloning {ctx.repo_full_name}")
        subprocess.run(
            ["git", "clone", "--depth=1", f"--branch={ctx.head_branch}", clone_url, workspace],
            check=True,
            capture_output=True,
            timeout=120,
        )
        subprocess.run(
            ["git", "checkout", ctx.head_sha],
            cwd=workspace,
            check=True,
            capture_output=True,
            timeout=30,
        )

        # Write the patched file
        target = os.path.join(workspace, ctx.failing_file)
        os.makedirs(os.path.dirname(target), exist_ok=True)
        with open(target, "w", encoding="utf-8") as f:
            f.write(patched_content)

        logger.info("agent.patch_applied", file=ctx.failing_file)

    async def _commit_and_pr(
        self,
        ctx: FailureContext,
        github: GitHubClient,
        patched_content: str,
        sandbox_result,
        confidence: float,
        run_id: str,
        fix: FixDetail
    ) -> None:
        """Push the patch to a new branch and open a PR."""
        branch = f"autofix/{ctx.run_id}"
        commit_msg = (
            f"[AutoFix] {ctx.failure_type} in {os.path.basename(ctx.failing_file)}\n\n"
            f"Automated fix for workflow run #{ctx.run_id}.\n"
            f"AI confidence: {confidence:.0%}\n"
            f"Sandbox: {sandbox_result.tests_passed} tests passed in {sandbox_result.duration_seconds}s"
        )

        # Create branch
        await github.create_branch(
            repo=ctx.repo_full_name,
            branch=branch,
            sha=ctx.head_sha,
        )

        # Commit the patched file
        try:
            original_sha = None  # GitHub will reject if file SHA mismatch; get if needed
            commit_res = await github.commit_file(
                repo=ctx.repo_full_name,
                path=ctx.failing_file,
                content=patched_content,
                message=commit_msg.splitlines()[0],
                branch=branch,
                sha=original_sha,
            )
            fix.commit_sha = commit_res.get("commit", {}).get("sha", "")[:7]
        except Exception as e:
            logger.error("agent.commit_failed", error=str(e))
            self._log(run_id, "err", "github", "failed to push commit")
            return

        # Create PR
        pr_body = _build_pr_body(ctx, sandbox_result, confidence)
        try:
            pr = await github.create_pull_request(
                repo=ctx.repo_full_name,
                title=f"[AutoFix] {ctx.failure_type} in {os.path.basename(ctx.failing_file)}",
                body=pr_body,
                head=branch,
                base=ctx.head_branch,
                labels=["autofix", "automated"],
            )
            logger.info(
                "agent.pr_created",
                pr_number=pr.get("number"),
                pr_url=pr.get("html_url"),
            )
            fix.pr = f"#{pr.get('number')}"
            fix.pr_url = pr.get("html_url", "")
            self._log(run_id, "ok", "github", f"✓ pushed {fix.commit_sha} → PR {fix.pr}")
        except Exception as e:
            logger.error("agent.pr_creation_failed", error=str(e))
            self._log(run_id, "err", "github", "failed to open PR")


def _build_pr_body(ctx: FailureContext, sandbox_result, confidence: float) -> str:
    return f"""## 🤖 AutoFix — Automated Repair

**Workflow**: `{ctx.workflow_name}` · Run [#{ctx.run_id}]({ctx.run_url})
**Failure**: `{ctx.failure_type}` in `{ctx.failing_file}`{f' (line {ctx.line_number})' if ctx.line_number else ''}

### Error
```
{ctx.error_message}
```

### Sandbox Validation
| Metric | Value |
|--------|-------|
| Tests passed | {sandbox_result.tests_passed or '—'} |
| Tests failed | {sandbox_result.tests_failed or 0} |
| Duration | {sandbox_result.duration_seconds}s |
| AI confidence | {confidence:.0%} |

### Process
1. GitHub Action failed → webhook triggered AutoFix.sh
2. Logs analyzed → `{ctx.failure_type}` classified
3. AI patch generated (confidence {confidence:.0%})
4. Patch validated in isolated Docker sandbox (`node:20-alpine`)
5. All tests passed → this PR created automatically

---
*Generated by [AutoFix.sh](https://github.com/apps/autofix-sh) · {datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")}*
"""
