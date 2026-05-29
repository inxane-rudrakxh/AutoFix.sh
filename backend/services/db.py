"""
SQLite Database Service for AutoFix.sh.
Provides connection helpers, dynamic settings storage/loading, schema setup, and seed data.
"""

import sqlite3
import os
import json
from config import get_settings

DB_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "autofix.db")

def get_db_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # 1. Settings Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT
    )
    """)
    
    # 2. Repositories Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS repositories (
        name TEXT PRIMARY KEY,
        org TEXT,
        lang TEXT,
        stars INTEGER,
        webhook_active INTEGER,
        open_prs INTEGER,
        pass_rate REAL,
        last_fix TEXT
    )
    """)
    
    # 3. Fixes Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS fixes (
        id TEXT PRIMARY KEY,
        pr TEXT,
        pr_url TEXT,
        org TEXT,
        repo TEXT,
        file TEXT,
        summary TEXT,
        lines_add INTEGER,
        lines_del INTEGER,
        status TEXT,
        created_at TEXT,
        diff TEXT,
        sandbox_duration REAL,
        tests_passed INTEGER,
        commit_sha TEXT,
        ai_confidence REAL,
        commit_message TEXT
    )
    """)
    
    # 4. Deployments Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS deployments (
        id TEXT PRIMARY KEY,
        org TEXT,
        repo TEXT,
        branch TEXT,
        status TEXT,
        author TEXT,
        duration TEXT,
        time TEXT,
        commit_message TEXT,
        workflow_name TEXT,
        run_id TEXT,
        head_sha TEXT,
        timeline TEXT,
        logs TEXT,
        fix_id TEXT,
        FOREIGN KEY(fix_id) REFERENCES fixes(id)
    )
    """)
    
    conn.commit()
    conn.close()
    
    # Seed tables if they are empty
    seed_db()
    
    # Load settings from DB into config settings instance
    load_settings_into_config()

def load_settings_into_config():
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT key, value FROM settings")
        rows = cursor.fetchall()
    except sqlite3.OperationalError:
        rows = []
    finally:
        conn.close()
    
    settings = get_settings()
    for row in rows:
        key, value = row["key"], row["value"]
        if hasattr(settings, key):
            expected_type = type(getattr(settings, key))
            if expected_type is bool:
                val = value.lower() in ("true", "1", "yes")
            elif expected_type is int:
                val = int(value)
            elif expected_type is float:
                val = float(value)
            elif expected_type is list:
                try:
                    val = json.loads(value)
                except:
                    val = [v.strip() for v in value.split(",") if v.strip()]
            else:
                val = value
            setattr(settings, key, val)

def save_setting_to_db(key: str, value: str):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)",
        (key, value)
    )
    conn.commit()
    conn.close()
    load_settings_into_config()

