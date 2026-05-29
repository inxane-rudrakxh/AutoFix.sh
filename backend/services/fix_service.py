from __future__ import annotations
import json
from models import FixSummary, FixDetail, DiffLine
from services.db import get_db_connection

class FixService:
    """Manages fix details inside SQLite database."""

    async def list(self) -> list[FixDetail]:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM fixes ORDER BY id DESC")
        rows = cursor.fetchall()
        conn.close()
        
        data = []
        for f in rows:
            diff_list = json.loads(f["diff"]) if f["diff"] else []
            diff = [DiffLine(**d) for d in diff_list]
            
            data.append(FixDetail(
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
            ))
        return data

    async def get(self, fix_id: str) -> FixDetail | None:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM fixes WHERE id = ?", (fix_id,))
        f = cursor.fetchone()
        conn.close()
        if not f:
            return None
            
        diff_list = json.loads(f["diff"]) if f["diff"] else []
        diff = [DiffLine(**d) for d in diff_list]
        
        return FixDetail(
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

    def upsert(self, fix: FixDetail) -> None:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        diff_json = json.dumps([d.model_dump(by_alias=True) for d in fix.diff])
        created_at_str = fix.created_at.isoformat() if hasattr(fix.created_at, "isoformat") else str(fix.created_at)
        
        cursor.execute(
            """INSERT OR REPLACE INTO fixes (
                id, pr, pr_url, org, repo, file, summary, lines_add, lines_del, status, created_at, diff, sandbox_duration, tests_passed, commit_sha, ai_confidence, commit_message
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
            (
                fix.id,
                fix.pr,
                fix.pr_url,
                fix.org,
                fix.repo,
                fix.file,
                fix.summary,
                fix.lines.get("add", 0),
                fix.lines.get("del", 0),
                fix.status,
                created_at_str,
                diff_json,
                fix.sandbox_duration,
                fix.tests_passed,
                fix.commit_sha,
                fix.ai_confidence,
                fix.commit_message
            )
        )
        conn.commit()
        conn.close()
