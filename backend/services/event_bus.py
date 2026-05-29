"""
Simple in-memory Event Bus for broadcasting state changes via Server-Sent Events.
"""

import asyncio
import json
from typing import AsyncGenerator
from pydantic import BaseModel


class EventBus:
    def __init__(self):
        self._subscribers: list[asyncio.Queue] = []

    async def subscribe(self) -> AsyncGenerator[str, None]:
        q = asyncio.Queue()
        self._subscribers.append(q)
        try:
            while True:
                event_data = await q.get()
                yield event_data
        finally:
            self._subscribers.remove(q)

    def publish(self, event_name: str, data: dict | BaseModel) -> None:
        if isinstance(data, BaseModel):
            payload = data.model_dump(mode="json")
        else:
            payload = data

        message = f"event: {event_name}\ndata: {json.dumps(payload)}\n\n"
        for q in self._subscribers:
            q.put_nowait(message)


# Global event bus
event_bus = EventBus()
