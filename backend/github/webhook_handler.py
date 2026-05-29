"""
GitHub webhook event dispatcher.
Routes incoming GitHub events to SQLite persistence and the AI repair agent.
"""

from __future__ import annotations

import time
from datetime import datetime
from typing import Any
from github.client import GitHubClient, get_installation_token
from agents.fix_agent import FixAgent
from models.webhook import FailureContext
from models import DeploymentDetail, TimelineStep
from services.state import deployment_service, log_service
from services.event_bus import event_bus
from utils.logging import get_logger

logger = get_logger(__name__)


class WebhookHandler:
    def __init__(self) -> None:
        self._agent = FixAgent()

    async def dispatch(
        self,
        event_type: str,
        payload: dict[str, Any],
        delivery_id: str,
    ) -> None:
        """Route the event to the correct handler."""
        try:
            if event_type == "workflow_run":
                await self._handle_workflow_run(payload, delivery_id)
            elif event_type == "check_suite":
                await self._handle_check_suite(payload, delivery_id)
            elif event_type == "pull_request":
                await self._handle_pull_request(payload, delivery_id)
            else:
                logger.debug("webhook.ignored", event=event_type, delivery=delivery_id)
        except Exception as exc:
            logger.error("webhook.handler_error", event=event_type, error=str(exc), exc_info=True)

    async def _handle_workflow_run(self, payload: dict[str, Any], delivery_id: str) -> None:
        action = payload.get("action")
        run = payload.get("workflow_run", {})

        # We process completed runs
        if action != "completed":
            return

        repo = payload.get("repository", {})
        repo_full_name: str = repo.get("full_name", "")
        installation_id: int = payload.get("installation", {}).get("id", 0)
        conclusion = run.get("conclusion")

        logger.info(
            "webhook.workflow_run",
            repo=repo_full_name,
            run_id=run.get("id"),
            conclusion=conclusion,
            delivery=delivery_id,
        )

        # Create base DeploymentDetail
        head_sha = run.get("head_sha", "")
        status = "success" if conclusion == "success" else "failed"
        
        deployment = DeploymentDetail(
            id=head_sha[:7] if head_sha else str(run.get("id")),
            org=repo.get("owner", {}).get("login", ""),
            repo=repo.get("name", ""),
            branch=run.get("head_branch", ""),
            status=status,
            author=run.get("triggering_actor", {}).get("login", "unknown"),
            duration="—",
            time="Just now",
            commitMessage=run.get("head_commit", {}).get("message", "Commit message unavailable"),
            workflowName=run.get("name", "CI"),
            runId=str(run.get("id")),
            headSha=head_sha,
            timeline=[
                TimelineStep(
                    t=datetime.now().strftime("%H:%M:%S"),
                    label=f"Workflow run completed: {conclusion}",
                    state="success" if conclusion == "success" else "error",
                    iconKey="CheckCircle2" if conclusion == "success" else "XCircle"
                )
            ],
            logs=[],
        )
        
        # If it failed, we'll start with status "monitoring" to trigger self-healing pipeline
        if conclusion in ("failure", "timed_out"):
            deployment.status = "monitoring"
            deployment.timeline.append(
                TimelineStep(
                    t=datetime.now().strftime("%H:%M:%S"),
                    label="Failure detected, launching AutoFix agent",
                    state="running",
                    iconKey="Sparkles"
                )
            )
            deployment_service.upsert(deployment)
            event_bus.publish("deployment.started", deployment)

            # Authenticate as GitHub App installation
            try:
                token = await get_installation_token(installation_id)
                github = GitHubClient(token)
                
                # Fetch logs
                raw_logs = await github.get_workflow_run_logs(
                    repo=repo_full_name,
                    run_id=run["id"],
                )
                
                ctx = FailureContext(
                    repo_full_name=repo_full_name,
                    run_id=run["id"],
                    run_url=run.get("html_url", ""),
                    workflow_name=run.get("name", "CI"),
                    head_sha=run.get("head_sha", ""),
                    head_branch=run.get("head_branch", ""),
                    actor=run.get("triggering_actor", {}).get("login", "unknown"),
                    raw_logs=raw_logs,
                )
                
                # Run the self-repair agent
                await self._agent.run(ctx, github)
            except Exception as e:
                logger.error("webhook.agent_trigger_failed", error=str(e))
                deployment.status = "failed"
                deployment.timeline.append(
                    TimelineStep(
                        t=datetime.now().strftime("%H:%M:%S"),
                        label=f"Agent initialization failed: {str(e)}",
                        state="error",
                        iconKey="XCircle"
                    )
                )
                deployment_service.upsert(deployment)
                event_bus.publish("status.changed", deployment)
        else:
            # It passed! Just save to SQLite and publish
            deployment_service.upsert(deployment)
            event_bus.publish("deployment.started", deployment)

    async def _handle_check_suite(self, payload: dict[str, Any], delivery_id: str) -> None:
        action = payload.get("action")
        suite = payload.get("check_suite", {})

        if action != "completed":
            return
        conclusion = suite.get("conclusion")
        if conclusion not in ("failure", "timed_out"):
            return

        repo = payload.get("repository", {})
        repo_full_name = repo.get("full_name")
        logger.info(
            "webhook.check_suite_failed",
            repo=repo_full_name,
            conclusion=conclusion,
            delivery=delivery_id,
        )

        head_sha = suite.get("head_sha", "")
        if not head_sha:
            return

        # Check if we already have this deployment. If not, create a simple failure deployment
        deployment = deployment_service.get_sync(head_sha[:7])
        if not deployment:
            deployment = DeploymentDetail(
                id=head_sha[:7],
                org=repo.get("owner", {}).get("login", ""),
                repo=repo.get("name", ""),
                branch=suite.get("head_branch", ""),
                status="failed",
                author="github-actions",
                duration="—",
                time="Just now",
                commitMessage="Check suite failed build",
                workflowName="Check Suite",
                runId=str(suite.get("id")),
                headSha=head_sha,
                timeline=[
                    TimelineStep(
                        t=datetime.now().strftime("%H:%M:%S"),
                        label=f"Check suite failed: {conclusion}",
                        state="error",
                        iconKey="XCircle"
                    )
                ],
                logs=[]
            )
            deployment_service.upsert(deployment)
            event_bus.publish("deployment.started", deployment)

    async def _handle_pull_request(self, payload: dict[str, Any], delivery_id: str) -> None:
        action = payload.get("action")
        pr = payload.get("pull_request", {})
        repo = payload.get("repository", {})

        logger.info(
            "webhook.pull_request",
            action=action,
            repo=repo.get("full_name"),
            pr_number=pr.get("number"),
            delivery=delivery_id,
        )

        head_sha = pr.get("head", {}).get("sha", "")
        if not head_sha:
            return

        # Add a timeline event to matching commit deployments
        deployment = deployment_service.get_sync(head_sha[:7])
        if deployment:
            deployment.timeline.append(
                TimelineStep(
                    t=datetime.now().strftime("%H:%M:%S"),
                    label=f"Pull Request #{pr.get('number')} {action}",
                    state="success" if action in ("opened", "reopened", "synchronized") else "done",
                    iconKey="Loader2" if action == "synchronized" else "CheckCircle2"
                )
            )
            deployment_service.upsert(deployment)
            event_bus.publish("status.changed", deployment)
