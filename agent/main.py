

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


async def main():
    # Create shared event bus
    event_bus = EventBus()

    # Create scheduler (3-second interval)
    scheduler = Scheduler(interval=3)

    # Start CPU collector as background task
    cpu_task = asyncio.create_task(
        scheduler.run(collect_cpu, event_bus)
    )

    # Start Memory collector as background task
    memory_task = asyncio.create_task(
        scheduler.run(collect_memory, event_bus)
    )

    print("Monitoring started... Press Ctrl+C to stop.")

    # Keep program running forever
    await asyncio.gather(cpu_task, memory_task)


if __name__ == "__main__":
    asyncio.run(main())



""" later
Start anomaly engine
Start websocket server
Start backend forwarder
"""