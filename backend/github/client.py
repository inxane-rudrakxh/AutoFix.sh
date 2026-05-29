"""
Async GitHub API client using httpx.
Handles GitHub App authentication via JWT + Installation tokens.
"""

from __future__ import annotations

import time
import zipfile
import io
import jwt
import httpx
from config import get_settings
from utils.logging import get_logger

logger = get_logger(__name__)

GITHUB_API = "https://api.github.com"


def _make_app_jwt() -> str:
    """Generate a signed JWT for GitHub App authentication."""
    settings = get_settings()
    now = int(time.time())
    payload = {
        "iat": now - 60,       # Issued 60s ago to handle clock skew
        "exp": now + 600,      # Valid for 10 minutes
        "iss": settings.github_app_id,
    }
    private_key = settings.github_app_private_key
    if private_key and not private_key.startswith("-----"):
        # It's a file path
        with open(private_key) as f:
            private_key = f.read()
    return jwt.encode(payload, private_key, algorithm="RS256")


async def get_installation_token(installation_id: int) -> str:
    """Exchange App JWT for a short-lived installation access token."""
    app_jwt = _make_app_jwt()
    async with httpx.AsyncClient() as client:
        res = await client.post(
            f"{GITHUB_API}/app/installations/{installation_id}/access_tokens",
            headers={
                "Authorization": f"Bearer {app_jwt}",
                "Accept": "application/vnd.github+json",
            },
        )
        res.raise_for_status()
        return res.json()["token"]


class GitHubClient:
    """Authenticated async GitHub API client."""

    def __init__(self, token: str) -> None:
        self._token = token
        self._headers = {
            "Authorization": f"Bearer {token}",
            "Accept": "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
        }

    async def get_installation_repositories(self) -> dict:
        """Fetch repositories accessible by this installation."""
        async with httpx.AsyncClient() as client:
            res = await client.get(
                f"{GITHUB_API}/installation/repositories",
                headers=self._headers,
            )
            res.raise_for_status()
            return res.json()

    async def get_workflow_run_logs(self, repo: str, run_id: int) -> str:
        """Download and extract logs from a workflow run as plain text."""
        async with httpx.AsyncClient(follow_redirects=True) as client:
            # First get the download URL
            res = await client.get(
                f"{GITHUB_API}/repos/{repo}/actions/runs/{run_id}/logs",
                headers=self._headers,
            )
            if res.status_code == 302 or res.status_code == 200:
                # Download the ZIP
                zip_res = await client.get(res.headers.get("location", str(res.url)))
                zip_bytes = zip_res.content
            else:
                res.raise_for_status()
                zip_bytes = res.content

        # Extract all .txt files from the ZIP
        all_lines: list[str] = []
        try:
            with zipfile.ZipFile(io.BytesIO(zip_bytes)) as z:
                for name in sorted(z.namelist()):
                    if name.endswith(".txt"):
                        content = z.read(name).decode("utf-8", errors="replace")
                        all_lines.append(f"=== {name} ===\n{content}")
        except zipfile.BadZipFile:
            # Some small runs return plain text directly
            all_lines.append(zip_bytes.decode("utf-8", errors="replace"))

        return "\n".join(all_lines)

    async def get_file_content(self, repo: str, path: str, ref: str) -> str:
        """Fetch a file's raw content from GitHub at a specific ref."""
        import base64
        async with httpx.AsyncClient() as client:
            res = await client.get(
                f"{GITHUB_API}/repos/{repo}/contents/{path}",
                headers=self._headers,
                params={"ref": ref},
            )
            res.raise_for_status()
            data = res.json()
            return base64.b64decode(data["content"]).decode("utf-8")

    async def create_branch(self, repo: str, branch: str, sha: str) -> None:
        """Create a new branch at a given commit SHA."""
        async with httpx.AsyncClient() as client:
            res = await client.post(
                f"{GITHUB_API}/repos/{repo}/git/refs",
                headers=self._headers,
                json={"ref": f"refs/heads/{branch}", "sha": sha},
            )
            if res.status_code not in (201, 422):  # 422 = branch already exists
                res.raise_for_status()

    async def commit_file(
        self,
        repo: str,
        path: str,
        content: str,
        message: str,
        branch: str,
        sha: str | None = None,
    ) -> dict:
        """Create or update a file in a repo via the Contents API."""
        import base64
        encoded = base64.b64encode(content.encode()).decode()
        body: dict = {"message": message, "content": encoded, "branch": branch}
        if sha:
            body["sha"] = sha

        async with httpx.AsyncClient() as client:
            res = await client.put(
                f"{GITHUB_API}/repos/{repo}/contents/{path}",
                headers=self._headers,
                json=body,
            )
            res.raise_for_status()
            return res.json()

    async def create_pull_request(
        self,
        repo: str,
        title: str,
        body: str,
        head: str,
        base: str,
        labels: list[str] | None = None,
    ) -> dict:
        """Create a pull request."""
        async with httpx.AsyncClient() as client:
            res = await client.post(
                f"{GITHUB_API}/repos/{repo}/pulls",
                headers=self._headers,
                json={"title": title, "body": body, "head": head, "base": base},
            )
            res.raise_for_status()
            pr = res.json()

        # Add labels if requested
        if labels:
            async with httpx.AsyncClient() as client:
                await client.post(
                    f"{GITHUB_API}/repos/{repo}/issues/{pr['number']}/labels",
                    headers=self._headers,
                    json={"labels": labels},
                )

        return pr

    async def create_commit_comment(self, repo: str, sha: str, body: str) -> None:
        """Post a comment on a specific commit."""
        async with httpx.AsyncClient() as client:
            res = await client.post(
                f"{GITHUB_API}/repos/{repo}/commits/{sha}/comments",
                headers=self._headers,
                json={"body": body},
            )
            res.raise_for_status()
