from fastapi import WebSocket
from typing import Dict, List
import asyncio


class ConnectionManager:
    """
    Manages active WebSocket connections grouped by category.

    Categories examples:
    - system
    - network
    - database
    - security
    """

    def __init__(self):

        # Each category has its own client list
        self.connections: Dict[str, List[WebSocket]] = {
            "system": [],
            "network": [],
            "database": [],
            "security": []
        }

        # Prevent concurrent modification
        self._lock = asyncio.Lock()

    async def connect(self, websocket: WebSocket, category: str):
        """
        Accept connection and assign it to a category group.
        """

        await websocket.accept()

        async with self._lock:
            if category not in self.connections:
                self.connections[category] = []

            self.connections[category].append(websocket)

        print(f"[WebSocket] Client connected to {category}. "
              f"Total: {len(self.connections[category])}")

    async def disconnect(self, websocket: WebSocket, category: str):
        """
        Remove client from its category group.
        """

        async with self._lock:
            if category in self.connections and websocket in self.connections[category]:
                self.connections[category].remove(websocket)

        print(f"[WebSocket] Client disconnected from {category}. "
              f"Total: {len(self.connections[category])}")

    async def broadcast(self, category: str, message: dict):
        """
        Broadcast message only to clients subscribed to a category.
        """

        async with self._lock:
            connections = list(self.connections.get(category, []))

        for connection in connections:
            try:
                await connection.send_json(message)
            except Exception:
                await self.disconnect(connection, category)