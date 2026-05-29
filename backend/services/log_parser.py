"""
Log parser — extracts structured failure info from raw GitHub Actions logs.
"""

from __future__ import annotations

import re
from models.webhook import FailureContext

# ─── Pattern bank ─────────────────────────────────────────────────────────

_PATTERNS = {
    "TypeError": re.compile(r"TypeError[:\s]"),
    "SyntaxError": re.compile(r"SyntaxError[:\s]"),
    "ImportError": re.compile(r"(ImportError|ModuleNotFoundError|Cannot find module)[:\s]"),
    "TestFail": re.compile(r"(FAIL |✕ |● |FAILED tests/)"),
    "ReferenceError": re.compile(r"ReferenceError[:\s]"),
    "TypeScriptError": re.compile(r"error TS\d{4}"),
    "PythonException": re.compile(r"^[A-Z][a-zA-Z]+Error: "),
}

_FILE_REF = re.compile(
    r"(?:at\s+\S+\s+\()?([\w./\-]+\.[tj]sx?|[\w./\-]+\.py)"
    r"(?::(\d+)(?::\d+)?)?"
)

_JEST_FAIL = re.compile(r"FAIL\s+([\w./\-]+\.[tj]sx?)")
_VITEST_FAIL = re.compile(r"FAIL\s+(tests?/[\w./\-]+)")
_PYTHON_FAIL = re.compile(r"FAILED\s+([\w/]+\.py)::")


def parse_logs(raw_logs: str, ctx: FailureContext) -> FailureContext:
    """
    Analyse raw CI logs and populate the FailureContext with structured data.
    Modifies ctx in place and returns it.
    """
    lines = raw_logs.splitlines()

    # ── Identify failure type ───────────────────────────────────────────────
    for ftype, pattern in _PATTERNS.items():
        for line in lines:
            if pattern.search(line):
                ctx.failure_type = ftype
                ctx.error_message = line.strip()
                break
        if ctx.failure_type != "Unknown":
            break

    # ── Extract failing file ─────────────────────────────────────────────────
    failing_file = ""
    line_number: int | None = None

    for line in lines:
        # Jest/Vitest
        m = _JEST_FAIL.search(line) or _VITEST_FAIL.search(line)
        if m and not failing_file:
            failing_file = m.group(1)

        # Python pytest
        m2 = _PYTHON_FAIL.search(line)
        if m2 and not failing_file:
            failing_file = m2.group(1)

        # Stack frame
        m3 = _FILE_REF.search(line)
        if m3 and not failing_file:
            candidate = m3.group(1)
            # Filter out node_modules and framework internals
            if "node_modules" not in candidate and "dist/" not in candidate:
                failing_file = candidate
                if m3.group(2):
                    try:
                        line_number = int(m3.group(2))
                    except ValueError:
                        pass

    ctx.failing_file = failing_file
    ctx.line_number = line_number

    # ── Extract stack trace ──────────────────────────────────────────────────
    stack: list[str] = []
    in_stack = False
    for line in lines:
        stripped = line.strip()
        if stripped.startswith("at ") or stripped.startswith("File "):
            in_stack = True
        if in_stack:
            if stripped.startswith("at ") or stripped.startswith("File "):
                stack.append(stripped)
            else:
                in_stack = False
        if len(stack) >= 10:
            break
    ctx.stack_trace = stack

    # ── Extract log window (±20 lines around error) ──────────────────────────
    error_idx = 0
    for i, line in enumerate(lines):
        if ctx.error_message and ctx.error_message in line:
            error_idx = i
            break
    start = max(0, error_idx - 20)
    end = min(len(lines), error_idx + 20)
    ctx.log_window = "\n".join(lines[start:end])

    return ctx
