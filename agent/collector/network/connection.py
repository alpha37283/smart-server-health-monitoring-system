
import psutil
import time



prev_established_conns = set()
prev_timestamp = None

# established connections per second 

def established_connection_rate():
    global prev_established_conns, prev_timestamp

    current_time = time.time()
    connections = psutil.net_connections()

    # extract only ESTABLISHED connections
    current_established = set()

    for conn in connections:
        if conn.status == "ESTABLISHED":
            key = (conn.laddr, conn.raddr, conn.type)
            current_established.add(key)

    # first run
    if prev_timestamp is None:
        prev_established_conns = current_established
        prev_timestamp = current_time
        return None

    # find new established connections
    new_connections = current_established - prev_established_conns

    time_diff = current_time - prev_timestamp

    # update state
    prev_established_conns = current_established
    prev_timestamp = current_time

    if time_diff <= 0:
        return None

    # normalize to per second
    return len(new_connections) / time_diff



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