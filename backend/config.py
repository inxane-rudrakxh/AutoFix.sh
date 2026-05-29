"""
AutoFix.sh backend — environment configuration.
All settings read from environment variables / .env file.
"""

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # ── Server ──────────────────────────────────────────────────────────────
    host: str = "0.0.0.0"
    port: int = 8000
    debug: bool = False
    log_level: str = "INFO"
    allowed_origins: list[str] = ["http://localhost:8080", "http://localhost:3000", "http://localhost:5173"]

    # ── GitHub App ──────────────────────────────────────────────────────────
    github_app_id: str = ""
    github_app_private_key: str = ""          # PEM content or path to PEM file
    github_webhook_secret: str = ""
    github_client_id: str = ""
    github_client_secret: str = ""
    github_installation_id: int = 0

    # ── OpenAI ──────────────────────────────────────────────────────────────
    openai_api_key: str = ""
    openai_model: str = "gpt-4o"
    openai_fallback_model: str = "gpt-4o-mini"
    openai_max_tokens: int = 4096
    openai_temperature: float = 0.1          # Low temp for code generation

    # ── Docker Sandbox ───────────────────────────────────────────────────────
    sandbox_image: str = "node:20-alpine"
    sandbox_timeout_seconds: int = 180
    sandbox_memory_limit: str = "512m"
    sandbox_test_command: str = "npm ci && npm test"

    # ── Storage ──────────────────────────────────────────────────────────────
    workspace_dir: str = "/tmp/autofix"      # Temp clone directory

    # ── Feature flags ────────────────────────────────────────────────────────
    auto_commit_enabled: bool = True          # Set False to dry-run in dev
    sandbox_enabled: bool = True              # Set False to skip Docker in dev


_settings: Settings | None = None


def get_settings() -> Settings:
    global _settings
    if _settings is None:
        _settings = Settings()
    return _settings
