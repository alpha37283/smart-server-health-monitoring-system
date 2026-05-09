# agent/main.py

import asyncio
import uvicorn

from core.event_bus import EventBus
from core.scheduler import Scheduler

# System collectors
from agent.collector.system.cpu import collect_cpu
from agent.collector.system.memory import collect_memory
from agent.collector.system.disk import collect_disk
from agent.collector.system.process import collect_process

# Network collectors
from agent.collector.network.connection import collect_network_connections
from agent.collector.network.errors_drop import collect_network_errors
from agent.collector.network.interface import collect_network_interfaces
from agent.collector.network.network_latency_metric import collect_latency_metrics
from agent.collector.network.process_network import collect_process_network_usage
from agent.collector.network.traffic import collect_network_traffic

# Security collectors
from agent.collector.security.authentication import collect_authentication
from agent.collector.security.sudo_privilege import collect_sudo_privilege
from agent.collector.security.listening_surface import collect_listening_surface
from agent.collector.security.session_users import collect_session_users
from agent.collector.security.kernel_security import collect_kernel_security

from streaming.websocket_server import app, start_websocket


async def main():
    event_bus = EventBus()

    # Fast realtime metrics
    scheduler = Scheduler(interval=0.8)
    # Lower-frequency security metrics
    security_scheduler = Scheduler(interval=8)

    # Start WebSocket subscriber
    start_websocket(event_bus)


    config = uvicorn.Config( app, host="0.0.0.0", port=8000, log_level="info")

    server = uvicorn.Server(config)
    server_task = asyncio.create_task(server.serve())

    # System collectors
    system_tasks = [
        asyncio.create_task(scheduler.run(collect_cpu, event_bus)),
        asyncio.create_task(scheduler.run(collect_memory, event_bus)),
        asyncio.create_task(scheduler.run(collect_disk, event_bus)),
        asyncio.create_task(scheduler.run(collect_process, event_bus)),
    ]

    # Network collectors
    network_tasks = [
        asyncio.create_task(scheduler.run(collect_network_connections, event_bus)),
        asyncio.create_task(scheduler.run(collect_network_errors, event_bus)),
        asyncio.create_task(scheduler.run(collect_network_interfaces, event_bus)),
        asyncio.create_task(scheduler.run(collect_latency_metrics, event_bus)),
        asyncio.create_task(scheduler.run(collect_process_network_usage, event_bus)),
        asyncio.create_task(scheduler.run(collect_network_traffic, event_bus)),
    ]

    # Security collectors
    security_tasks = [
        asyncio.create_task( security_scheduler.run(collect_authentication, event_bus) ),
        asyncio.create_task( security_scheduler.run(collect_sudo_privilege, event_bus) ),
        asyncio.create_task( security_scheduler.run(collect_listening_surface, event_bus) ),
        asyncio.create_task( security_scheduler.run(collect_session_users, event_bus) ),
        asyncio.create_task( security_scheduler.run(collect_kernel_security, event_bus) ),
    ]

    print("Monitoring + WebSocket server started... Press Ctrl+C to stop.")

    await asyncio.gather( *system_tasks, *network_tasks, *security_tasks, server_task)


if __name__ == "__main__":
    asyncio.run(main())