# core/event_bus.py

import asyncio


class EventBus:
    """
    Simple asynchronous event bus using asyncio.Queue.

    Producers call publish().
    Consumers call subscribe() to receive events.
    """

    def __init__(self):
        # Single queue for now (can be extended later)
        self._queue = asyncio.Queue()

    async def publish(self, event):
        """
        Put an event into the queue.
        This is called by producers (collectors, AI alerts, etc.)
        """
        await self._queue.put(event)

    async def subscribe(self):
        """
        Wait and receive the next event.
        This is called by consumers (AI, streaming, backend).
        """
        event = await self._queue.get()
        return event


'''
this is a simple single-queue model.
Later you can extend to multi-subscriber pattern
'''