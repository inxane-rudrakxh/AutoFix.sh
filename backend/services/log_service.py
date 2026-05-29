from __future__ import annotations
import json
from models import LogLine
from services.db import get_db_connection

class LogService:
    async def get_logs(self, run_id: str | None = None) -> list[LogLine]:
        conn = get_db_connection()
        cursor = conn.cursor()
        if run_id:
            cursor.execute("SELECT logs FROM deployments WHERE run_id = ? OR id = ?", (run_id, run_id))
        else:
            cursor.execute("SELECT logs FROM deployments ORDER BY id DESC LIMIT 1")
            
        r = cursor.fetchone()
        conn.close()
        
        if r and r["logs"]:
            logs_list = json.loads(r["logs"])
            return [LogLine(**l) for l in logs_list]
        return []

    def append(self, run_id: str, line: LogLine) -> None:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT logs FROM deployments WHERE run_id = ? OR id = ?", (run_id, run_id))
        r = cursor.fetchone()
        if r:
            logs_list = json.loads(r["logs"]) if r["logs"] else []
            logs_list.append(line.model_dump(by_alias=True))
            cursor.execute(
                "UPDATE deployments SET logs = ? WHERE run_id = ? OR id = ?",
                (json.dumps(logs_list), run_id, run_id)
            )
            conn.commit()
        conn.close()
