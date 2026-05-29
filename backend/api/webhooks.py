"""
GitHub Webhooks endpoint.

Receives GitHub App webhook events, verifies HMAC signature,
and dispatches to the appropriate handler.
"""

import json
from fastapi import APIRouter, BackgroundTasks, Header, HTTPException, Request
from github.signature import verify_signature
from github.webhook_handler import WebhookHandler
from config import get_settings
from utils.logging import get_logger

router = APIRouter(prefix="/webhooks", tags=["webhooks"])
logger = get_logger(__name__)
_handler = WebhookHandler()


@router.post("/github")
async def github_webhook(
    request: Request,
    background_tasks: BackgroundTasks,
    x_hub_signature_256: str = Header(None),
    x_github_event: str = Header(None),
    x_github_delivery: str = Header(None),
) -> dict[str, str]:
    settings = get_settings()
    body = await request.body()

    # ── HMAC verification ────────────────────────────────────────────────────
    if not settings.github_webhook_secret:
        logger.warning("GITHUB_WEBHOOK_SECRET not configured — skipping signature verification")
    else:
        if not x_hub_signature_256:
            raise HTTPException(status_code=400, detail="Missing X-Hub-Signature-256 header")
        if not verify_signature(body, x_hub_signature_256, settings.github_webhook_secret):
            logger.warning("webhook.signature_invalid", delivery=x_github_delivery)
            raise HTTPException(status_code=401, detail="Invalid webhook signature")

    try:
        payload = json.loads(body)
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid JSON payload")

    logger.info(
        "webhook.received",
        event=x_github_event,
        delivery=x_github_delivery,
        action=payload.get("action"),
    )

    # ── Dispatch ─────────────────────────────────────────────────────────────
    background_tasks.add_task(
        _handler.dispatch,
        event_type=x_github_event or "",
        payload=payload,
        delivery_id=x_github_delivery or "",
    )

    return {"status": "accepted", "delivery": x_github_delivery or ""}
