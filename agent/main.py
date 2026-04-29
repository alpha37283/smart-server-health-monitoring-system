# agent/main.py
import asyncio
import uvicorn

from core.event_bus import EventBus
from core.scheduler import Scheduler

from agent.collector.system.cpu import collect_cpu
from agent.collector.system.memory import collect_memory
from agent.collector.system.disk import collect_disk
from agent.collector.system.process import collect_process

from agent.collector.network.connection import collect_network_connections
from agent.collector.network.errors_drop import collect_network_errors
from agent.collector.network.interface import collect_network_interfaces
from agent.collector.network.network_latency_metric import collect_latency_metrics
from agent.collector.network.port import collect_process_network_usage
from agent.collector.network.traffic import collect_network_traffic

from streaming.websocket_server import app, start_websocket


async def main():
    event_bus = EventBus()
    scheduler = Scheduler(interval=0.8)

    # Start WebSocket subscriber
    start_websocket(event_bus)  # attaches handle_event callback


      # Run Uvicorn server in another task
    config = uvicorn.Config(app, host="0.0.0.0", port=8000, log_level="info")
    server = uvicorn.Server(config)
    server_task = asyncio.create_task(server.serve())

    # Start collectors as background tasks
    system_tasks = [
        asyncio.create_task(scheduler.run(collect_cpu, event_bus)),
        asyncio.create_task(scheduler.run(collect_memory, event_bus)),
        asyncio.create_task(scheduler.run(collect_disk, event_bus)),
        asyncio.create_task(scheduler.run(collect_process, event_bus))
    ]

    network_tasks = [
        asyncio.create_task(scheduler.run(collect_network_connections, event_bus)),
        asyncio.create_task(scheduler.run(collect_network_errors, event_bus)),
        asyncio.create_task(scheduler.run(collect_network_interfaces, event_bus)),
        asyncio.create_task(scheduler.run(collect_latency_metrics, event_bus)),
        asyncio.create_task(scheduler.run(collect_process_network_usage, event_bus)),
        asyncio.create_task(scheduler.run(collect_network_traffic, event_bus))
    ]

    print("Monitoring + WebSocket server started... Press Ctrl+C to stop.")

    await asyncio.gather(*system_tasks, *network_tasks, server_task)


if __name__ == "__main__":
    asyncio.run(main())