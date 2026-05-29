"""
AI Fix Engine — OpenAI-powered patch generation.
"""

from __future__ import annotations

import difflib
from openai import AsyncOpenAI
from config import get_settings
from models.webhook import FailureContext
from utils.logging import get_logger

logger = get_logger(__name__)

SYSTEM_PROMPT = """\
You are an expert software engineer performing automated bug fixes.

Rules:
- Return ONLY the corrected, complete file content. Nothing else.
- Do NOT include markdown code fences, explanations, or comments about the change.
- Make the MINIMAL possible change to fix the reported error.
- Preserve all formatting, indentation, imports, and code style exactly.
- Do NOT refactor unrelated code.
- If you cannot determine the fix with high confidence, return the original file unchanged.
"""


def _build_user_prompt(ctx: FailureContext, file_content: str) -> str:
    return f"""\
Repository: {ctx.repo_full_name}
Workflow: {ctx.workflow_name}

Error type: {ctx.failure_type}
Error message: {ctx.error_message}
Failing file: {ctx.failing_file}
Line number: {ctx.line_number or "unknown"}

Stack trace:
{chr(10).join(ctx.stack_trace) or "Not available"}

Log context (±20 lines around error):
```
{ctx.log_window}
```

Current file content of `{ctx.failing_file}`:
```
{file_content}
```

Return the complete corrected file content for `{ctx.failing_file}` only.
"""


class FixEngine:
    def __init__(self) -> None:
        settings = get_settings()
        self._client = AsyncOpenAI(api_key=settings.openai_api_key)
        self._model = settings.openai_model
        self._fallback_model = settings.openai_fallback_model
        self._max_tokens = settings.openai_max_tokens
        self._temperature = settings.openai_temperature

    async def generate_patch(
        self,
        ctx: FailureContext,
        file_content: str,
    ) -> tuple[str, float]:
        """
        Generate a patched version of the failing file.

        Returns:
            (patched_content, confidence_score)
        """
        prompt = _build_user_prompt(ctx, file_content)

        try:
            patched = await self._call_openai(prompt, self._model)
        except Exception as e:
            logger.warning("fix_engine.primary_model_failed", error=str(e), fallback=self._fallback_model)
            patched = await self._call_openai(prompt, self._fallback_model)

        # Clean up any accidental markdown fences
        patched = _strip_fences(patched)

        confidence = _estimate_confidence(file_content, patched)
        logger.info(
            "fix_engine.patch_generated",
            file=ctx.failing_file,
            confidence=confidence,
            original_lines=len(file_content.splitlines()),
            patched_lines=len(patched.splitlines()),
        )

        return patched, confidence

    async def _call_openai(self, prompt: str, model: str) -> str:
        response = await self._client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": prompt},
            ],
            max_tokens=self._max_tokens,
            temperature=self._temperature,
        )
        return response.choices[0].message.content or ""


def _strip_fences(text: str) -> str:
    """Remove accidental markdown code fences from AI output."""
    lines = text.strip().splitlines()
    if lines and lines[0].startswith("```"):
        lines = lines[1:]
    if lines and lines[-1].startswith("```"):
        lines = lines[:-1]
    return "\n".join(lines)


def _estimate_confidence(original: str, patched: str) -> float:
    """
    Heuristic confidence score based on patch size relative to file size.
    Smaller patches get higher confidence (more targeted fix).
    """
    if original == patched:
        return 0.0  # Nothing changed — no confidence

    orig_lines = original.splitlines()
    patch_lines = patched.splitlines()
    diff = list(difflib.unified_diff(orig_lines, patch_lines))
    changed_lines = sum(1 for l in diff if l.startswith(("+", "-")) and not l.startswith(("+++", "---")))

    if len(orig_lines) == 0:
        return 0.5
    change_ratio = changed_lines / max(len(orig_lines), 1)

    if change_ratio < 0.05:
        return 0.97
    elif change_ratio < 0.15:
        return 0.85
    elif change_ratio < 0.30:
        return 0.70
    else:
        return 0.40


def make_unified_diff(original: str, patched: str, filename: str) -> str:
    """Generate a unified diff string between original and patched content."""
    return "\n".join(
        difflib.unified_diff(
            original.splitlines(keepends=True),
            patched.splitlines(keepends=True),
            fromfile=f"a/{filename}",
            tofile=f"b/{filename}",
            lineterm="",
        )
    )
