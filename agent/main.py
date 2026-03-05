

''' now
Initialize event bus
Initialize scheduler
Register collectors'''

# agent/main.py

import asyncio
from core.event_bus import EventBus
from core.scheduler import Scheduler
from agent.collector.system.cpu import collect_cpu
from agent.collector.system.memory import collect_memory
from agent.collector.system.disk import collect_disk


async def main():
    # shared event bus, works as message broker,
    event_bus = EventBus()

    scheduler = Scheduler(interval=3)

    # CPU collector as background task, these are publishers here
    cpu_task = asyncio.create_task(scheduler.run(collect_cpu, event_bus))

    # Memory collector as background task
    memory_task = asyncio.create_task(scheduler.run(collect_memory, event_bus))

    disk_task = asyncio.create_task(scheduler.run(collect_disk, event_bus))

    print("Monitoring started... Press Ctrl+C to stop.")

    # Keep program running forever
    await asyncio.gather(cpu_task, memory_task, disk_task)


if __name__ == "__main__":
    asyncio.run(main())



""" later
Start anomaly engine
Start websocket server
Start backend forwarder
"""