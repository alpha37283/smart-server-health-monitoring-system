# we will be collecting data related to ports

import psutil
import time



def get_process_bandwidth_estimate(connections_per_process):

    bandwidth_per_process = {}

    for pid, data in connections_per_process.items():

        connections = data["connections"]

        weight = 0

        for conn in connections:
            if conn["status"] == "ESTABLISHED":
                weight += 3
            else:
                weight += 1

        bandwidth_per_process[pid] = {
            "pid": pid,
            "name": data["name"],
            "estimated_bandwidth": weight
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

    top = sorted_processes[:top_n]

    return top




async def collect_process_network_usage(event_bus):

    data = get_process_metrics()

    top_connections = get_top_processes_by_connections(
        data["connections_per_process"]
    )

    process_rates = get_process_connection_rate(
        data["connections_per_process"]
    )

    bandwidth_data = get_process_bandwidth_estimate(
        data["connections_per_process"]
    )

    top_bandwidth = get_top_processes_by_bandwidth(
        bandwidth_data
    )

    event = {
        "timestamp": time.time(),
        "type": "network_process_metrics",
        "data": {
            **data,
            "top_processes_by_connections": top_connections,
            "process_connection_rate": process_rates,
            "top_processes_by_bandwidth": top_bandwidth
        }
    }

    print("Process Network Data collected")

    await event_bus.publish(event)