def seed_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Check if repositories is empty
    cursor.execute("SELECT COUNT(*) as count FROM repositories")
    if cursor.fetchone()["count"] == 0:
        repos = [
            ("api-gateway", "acme-corp", "TypeScript", 1240, 1, 7, 98.0, "2m ago"),
            ("web-client", "acme-corp", "TypeScript", 882, 1, 4, 96.0, "12m ago"),
            ("worker-queue", "acme-corp", "JavaScript", 311, 1, 2, 99.0, "1h ago"),
            ("ml-pipeline", "acme-corp", "Python", 540, 1, 1, 92.0, "31m ago"),
            ("billing", "acme-corp", "TypeScript", 198, 1, 3, 100.0, "4h ago"),
            ("docs", "acme-corp", "MDX", 88, 0, 0, 100.0, "—")
        ]
        cursor.executemany(
            "INSERT INTO repositories (name, org, lang, stars, webhook_active, open_prs, pass_rate, last_fix) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            repos
        )
    
    # Check if fixes is empty
    cursor.execute("SELECT COUNT(*) as count FROM fixes")
    if cursor.fetchone()["count"] == 0:
        diff_842 = [
            {"type": "context", "text": "  export async function getUser(req: Request) {"},
            {"type": "context", "text": "    const { id } = req.params;"},
            {"type": "del", "text": "    const user = await db.users.findOne({ id: id });"},
            {"type": "add", "text": "    if (!id) return null;"},
            {"type": "add", "text": "    const user = await db.users.findOne({ id });"},
            {"type": "context", "text": "    return user;"},
            {"type": "context", "text": "  }"}
        ]
        diff_840 = [
            {"type": "del", "text": "const user == verifyJwt(token)"},
            {"type": "add", "text": "const user = await verifyJwt(token);"}
        ]
        diff_838 = [
            {"type": "del", "text": "expect(res.body).toEqual({ ok: ture });"},
            {"type": "add", "text": "expect(res.body).toEqual({ ok: true });"}
        ]
        
        fixes = [
            ("fix-842", "#842", "https://github.com", "acme-corp", "api-gateway", "src/handlers/user.ts", "Guard undefined user.id in getUser handler", 2, 1, "healed", "2026-05-29T10:00:00Z", json.dumps(diff_842), 19.0, 247, "4f8e2d1", 0.97, "[AutoFix] Guard undefined user.id in getUser · PR #842"),
            ("fix-840", "#840", "https://github.com", "acme-corp", "api-gateway", "lib/auth/jwt.ts", "Use strict equality and await token verification", 5, 3, "healed", "2026-05-29T09:50:00Z", json.dumps(diff_840), 22.0, 183, "9c1a3b7", 0.99, "[AutoFix] Await verifyJwt and fix equality operator · PR #840"),
            ("fix-838", "#838", "https://github.com", "acme-corp", "web-client", "tests/api.spec.ts", "Fix typo in expected response payload", 1, 1, "healed", "2026-05-29T09:30:00Z", json.dumps(diff_838), 14.0, 94, "1a2d903", 1.0, "[AutoFix] Fix typo in test assertion · PR #838")
        ]
        cursor.executemany(
            """INSERT INTO fixes (
                id, pr, pr_url, org, repo, file, summary, lines_add, lines_del, status, created_at, diff, sandbox_duration, tests_passed, commit_sha, ai_confidence, commit_message
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
            fixes
        )

    # Check if deployments is empty
    cursor.execute("SELECT COUNT(*) as count FROM deployments")
    if cursor.fetchone()["count"] == 0:
        timeline_1 = [
            {"t": "14:02:11", "label": "Build started", "state": "done", "iconKey": "GitCommit"},
            {"t": "14:02:14", "label": "Tests failed", "state": "error", "iconKey": "XCircle"},
            {"t": "14:02:15", "label": "AI analysis started", "state": "done", "iconKey": "Sparkles"},
            {"t": "14:02:18", "label": "Patch generated", "state": "done", "iconKey": "Sparkles"},
            {"t": "14:02:22", "label": "Sandbox validation", "state": "done", "iconKey": "ShieldCheck"},
            {"t": "14:02:43", "label": "Commit pushed → PR #842", "state": "success", "iconKey": "CheckCircle2"}
        ]
        
        logs_1 = [
            {"t": "14:02:11.412", "lvl": "info", "src": "runner", "msg": "$ npm ci"},
            {"t": "14:02:13.108", "lvl": "info", "src": "runner", "msg": "added 1,247 packages in 1.8s"},
            {"t": "14:02:13.420", "lvl": "info", "src": "runner", "msg": "$ npm test"},
            {"t": "14:02:14.001", "lvl": "err", "src": "vitest", "msg": "FAIL tests/handlers/user.spec.ts"},
            {"t": "14:02:14.001", "lvl": "err", "src": "vitest", "msg": "  ✕ getUser › returns 404 when id missing (12ms)"},
            {"t": "14:02:14.002", "lvl": "err", "src": "vitest", "msg": "    TypeError: Cannot read properties of undefined (reading 'id')"},
            {"t": "14:02:14.002", "lvl": "err", "src": "vitest", "msg": "        at getUser (src/handlers/user.ts:12:34)"},
            {"t": "14:02:14.500", "lvl": "warn", "src": "ci", "msg": "exit code 1 · 4 tests failed"},
            {"t": "14:02:15.000", "lvl": "ai", "src": "autofix", "msg": "▸ classifying failure: runtime TypeError"},
            {"t": "14:02:15.300", "lvl": "ai", "src": "autofix", "msg": "▸ fetching context: src/handlers/user.ts (24 LOC)"},
            {"t": "14:02:18.110", "lvl": "ai", "src": "autofix", "msg": "▸ patch proposed: guard undefined param"},
            {"t": "14:02:22.401", "lvl": "info", "src": "sandbox", "msg": "spinning isolated node:20-alpine container"},
            {"t": "14:02:25.022", "lvl": "info", "src": "sandbox", "msg": "$ npm ci && npm test"},
            {"t": "14:02:41.870", "lvl": "ok", "src": "vitest", "msg": "✓ Test Files  18 passed (18)"},
            {"t": "14:02:41.871", "lvl": "ok", "src": "vitest", "msg": "✓ Tests       247 passed (247)"},
            {"t": "14:02:43.211", "lvl": "ok", "src": "github", "msg": "✓ pushed 4f8e2d1 to fix/auth → PR #842"}
        ]
        
        deployments = [
            ("4f8e2d1", "acme-corp", "api-gateway", "main", "healed", "rudra", "1m 42s", "2m ago", "fix: handle undefined user.id in handler", "CI", "1247", "4f8e2d1", json.dumps(timeline_1), json.dumps(logs_1), "fix-842"),
            ("9c1a3b7", "acme-corp", "web-client", "feat/checkout", "running", "aria", "—", "4m ago", "feat: add stripe checkout flow", "CI", "1248", "9c1a3b7", json.dumps(timeline_1[:3]), json.dumps(logs_1[:8]), "fix-840"),
            ("2e88f01", "acme-corp", "worker-queue", "main", "success", "ben", "47s", "11m ago", "chore: bump bullmq to 5.4", "CI", "1249", "2e88f01", "[]", "[]", None),
            ("77b4cc9", "acme-corp", "api-gateway", "fix/auth", "failed", "rudra", "1m 12s", "14m ago", "refactor: jwt middleware", "CI", "1250", "77b4cc9", "[]", "[]", None),
            ("1a2d903", "acme-corp", "docs", "main", "success", "kai", "22s", "22m ago", "docs: update install guide", "CI", "1251", "1a2d903", "[]", "[]", None),
            ("ff03e91", "acme-corp", "ml-pipeline", "main", "healed", "mira", "3m 08s", "31m ago", "fix: missing import torch.nn", "CI", "1252", "ff03e91", "[]", "[]", "fix-838")
        ]
        cursor.executemany(
            """INSERT INTO deployments (
                id, org, repo, branch, status, author, duration, time, commit_message, workflow_name, run_id, head_sha, timeline, logs, fix_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
            deployments
        )
        
    conn.commit()
    conn.close()
