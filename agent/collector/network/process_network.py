import psutil
import time


async def collect_process_network_usage(event_bus):
    """
    Collect process-level network usage metrics.
    """

    connections = psutil.net_connections()

    connections_per_process = {}

    for conn in connections:

        pid = conn.pid

        if pid is None:
            continue

        try:
            proc = psutil.Process(pid)
            name = proc.name()
        except (psutil.NoSuchProcess, psutil.AccessDenied):
            continue

        if pid not in connections_per_process:
            connections_per_process[pid] = {
                "pid": pid,
                "name": name,
                "connections": []
            }

        if not conn.laddr:
            continue

        connections_per_process[pid]["connections"].append({
            "port": conn.laddr.port,
            "status": conn.status
        })

    # derive lightweight list
    network_process_list = [
        {
            "pid": data["pid"],
            "name": data["name"]
        }
        for data in connections_per_process.values()
    ]

    event = {
        "timestamp": time.time(),
        "type": "network_process_metrics",
        "data": {
            "connections_per_process": connections_per_process,
            "network_process_list": network_process_list,

            # Derived (later)
            "top_processes_by_connections": None,
            "top_processes_by_bandwidth": None
        }
    }

    print("Process Network Data collected")

    await event_bus.publish(event)