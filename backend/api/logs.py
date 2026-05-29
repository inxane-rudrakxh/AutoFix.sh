"""
Logs API — fetch logs and stream via Server-Sent Events.
"""

import asyncio
import json
from datetime import datetime, timezone

from fastapi import APIRouter, Query
from fastapi.responses import StreamingResponse
from models import LogLine
from services.state import log_service as _service

router = APIRouter(prefix="/logs", tags=["logs"])


@router.get("", response_model=list[LogLine])
async def get_logs(run_id: str | None = Query(None)) -> list[LogLine]:
    return await _service.get_logs(run_id=run_id)


@router.get("/{run_id}/stream")
async def stream_logs(run_id: str) -> StreamingResponse:
    """
    Server-Sent Events endpoint for live log streaming.
    Frontend connects via: new EventSource('/api/logs/{runId}/stream')
    """

    async def event_generator():
        cursor = 0
        while True:
            lines = await _service.get_logs(run_id=run_id)
            new_lines = lines[cursor:]
            for line in new_lines:
                data = json.dumps(line.model_dump())
                yield f"data: {data}\n\n"
                cursor += 1

            if cursor >= len(lines):
                # Send heartbeat
                yield f"event: heartbeat\ndata: {{}}\n\n"

            await asyncio.sleep(1)

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        },
    )
