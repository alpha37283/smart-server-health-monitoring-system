# we will be collecting data related to ports

import psutil
import time


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

            # Derived (later)
            "top_active_ports": None,
            "port_connection_rate": None
        }
    }

    print("Port Activity Data collected")

    await event_bus.publish(event)