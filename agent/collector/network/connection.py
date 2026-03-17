
import psutil
import time


async def collect_network_connections(event_bus):
    """
    Collect network connection-related metrics using psutil.
    """

    connections = psutil.net_connections()

    total_connections = len(connections)

    tcp_connections = 0
    udp_connections = 0
    established_connections = 0
    listening_sockets = 0
    time_wait_connections = 0

    for conn in connections:
        # Type
        if conn.type == psutil.SOCK_STREAM:
            tcp_connections += 1
        elif conn.type == psutil.SOCK_DGRAM:
            udp_connections += 1

        # Status (only applies to TCP)
        if conn.status == "ESTABLISHED":
            established_connections += 1
        elif conn.status == "LISTEN":
            listening_sockets += 1
        elif conn.status == "TIME_WAIT":
            time_wait_connections += 1

    event = {
        "timestamp": time.time(),
        "type": "network_connection_metrics",
        "data": {
            "total_connections": total_connections,
            "tcp_connections": tcp_connections,
            "udp_connections": udp_connections,
            "established_connections": established_connections,
            "listening_sockets": listening_sockets,
            "time_wait_connections": time_wait_connections,

            # Derived / later
            "connection_rate": None,
            "failed_connections": None,
        }
    }

    print("Network Connection Data collected")

    await event_bus.publish(event)