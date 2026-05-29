"""
AutoFix.sh — FastAPI backend entrypoint.

Run with:
    uvicorn main:app --reload --host 0.0.0.0 --port 8000
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import get_settings
from utils.logging import setup_logging, get_logger

from api.health import router as health_router
from api.deployments import router as deployments_router
from api.repositories import router as repositories_router
from api.fixes import router as fixes_router
from api.logs import router as logs_router
from api.webhooks import router as webhooks_router
from api.events import router as events_router
from api.dashboard import router as dashboard_router
from api.settings import router as settings_router

setup_logging()
logger = get_logger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    from services.db import init_db
    init_db()
    
    settings = get_settings()
    logger.info(
        "autofix.startup",
        version="0.1.0",
        debug=settings.debug,
        sandbox_enabled=settings.sandbox_enabled,
        auto_commit=settings.auto_commit_enabled,
    )
    yield
    logger.info("autofix.shutdown")


def create_app() -> FastAPI:
    settings = get_settings()

    app = FastAPI(
        title="AutoFix.sh API",
        description="AI-powered autonomous self-healing deployment platform",
        version="0.1.0",
        docs_url="/api/docs",
        redoc_url="/api/redoc",
        openapi_url="/api/openapi.json",
        lifespan=lifespan,
    )

    # ── CORS ────────────────────────────────────────────────────────────────
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.allowed_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # ── Routers ──────────────────────────────────────────────────────────────
    app.include_router(health_router)
    app.include_router(deployments_router, prefix="/api")
    app.include_router(repositories_router, prefix="/api")
    app.include_router(fixes_router, prefix="/api")
    app.include_router(logs_router, prefix="/api")
    app.include_router(webhooks_router, prefix="/api")
    app.include_router(events_router, prefix="/api")
    app.include_router(dashboard_router, prefix="/api")
    app.include_router(settings_router, prefix="/api")

    return app


app = create_app()
