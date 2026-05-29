from fastapi import APIRouter
from pydantic import BaseModel
import time

router = APIRouter(tags=["health"])
_start_time = time.time()


class HealthResponse(BaseModel):
    status: str
    uptime_seconds: float
    version: str = "0.1.0"


@router.get("/health", response_model=HealthResponse)
async def health_check() -> HealthResponse:
    return HealthResponse(
        status="ok",
        uptime_seconds=round(time.time() - _start_time, 2),
    )


@router.get("/health/live")
async def liveness() -> dict[str, str]:
    """Kubernetes-style liveness probe."""
    return {"status": "alive"}
