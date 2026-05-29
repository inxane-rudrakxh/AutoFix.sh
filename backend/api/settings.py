from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
from config import get_settings
from services.db import save_setting_to_db

router = APIRouter(prefix="/settings", tags=["settings"])


class SettingsStatus(BaseModel):
    github_app_name: str | None
    github_org: str | None
    github_installation_id: int
    sandbox_image: str
    sandbox_timeout: int
    has_openai_key: bool
    has_webhook_secret: bool


class UpdateSettingsRequest(BaseModel):
    github_app_id: Optional[str] = None
    github_installation_id: Optional[int] = None
    sandbox_image: Optional[str] = None
    sandbox_timeout_seconds: Optional[int] = None
    openai_api_key: Optional[str] = None
    github_webhook_secret: Optional[str] = None


@router.get("/status", response_model=SettingsStatus)
async def get_settings_status() -> SettingsStatus:
    settings = get_settings()
    return SettingsStatus(
        github_app_name=settings.github_app_id or None,
        github_org=str(settings.github_installation_id) if settings.github_installation_id else None,
        github_installation_id=settings.github_installation_id,
        sandbox_image=settings.sandbox_image,
        sandbox_timeout=settings.sandbox_timeout_seconds,
        has_openai_key=bool(settings.openai_api_key),
        has_webhook_secret=bool(settings.github_webhook_secret)
    )


@router.post("", response_model=dict[str, str])
async def update_settings(payload: UpdateSettingsRequest) -> dict[str, str]:
    settings = get_settings()
    for field, val in payload.model_dump(exclude_unset=True).items():
        if val is not None:
            save_setting_to_db(field, str(val))
    return {"status": "updated"}
