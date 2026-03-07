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
    start_websocket(event_bus)  # attach WebSocket subscriber

    scheduler = Scheduler(interval=5)  # 1s for testing

    # Start collectors
    cpu_task = asyncio.create_task(scheduler.run(collect_cpu, event_bus))
    memory_task = asyncio.create_task(scheduler.run(collect_memory, event_bus))
    disk_task = asyncio.create_task(scheduler.run(collect_disk, event_bus))
    process_task = asyncio.create_task(scheduler.run(collect_process, event_bus))

    # Start WebSocket server
    config = uvicorn.Config(app, host="0.0.0.0", port=8000, log_level="info")
    server = uvicorn.Server(config)
    ws_task = asyncio.create_task(server.serve())

    print("Monitoring + WebSocket server started...")

    # Keep everything running
    await asyncio.gather(cpu_task, memory_task, disk_task, process_task, ws_task)

if __name__ == "__main__":
    asyncio.run(main())