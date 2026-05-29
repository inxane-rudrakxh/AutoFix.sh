from __future__ import annotations
from typing import Any
from pydantic import BaseModel


class GitHubWorkflowRunEvent(BaseModel):
    action: str
    workflow_run: dict[str, Any]
    repository: dict[str, Any]
    sender: dict[str, Any]
    installation: dict[str, Any] | None = None


class GitHubCheckSuiteEvent(BaseModel):
    action: str
    check_suite: dict[str, Any]
    repository: dict[str, Any]
    sender: dict[str, Any]
    installation: dict[str, Any] | None = None


class FailureContext(BaseModel):
    """Structured failure extracted from raw GitHub Actions logs."""
    repo_full_name: str          # "org/repo"
    run_id: int
    run_url: str
    workflow_name: str
    head_sha: str
    head_branch: str
    actor: str
    raw_logs: str
    failure_type: str = "Unknown"
    failing_file: str = ""
    line_number: int | None = None
    error_message: str = ""
    stack_trace: list[str] = []
    log_window: str = ""         # 30-line context around error


class AgentEvent(BaseModel):
    """SSE event pushed to frontend during agent execution."""
    type: str
    deployment_id: str
    payload: dict[str, Any] = {}
    timestamp: str
