from __future__ import annotations
import json
from models import Deployment, DeploymentDetail, PaginatedDeployments
from models import LogLine, TimelineStep, FixDetail, DiffLine
from services.db import get_db_connection

class DeploymentService:
    """Manages deployment records inside SQLite database."""

    async def list(self, page: int = 1, page_size: int = 20) -> PaginatedDeployments:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Get total count
        cursor.execute("SELECT COUNT(*) as count FROM deployments")
        total = cursor.fetchone()["count"]
        
        # Get paginated data
        offset = (page - 1) * page_size
        cursor.execute(
            "SELECT * FROM deployments ORDER BY id DESC LIMIT ? OFFSET ?",
            (page_size, offset)
        )
        rows = cursor.fetchall()
        conn.close()
        
        data = []
        for r in rows:
            data.append(Deployment(
                id=r["id"],
                org=r["org"],
                repo=r["repo"],
                branch=r["branch"],
                status=r["status"],
                author=r["author"],
                duration=r["duration"],
                time=r["time"],
                commitMessage=r["commit_message"]
            ))
            
        return PaginatedDeployments(
            data=data,
            total=total,
            page=page,
            page_size=page_size
        )

    async def get(self, deployment_id: str) -> DeploymentDetail | None:
        return self.get_sync(deployment_id)

    def get_sync(self, deployment_id: str) -> DeploymentDetail | None:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM deployments WHERE id = ?", (deployment_id,))
        r = cursor.fetchone()
        if not r:
            conn.close()
            return None
            
        # If fix_id is present, get the fix details
        fix_detail = None
        if r["fix_id"]:
            cursor.execute("SELECT * FROM fixes WHERE id = ?", (r["fix_id"],))
            f = cursor.fetchone()
            if f:
                diff_list = json.loads(f["diff"]) if f["diff"] else []
                diff = [DiffLine(**d) for d in diff_list]
                
                fix_detail = FixDetail(
                    id=f["id"],
                    pr=f["pr"],
                    prUrl=f["pr_url"],
                    org=f["org"],
                    repo=f["repo"],
                    file=f["file"],
                    summary=f["summary"],
                    lines={"add": f["lines_add"], "del": f["lines_del"]},
                    status=f["status"],
                    createdAt=f["created_at"],
                    diff=diff,
                    sandboxDuration=f["sandbox_duration"],
                    testsPassed=f["tests_passed"],
                    commitSha=f["commit_sha"],
                    aiConfidence=f["ai_confidence"],
                    commitMessage=f["commit_message"]
                )
                
        # Parse timeline & logs
        timeline_list = json.loads(r["timeline"]) if r["timeline"] else []
        timeline = [TimelineStep(**t) for t in timeline_list]
        
        logs_list = json.loads(r["logs"]) if r["logs"] else []
        logs = [LogLine(**l) for l in logs_list]
        
        detail = DeploymentDetail(
            id=r["id"],
            org=r["org"],
            repo=r["repo"],
            branch=r["branch"],
            status=r["status"],
            author=r["author"],
            duration=r["duration"],
            time=r["time"],
            commitMessage=r["commit_message"],
            workflowName=r["workflow_name"],
            runId=r["run_id"],
            headSha=r["head_sha"],
            timeline=timeline,
            logs=logs,
            fix=fix_detail
        )
        conn.close()
        return detail

    def upsert(self, deployment: DeploymentDetail) -> None:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        timeline_json = json.dumps([t.model_dump(by_alias=True) for t in deployment.timeline])
        logs_json = json.dumps([l.model_dump(by_alias=True) for l in deployment.logs])
        fix_id = deployment.fix.id if deployment.fix else None
        
        cursor.execute(
            """INSERT OR REPLACE INTO deployments (
                id, org, repo, branch, status, author, duration, time, commit_message, workflow_name, run_id, head_sha, timeline, logs, fix_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
            (
                deployment.id,
                deployment.org,
                deployment.repo,
                deployment.branch,
                deployment.status,
                deployment.author,
                deployment.duration,
                deployment.time,
                deployment.commit_message,
                deployment.workflow_name,
                deployment.run_id,
                deployment.head_sha,
                timeline_json,
                logs_json,
                fix_id
            )
        )
        conn.commit()
        conn.close()
