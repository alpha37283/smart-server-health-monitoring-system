# Smart Server Health Monitoring

A server monitoring system that collects metrics locally, streams them over WebSockets, and will support AI-driven insights and a mobile app to monitor your servers from anywhere.

---

## What We're Building

The system runs on your server and gathers CPU, memory, disk, and process metrics. These are published to an in-process event bus, which pushes them to any WebSocket client that connects. The dashboard UI (and later a mobile app) subscribes to these streams and displays live graphs.

Right now, the local collectors, event bus, and WebSocket streaming layer are in place. The UI exists but uses mock data; it does not yet connect to the backend. A mobile app and AI capabilities are planned.

---

## Project Structure

- **agent/** — Main entrypoint and metric collectors. Collectors read system stats and publish events.
- **core/** — Event bus (pub/sub) and scheduler (interval-based task runner).
- **streaming/** — WebSocket server, connection manager, and event routing.
- **UI/** — React dashboard (Vite, Recharts). Intended to be the primary WebSocket client.

---

## How It Works

**Collectors** (CPU, memory, disk, process) run on a schedule—by default every 3 seconds. Each collector reads system stats with `psutil`, builds an event payload, and publishes it to the event bus.

The **EventBus** is a simple pub/sub hub. Anything that subscribes gets every published event. The WebSocket layer subscribes with a `handle_event` callback.

When an event arrives, `handle_event` inspects its `type` and routes it to a logical group: `system`, `network`, or `database`. The **ConnectionManager** keeps separate lists of WebSocket clients per group and broadcasts each event only to clients in that group.

So a browser or mobile app that connects to `ws://host:8000/ws/metrics/system` joins the `system` group. Every time a CPU, memory, disk, or process event is published, that client receives it as JSON. Multiple clients can connect; they all receive the same stream. Changing the scheduler interval (e.g. to 1 second) makes events arrive more frequently; the backend has no knowledge of who the clients are—it just broadcasts to everyone in the group.

---

## Module Roles

- **agent/main.py** — Entrypoint. Creates the EventBus and Scheduler, wires the WebSocket subscriber via `start_websocket(event_bus)`, and starts four background collector tasks plus the Uvicorn server. All run concurrently in one process.

- **core/event_bus.py** — Central pub/sub. `subscribe(callback)` registers a handler; `publish(event)` invokes all handlers concurrently.

- **core/scheduler.py** — Runs a given async collector function every `interval` seconds in an infinite loop.

- **agent/collector/system/** — Four collectors (CPU, memory, disk, process). Each calls `psutil`, builds an event dict, and calls `event_bus.publish(event)`.

- **streaming/websocket_server.py** — FastAPI app. Exposes WebSocket endpoints at `/ws/metrics/system`, `/ws/metrics/network`, `/ws/metrics/database`. Subscribes `handle_event` to the bus; that callback routes events by type and calls `manager.broadcast(category, event)`.

- **streaming/connection_manager.py** — Maintains WebSocket connections grouped by category. `connect()` adds a client to a group; `disconnect()` removes it; `broadcast()` sends a message to all clients in a group.

Event types currently routed to `system`: `cpu_metrics`, `memory_metrics`, `disk_metrics`, `process_metrics`. `network` and `database` groups exist but have no collectors yet.

---

## End-to-End Flow (Client Connects to `/ws/metrics/system`)

On startup, `main()` creates the EventBus and calls `start_websocket(event_bus)`. That registers `handle_event` as a subscriber. Then the four collector loops and Uvicorn start.

When a client opens `ws://host:8000/ws/metrics/system`, FastAPI routes to the `system_metrics` handler. It calls `manager.connect(websocket, "system")`, which accepts the connection and adds the socket to the `system` group. The handler then enters a loop waiting for incoming messages (used mainly to keep the connection alive).

Every 3 seconds, each collector runs, builds an event, and calls `event_bus.publish(event)`. The bus invokes `handle_event` with that event. `handle_event` sees `type` in `{"cpu_metrics", "memory_metrics", "disk_metrics", "process_metrics"}` and calls `manager.broadcast("system", event)`. The ConnectionManager sends the event as JSON to every WebSocket in the `system` group. The client receives it and can update its UI.

If the client disconnects, the receive loop raises and the handler calls `manager.disconnect(websocket, "system")` to remove it from the group.

---

## Quick Start

Backend:

```bash
pip install -r requirements.txt
python -m agent.main
```

UI (separate terminal):

```bash
cd UI && pnpm install && pnpm dev
```

The backend listens on port 8000. WebSocket endpoint for system metrics: `ws://localhost:8000/ws/metrics/system`. The UI runs on port 5173; it currently shows mock data and does not yet connect to the backend.

---

## Tech Stack

Backend: Python, FastAPI, Uvicorn, psutil.  
UI: React, Vite, Tailwind, Recharts.  
Communication: in-process EventBus for collectors; WebSocket for clients.

---

## Next Steps

Connect the UI to the WebSocket endpoint so charts update live. Add network and database collectors when needed. Integrate AI for anomaly detection and alerts. Build a mobile client that subscribes to the same endpoints.

---

## Requirements

Python 3.10+ for the backend, Node.js and pnpm for the UI. See `requirements.txt` for Python dependencies. The backend runs on Linux; collectors use `psutil` for cross-platform compatibility where possible.
