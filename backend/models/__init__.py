from __future__ import annotations
from datetime import datetime
from typing import Literal
from pydantic import BaseModel, Field
from pydantic.alias_generators import to_camel


class CamelModel(BaseModel):
    model_config = {
        "alias_generator": to_camel,
        "populate_by_name": True,
    }


Status = Literal["success", "failed", "running", "queued", "healed"]
TimelineState = Literal["done", "error", "success", "running"]
LogLevel = Literal["info", "ok", "err", "ai", "warn"]
DiffLineType = Literal["add", "del", "context"]
IconKey = Literal["GitCommit", "XCircle", "Sparkles", "ShieldCheck", "CheckCircle2", "Loader2"]


class LogLine(CamelModel):
    t: str
    lvl: LogLevel
    src: str
    msg: str


class DiffLine(CamelModel):
    type: DiffLineType
    text: str


class TimelineStep(CamelModel):
    t: str
    label: str
    state: TimelineState
    icon_key: IconKey = Field(alias="iconKey")


class FixSummary(CamelModel):
    id: str
    pr: str
    pr_url: str = Field(alias="prUrl")
    org: str
    repo: str
    file: str
    summary: str
    lines: dict[str, int]      # {"add": 2, "del": 1}
    status: Status
    created_at: datetime = Field(alias="createdAt")


class FixDetail(FixSummary):
    diff: list[DiffLine]
    sandbox_duration: float = Field(alias="sandboxDuration")    # seconds
    tests_passed: int = Field(alias="testsPassed")
    commit_sha: str = Field(alias="commitSha")
    ai_confidence: float = Field(alias="aiConfidence")       # 0.0 – 1.0
    commit_message: str = Field(alias="commitMessage")


class Deployment(CamelModel):
    id: str                    # short commit SHA
    org: str
    repo: str
    branch: str
    status: Status
    author: str
    duration: str
    time: str
    commit_message: str = Field(alias="commitMessage")


class DeploymentDetail(Deployment):
    workflow_name: str = Field(alias="workflowName")
    run_id: str = Field(alias="runId")
    head_sha: str = Field(alias="headSha")
    timeline: list[TimelineStep]
    logs: list[LogLine]
    fix: FixDetail | None = None


class DashboardMetrics(CamelModel):
    deployment_health: float = Field(alias="deploymentHealth")   # percent
    active_repositories: int = Field(alias="activeRepositories")
    ai_fixes_last_24h: int = Field(alias="aiFixesLast24h")
    mean_time_to_heal: int = Field(alias="meanTimeToHeal")     # seconds


class PaginatedDeployments(CamelModel):
    data: list[Deployment]
    total: int
    page: int
    page_size: int
