"""
Docker sandbox — runs patched repository tests in an isolated container.
"""

from __future__ import annotations

import os
import shutil
import tempfile
import subprocess
import time
from pydantic import BaseModel
from config import get_settings
from utils.logging import get_logger

logger = get_logger(__name__)


class SandboxResult(BaseModel):
    success: bool
    exit_code: int
    stdout: str
    stderr: str
    duration_seconds: float
    tests_passed: int | None = None
    tests_failed: int | None = None


class DockerSandbox:
    """Executes test suite in an isolated Docker container."""

    def __init__(self) -> None:
        self._settings = get_settings()

    async def run(self, workspace_path: str) -> SandboxResult:
        """
        Run the test suite in an isolated Docker container.

        Args:
            workspace_path: Path to the cloned+patched repository directory

        Returns:
            SandboxResult with test outcome
        """
        settings = self._settings

        if not settings.sandbox_enabled:
            logger.warning("sandbox.disabled — returning mock success")
            return SandboxResult(
                success=True,
                exit_code=0,
                stdout="[sandbox disabled — mock pass]",
                stderr="",
                duration_seconds=0.1,
                tests_passed=1,
            )

        abs_path = os.path.abspath(workspace_path)
        cmd = [
            "docker", "run",
            "--rm",
            "--network=none",
            f"--memory={settings.sandbox_memory_limit}",
            "--cpus=1",
            "-v", f"{abs_path}:/app",
            "-w", "/app",
            settings.sandbox_image,
            "sh", "-c", settings.sandbox_test_command,
        ]

        logger.info(
            "sandbox.starting",
            image=settings.sandbox_image,
            workspace=abs_path,
            command=settings.sandbox_test_command,
        )

        start = time.monotonic()
        try:
            result = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                timeout=settings.sandbox_timeout_seconds,
            )
            duration = time.monotonic() - start
            success = result.returncode == 0

            tests_passed, tests_failed = _parse_test_counts(result.stdout + result.stderr)

            logger.info(
                "sandbox.complete",
                success=success,
                exit_code=result.returncode,
                duration=round(duration, 2),
                tests_passed=tests_passed,
                tests_failed=tests_failed,
            )

            return SandboxResult(
                success=success,
                exit_code=result.returncode,
                stdout=result.stdout[-10_000:],   # Cap output size
                stderr=result.stderr[-5_000:],
                duration_seconds=round(duration, 2),
                tests_passed=tests_passed,
                tests_failed=tests_failed,
            )

        except subprocess.TimeoutExpired:
            duration = time.monotonic() - start
            logger.error("sandbox.timeout", timeout=settings.sandbox_timeout_seconds)
            return SandboxResult(
                success=False,
                exit_code=-1,
                stdout="",
                stderr=f"Sandbox timed out after {settings.sandbox_timeout_seconds}s",
                duration_seconds=duration,
            )
        except FileNotFoundError:
            logger.error("sandbox.docker_not_found")
            return SandboxResult(
                success=False,
                exit_code=-2,
                stdout="",
                stderr="Docker not found. Ensure Docker is installed and running.",
                duration_seconds=0,
            )


def _parse_test_counts(output: str) -> tuple[int | None, int | None]:
    """Extract passed/failed counts from vitest/jest/pytest output."""
    import re

    # Vitest: "✓ Tests  247 passed (247)"
    m = re.search(r"(\d+)\s+passed", output)
    passed = int(m.group(1)) if m else None

    m2 = re.search(r"(\d+)\s+failed", output)
    failed = int(m2.group(1)) if m2 else None

    # pytest: "5 passed, 1 failed"
    if passed is None:
        m3 = re.search(r"(\d+) passed", output)
        passed = int(m3.group(1)) if m3 else None

    return passed, failed


def create_workspace(run_id: str | int) -> str:
    """Create a clean temporary workspace directory for a run."""
    settings = get_settings()
    base = os.path.join(settings.workspace_dir, str(run_id))
    os.makedirs(base, exist_ok=True)
    return base


def cleanup_workspace(workspace_path: str) -> None:
    """Remove the temporary workspace directory."""
    try:
        shutil.rmtree(workspace_path, ignore_errors=True)
        logger.debug("sandbox.workspace_cleaned", path=workspace_path)
    except Exception as e:
        logger.warning("sandbox.cleanup_failed", path=workspace_path, error=str(e))
