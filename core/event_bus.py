# core/event_bus.py
import asyncio
from typing import Callable, List

class EventBus:
    """
    Asynchronous EventBus with multi-subscriber support.
    """

    def __init__(self):
        self._subscribers: List[Callable[[dict], asyncio.Future]] = []

    def subscribe(self, callback: Callable[[dict], asyncio.Future]):
        """
        Register a subscriber callback function.
        The callback must be async and accept a single event dict.
        """
        self._subscribers.append(callback)

    async def publish(self, event: dict):
        """
        Publish an event to all subscribers concurrently.
        """
        if not self._subscribers:
            return

        # Run all subscriber callbacks concurrently
        await asyncio.gather(*(subscriber(event) for subscriber in self._subscribers))