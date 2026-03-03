

''' now
Initialize event bus
Initialize scheduler
Register collectors'''

# agent/main.py

import asyncio
from core.event_bus import EventBus
from core.scheduler import Scheduler
from agent.collector.system.cpu import collect_cpu


async def main():
    # Create shared event bus
    event_bus = EventBus()

    # Create scheduler (3-second interval)
    scheduler = Scheduler(interval=3)

    # Start CPU collector loop
    await scheduler.run(collect_cpu, event_bus)


if __name__ == "__main__":
    asyncio.run(main())



""" later
Start anomaly engine
Start websocket server
Start backend forwarder
"""