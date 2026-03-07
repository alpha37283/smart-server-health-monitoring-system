from fastapi import FastAPI, WebSocket
import json
from .connection_manager import ConnectionManager
from core.event_bus import EventBus

app = FastAPI()
manager = ConnectionManager()
event_bus: EventBus = None  # will be set from main.py

SYSTEM_EVENTS = {"cpu_metrics", "memory_metrics", "disk_metrics", "process_metrics"}

async def handle_event(event: dict):
    if event.get("type") in SYSTEM_EVENTS:
        await manager.broadcast(event)

def start_websocket(event_bus_instance: EventBus):
    """
    Register event subscriber with EventBus
    """
    global event_bus
    event_bus = event_bus_instance
    event_bus.subscribe(handle_event)
    print("[WebSocket] Subscribed to EventBus")

@app.websocket("/ws/metrics")
async def websocket_endpoint(websocket: WebSocket):
    """
    Handle incoming WebSocket connections
    """
    await manager.connect(websocket)
    try:
        while True:
            # keep connection alive; optional ping
            await websocket.receive_text()
    except Exception:
        manager.disconnect(websocket)
