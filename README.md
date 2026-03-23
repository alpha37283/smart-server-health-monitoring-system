# Smart Server Health Monitoring

A server monitoring system that collects metrics locally, streams them over WebSockets, and supports live visualization via a centralized dashboard. The system is designed to provide real-time visibility into server health, with planned support for AI-driven insights and a mobile app.

---

## What We're Building

The system runs locally on your server, gathering comprehensive metrics—such as CPU, memory, disk, and process details—at fixed intervals. The collected metrics are formatted as standardized JSON events and published to an in-process Event Bus. The Streaming layer subscribes to this event bus, routing the events to categorized WebSocket groups (e.g., system, network, database) so that connected clients (like our React dashboard) can receive them in real time.

Right now, the system backend (collectors, event bus, and WebSocket layer) is fully operational for system metrics. Network metrics exist but require integration. The UI is in a separate directory and is actively being updated to fetch real data from these WebSocket endpoints.

---

## Architecture & Project Structure

- **agent/** — The entrypoint and metric collectors. Collectors read system stats (via `psutil` or other mechanisms), package them into a structured event payload, and publish to the Event Bus.
  - **agent/collector/system/**: Active collectors for CPU, memory, disk, and process metrics.
  - **agent/collector/network/**: Implemented but pending integration network collectors (connections, latency, interfaces, traffic).
- **core/** 
  - **event_bus.py**: Central pub/sub hub using asynchronous functions to dispatch events concurrently to subscribers.
  - **scheduler.py**: Runs given async collector functions at configured intervals (e.g., every 0.8 seconds).
- **streaming/** 
  - **websocket_server.py**: FastAPI application exposing WebSocket endpoints. It subscribes to the Event Bus and routes events based on their types (`SYSTEM_EVENTS`, `NETWORK_EVENTS`, `DATABASE_EVENTS`).
  - **connection_manager.py**: Maintains active WebSocket connections grouped by categories, handling connections, disconnections, and group broadcasts.
- **UI/** — A React dashboard using Vite and Recharts, meant to connect to the backend and plot data in real time.

---

## How It Works

### Metrics Collection Payload
Collectors run dynamically using the `Scheduler`. For instance, the **CPU Collector** reads statistics using `psutil` and formats an event payload like this:
```json
{
  "timestamp": 1710950400.0,
  "type": "cpu_metrics",
  "data": {
    "cpu_usage": 15.4,
    "per_core_usage": [12.0, 18.0, 10.0, 21.0],
    "load_avg": {"1m": 1.2, "5m": 1.1, "15m": 0.9},
    "io_wait": 0.1,
    "user_time": 450.2,
    "system_time": 120.4,
    "context_switches": 150032,
    "frequency_mhz": 2400.0,
    "system_uptime_seconds": 36000.5
  }
}
```

### Pub/Sub Event Bus
The **EventBus** is an asynchronous in-memory event dispatcher. Any component can subscribe using a callback. The `start_websocket` function from the streaming layer registers its `handle_event` route function as a subscriber. When collectors generate metric payloads, they call `event_bus.publish(event)`, which forwards it concurrently to all active subscribers.

### Routing & Broadcasting
When an event arrives at the streaming layer, `handle_event` inspects the event `type` and matches it against event groups:
- **System**: `cpu_metrics`, `memory_metrics`, `disk_metrics`, `process_metrics`
- **Network**: `tcp_metrics`, `traffic_metrics`
- **Database**: `db_metrics`

It then utilizes the `ConnectionManager` to broadcast the payload. The manager relays the message exclusively to WebSocket clients connected to the corresponding endpoint (e.g., `/ws/metrics/system`, `/ws/metrics/network`, `/ws/metrics/database`).

---

## End-to-End Delivery Flow

1. **Initialization**: `agent/main.py` initializes the `EventBus` and `Scheduler`. It wires the WebSocket handler and starts Uvicorn combined with background collector tasks.
2. **Client Connection**: A client connects to `ws://localhost:8000/ws/metrics/system`. FastAPI handles the WebSocket, and `ConnectionManager` registers it in the `"system"` group.
3. **Data Collection**: Every tick (e.g. 0.8s), a collector gathers system information and publishes it.
4. **Dispatch**: The `EventBus` immediately invokes `handle_event()`.
5. **Broadcast**: `handle_event` filters the event to `"system"` and triggers `manager.broadcast()`, pushing the JSON event down the WebSocket connection to the client.

---

## Getting Started

### Backend Execution

```bash
pip install -r requirements.txt
python -m agent.main
```
This spawns the backend on port `8000`, simultaneously running the API server and data collectors. 
WebSocket endpoint for system metrics: `ws://localhost:8000/ws/metrics/system`.

### UI Dashboard (Separate Terminal)

```bash
cd UI
pnpm install
pnpm dev
```
The dashboard runs on port `5173`. We are currently integrating it to display the backend's real WebSocket payloads instead of mock data.

---

## Tech Stack

- **Backend Logic**: Python 3.10+, `psutil`
- **Streaming & Server**: FastAPI, Uvicorn, WebSockets
- **Frontend Dashboard**: React, Vite, TailwindCSS, Recharts
- **Communication Flow**: Asyncio loops, In-process Pub/Sub

---

## Status & Next Steps

1. **Frontend Integration**: Transition UI components to ingest data from WebSockets (current focus).
2. **Networking Telemetry Integration**: Wire the existing network collectors (`agent/collector/network/*`) into `agent/main.py` and expand `NETWORK_EVENTS` handlers.
3. **AI Capabilities**: Build anomaly detection and alert models reading from the event stream.
4. **Database Logging/Remote Monitoring**: Push long-term data points to a persistent database or expose endpoints for mobile applications.
