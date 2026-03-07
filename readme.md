

"""import json
from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from core.event_bus import event_bus   # your central event bus

router = APIRouter()


class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            await connection.send_text(json.dumps(message))


manager = ConnectionManager()


# metrics that this websocket service will forward
SYSTEM_EVENTS = {
    "cpu_metrics",
    "memory_metrics",
    "disk_metrics",
    "process_metrics"
}


async def handle_event(event_type: str, data: dict):
    """
#    Called whenever event bus publishes a system metric.
    """
    if event_type in SYSTEM_EVENTS:
        payload = {
            "event": event_type,
            "data": data
        }

        await manager.broadcast(payload)


def start_websocket_subscriber():
    """
   # Register websocket handler with event bus.
    """
    event_bus.subscribe(handle_event)


@router.websocket("/ws/metrics")
async def websocket_endpoint(websocket: WebSocket):
    """
   # Client connection endpoint
    """
    await manager.connect(websocket)

    try:
        while True:
            # keep connection alive
            await websocket.receive_text()

    except WebSocketDisconnect:
        manager.disconnect(websocket)"""