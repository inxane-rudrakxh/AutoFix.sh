from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from services.event_bus import event_bus

router = APIRouter(prefix="/events", tags=["events"])


@router.get("")
async def stream_events() -> StreamingResponse:
    """
    Global Server-Sent Events endpoint for real-time dashboard updates.
    """
    return StreamingResponse(
        event_bus.subscribe(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        },
    )
