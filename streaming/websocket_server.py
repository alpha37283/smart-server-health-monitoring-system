from fastapi import FastAPI, WebSocket
from .connection_manager import ConnectionManager
from core.event_bus import EventBus

app = FastAPI()
manager = ConnectionManager()

event_bus: EventBus = None  # set from main.py


# Event type groups
SYSTEM_EVENTS = {
    "cpu_metrics",
    "memory_metrics",
    "disk_metrics",
    "process_metrics"
}

NETWORK_EVENTS = {
    # future collectors
    "tcp_metrics",
    "traffic_metrics"
}

DATABASE_EVENTS = {
    # future
    "db_metrics"
}


async def handle_event(event: dict):
    """
    Routes incoming events to the correct WebSocket group.
    """

    event_type = event.get("type")

    if event_type in SYSTEM_EVENTS:
        await manager.broadcast("system", event)

    elif event_type in NETWORK_EVENTS:
        await manager.broadcast("network", event)

    elif event_type in DATABASE_EVENTS:
        await manager.broadcast("database", event)


def start_websocket(event_bus_instance: EventBus):
    """
    Register this service with EventBus
    """

    global event_bus
    event_bus = event_bus_instance

    event_bus.subscribe(handle_event)

    print("[WebSocket] Subscribed to EventBus")



# WebSocket Endpoints

@app.websocket("/ws/metrics/system")
async def system_metrics(websocket: WebSocket):

    await manager.connect(websocket, "system")

    try:
        while True:
            await websocket.receive_text()
    except Exception:
        await manager.disconnect(websocket, "system")


@app.websocket("/ws/metrics/network")
async def network_metrics(websocket: WebSocket):

    await manager.connect(websocket, "network")

    try:
        while True:
            await websocket.receive_text()
    except Exception:
        await manager.disconnect(websocket, "network")


@app.websocket("/ws/metrics/database")
async def database_metrics(websocket: WebSocket):

    await manager.connect(websocket, "database")

    try:
        while True:
            await websocket.receive_text()
    except Exception:
        await manager.disconnect(websocket, "database")