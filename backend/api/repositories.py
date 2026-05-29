from fastapi import APIRouter
from pydantic import Field
from typing import Literal

from config import get_settings
from github.client import GitHubClient, get_installation_token
from services.db import get_db_connection
from models import CamelModel, Status

router = APIRouter(prefix="/repositories", tags=["repositories"])


class Repository(CamelModel):
    name: str
    org: str
    lang: str
    stars: int
    open_prs: int = Field(alias="openPRs")
    pass_rate: float = Field(alias="passRate")
    status: Status
    last_fix: str = Field(alias="lastFix")
    webhook_active: bool = Field(alias="webhookActive")


@router.get("", response_model=list[Repository])
async def list_repositories() -> list[Repository]:
    settings = get_settings()
    
    # Try fetching from GitHub App installation if credentials configured
    if settings.github_installation_id and settings.github_app_id and settings.github_app_private_key:
        try:
            token = await get_installation_token(settings.github_installation_id)
            client = GitHubClient(token)
            data = await client.get_installation_repositories()
            
            repos = []
            for r in data.get("repositories", []):
                # Check if this repository exists in local DB to read pass_rate / last_fix
                conn = get_db_connection()
                cursor = conn.cursor()
                cursor.execute("SELECT pass_rate, status, last_fix, open_prs FROM repositories WHERE name = ?", (r["name"],))
                local_repo = cursor.fetchone()
                conn.close()
                
                pass_rate = local_repo["pass_rate"] if local_repo else 100.0
                status = local_repo["status"] if local_repo else "success"
                last_fix = local_repo["last_fix"] if local_repo else "—"
                open_prs = local_repo["open_prs"] if local_repo else 0
                
                repos.append(Repository(
                    name=r["name"],
                    org=r["owner"]["login"],
                    lang=r.get("language") or "Unknown",
                    stars=r.get("stargazers_count", 0),
                    openPRs=open_prs,
                    passRate=pass_rate,
                    status=status,
                    lastFix=last_fix,
                    webhookActive=True
                ))
            return repos
        except Exception as e:
            import traceback
            traceback.print_exc()
            # If GitHub API fails, fall back to SQLite table
            pass

    # Fallback to local SQLite database records
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT name, org, lang, stars, webhook_active, open_prs, pass_rate, last_fix FROM repositories")
    rows = cursor.fetchall()
    conn.close()
    
    repos = []
    for r in rows:
        repos.append(Repository(
            name=r["name"],
            org=r["org"],
            lang=r["lang"],
            stars=r["stars"],
            openPRs=r["open_prs"],
            passRate=r["pass_rate"],
            status="healed" if r["last_fix"] != "—" else "success",
            lastFix=r["last_fix"],
            webhookActive=bool(r["webhook_active"])
        ))
    return repos
