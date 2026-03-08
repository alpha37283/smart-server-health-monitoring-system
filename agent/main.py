# agent/main.py
import asyncio
import uvicorn
from core.event_bus import EventBus
from core.scheduler import Scheduler
from agent.collector.system.cpu import collect_cpu
from agent.collector.system.memory import collect_memory
from agent.collector.system.disk import collect_disk
from agent.collector.system.process import collect_process
from streaming.websocket_server import app, start_websocket


async def main():
    event_bus = EventBus()
    scheduler = Scheduler(interval=3)

    # Start WebSocket subscriber
    start_websocket(event_bus)  # attaches handle_event callback

    # Start collectors as background tasks
    tasks = [
        asyncio.create_task(scheduler.run(collect_cpu, event_bus)),
        asyncio.create_task(scheduler.run(collect_memory, event_bus)),
        asyncio.create_task(scheduler.run(collect_disk, event_bus)),
        asyncio.create_task(scheduler.run(collect_process, event_bus))
    ]

    # Run Uvicorn server in another task
    config = uvicorn.Config(app, host="0.0.0.0", port=8000, log_level="info")
    server = uvicorn.Server(config)
    server_task = asyncio.create_task(server.serve())

    print("Monitoring + WebSocket server started... Press Ctrl+C to stop.")

    await asyncio.gather(*tasks, server_task)


if __name__ == "__main__":
    asyncio.run(main())