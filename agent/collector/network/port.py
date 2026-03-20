# we will be collecting data related to ports

import psutil
import time


# previous state
_prev_connections_per_port = {}
_prev_timestamp = None


# Return top N active ports based on connection count.
def get_top_active_ports(connections_per_port, top_n=15):

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




def get_port_connection_rate(connections_per_port):

    global _prev_connections_per_port, _prev_timestamp

    current_time = time.time()

    # first run
    if _prev_timestamp is None:
        _prev_connections_per_port = connections_per_port.copy()
        _prev_timestamp = current_time
        return {}

    # thfi diff 
    time_diff = current_time - _prev_timestamp

    if time_diff <= 0:
        return {}

    rate_per_port = {}

    # union of ports (handle new/disappearing ports)
    all_ports = set(connections_per_port.keys()) | set(_prev_connections_per_port.keys())

    for port in all_ports:
        current = connections_per_port.get(port, 0)
        prev = _prev_connections_per_port.get(port, 0)

        diff = current - prev

        # ignore negative (connections closed)
        if diff < 0:
            continue

        rate_per_port[port] = diff / time_diff

    # update state
    _prev_connections_per_port = connections_per_port.copy()
    _prev_timestamp = current_time

    return rate_per_port


def get_port_metrics():

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

    top_ports = get_top_active_ports(data["connections_per_port"])
    port_rates = get_port_connection_rate(data["connections_per_port"])

    event = {
        "timestamp": time.time(),
        "type": "network_port_metrics",
        "data": {
            **data,
            "top_active_ports": top_ports, # top ports sorted based on number of connections 
            "port_connection_rate": port_rates # number of new connections per port per minute being created
        }
    }

    print("Port Activity Data collected")

    await event_bus.publish(event)