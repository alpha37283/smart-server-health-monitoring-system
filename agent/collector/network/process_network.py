import psutil
import time
import asyncio


def get_process_bandwidth_estimate(connections_per_process):
    bandwidth_per_process = {}

    for pid, data in connections_per_process.items():
        connections = data.get("connections", [])
        weight = 0
        for conn in connections:
            if conn.get("status") == "ESTABLISHED":
                weight += 3
            else:
                weight += 1

        bandwidth_per_process[pid] = {
            "pid": pid,
            "name": data.get("name", "unknown"),
            "estimated_bandwidth": weight,
        }

    return bandwidth_per_process


def get_top_processes_by_bandwidth(bandwidth_per_process, top_n=5):
    if not bandwidth_per_process:
        return []

    sorted_processes = sorted(
        bandwidth_per_process.values(),
        key=lambda x: x["estimated_bandwidth"],
        reverse=True
    )
    return sorted_processes[:top_n]


def get_connections_data():
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

    network_process_list = [
        {
            "pid": data["pid"],
            "name": data["name"]
        }
        for data in connections_per_process.values()
    ]
    return connections_per_process, network_process_list

async def collect_process_network_usage(event_bus):
    """
    Collect process-level network usage metrics.
    """
    connections_per_process, network_process_list = await asyncio.to_thread(get_connections_data)
    top_connections = sorted(
        connections_per_process.values(),
        key=lambda p: len(p.get("connections", [])),
        reverse=True
    )[:5]

    bandwidth_data = get_process_bandwidth_estimate(connections_per_process)
    top_bandwidth = get_top_processes_by_bandwidth(bandwidth_data)

    event = {
        "timestamp": time.time(),
        "type": "network_process_metrics",
        "data": {
            "connections_per_process": connections_per_process,
            "network_process_list": network_process_list,
            "top_processes_by_connections": top_connections,
            "top_processes_by_bandwidth": top_bandwidth
        }
    }

    print("Process Network Data collected : ", event)

    await event_bus.publish(event)