"""event_subscriber.py

Subscribes to the core EventBus.

Receives metric events from all collectors (CPU, RAM, Disk, Process, etc.).

Forwards those events to websocket_server for broadcasting to clients.

Can also filter or transform the events if needed (e.g., converting units)."""

# EventBus → subscribe() → receive events → send to ConnectionManager.broadcast()


from streaming.connection_manager import ConnectionManager


class EventSubscriber:
    """
    Subscribes to the EventBus and forwards events to WebSocket clients.

    Responsibilities:
    - Listen for events published to the EventBus
    - Filter events by category
    - Broadcast events to connected WebSocket clients

    This component sits between the EventBus and the WebSocket layer.
    """

    def __init__(self, event_bus, connection_manager: ConnectionManager):
        self.event_bus = event_bus
        self.connection_manager = connection_manager

    async def start(self):
        """
        Register this subscriber with the EventBus.
        """
        await self.event_bus.subscribe(self.handle_event)
        print("[EventSubscriber] Subscribed to EventBus")

    async def handle_event(self, event: dict):
        """
        Called whenever a new event is published to the EventBus.
        """

        event_type = event.get("type")

        # For now we only forward SYSTEM metrics
        system_events = {
            "cpu_metrics",
            "memory_metrics",
            "disk_metrics",
            "process_metrics"
        }

        if event_type in system_events:
            await self.connection_manager.broadcast(event)