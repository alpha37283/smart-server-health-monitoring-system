# we will be collecting data related to ports

import psutil
import time


def get_top_active_ports(connections_per_port, top_n=15):
    """
    Return top N active ports based on connection count.
    """

    if not connections_per_port:
        return []

    sorted_ports = sorted(
        connections_per_port.items(),
        key=lambda x: x[1],
        reverse=True
    )

    top_ports = sorted_ports[:top_n]

    return [
        {"port": port, "connections": count}
        for port, count in top_ports
    ]

def get_port_metrics():
    """
    Returns:
    - open_ports_count
    - open_ports (list)
    - connections_per_port (dict)
    """

    connections = psutil.net_connections()

    open_ports_set = set()
    connections_per_port = {}

    for conn in connections:

        # skip if no local address
        if not conn.laddr:
            continue

        port = conn.laddr.port

        if conn.status == "LISTEN": # open ports, established and non-established connections
            open_ports_set.add(port)

        if conn.status == "ESTABLISHED": # established connections
            connections_per_port[port] = connections_per_port.get(port, 0) + 1

    return {
        "open_ports_count": len(open_ports_set), # total
        "open_ports": sorted(list(open_ports_set)), # list of ports like 80, 443, etc.
        "connections_per_port": connections_per_port 
    }


async def collect_port_activity(event_bus):
    """
    Collect port activity metrics.
    """

    data = get_port_metrics()

    event = {
        "timestamp": time.time(),
        "type": "network_port_metrics",
        "data": {
            **data,
            "top_active_ports": None, # top ports sorted based on number of connections 
            "port_connection_rate": None # number of new connections per port per minute being created
        }
    }

    print("Port Activity Data collected")

    await event_bus.publish(event)