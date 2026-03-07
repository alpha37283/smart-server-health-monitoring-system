from fastapi import WebSocket
from typing import List
import asyncio


class ConnectionManager:
    """
    Manages active WebSocket connections.

    This class is responsible for:
    - Tracking connected WebSocket clients
    - Adding/removing connections
    - Broadcasting events to all connected clients

    It does not know anything about collectors or metrics.
    It simply sends messages to connected clients.
    """

    def __init__(self):
        # List of active WebSocket connections
        self.active_connections: List[WebSocket] = []

        # Lock to protect concurrent access
        self._lock = asyncio.Lock()

    async def connect(self, websocket: WebSocket):
        """
        Accept a new WebSocket connection and add it to the active list.
        """
        await websocket.accept()

        async with self._lock:
            self.active_connections.append(websocket)

        print(f"[WebSocket] Client connected. Total clients: {len(self.active_connections)}")

    async def disconnect(self, websocket: WebSocket):
        """
        Remove a WebSocket connection when the client disconnects.
        """
        async with self._lock:
            if websocket in self.active_connections:
                self.active_connections.remove(websocket)

        print(f"[WebSocket] Client disconnected. Total clients: {len(self.active_connections)}")

    async def broadcast(self, message: dict):
        """
        Send a message to all connected clients.
        """
        async with self._lock:
            connections = list(self.active_connections)

        for connection in connections:
            try:
                await connection.send_json(message)
            except Exception:
                # If sending fails, remove the connection
                await self.disconnect(connection)