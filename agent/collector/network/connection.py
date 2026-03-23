
import psutil
import time
import os # for log file access

prev_established_conns = set()
prev_timestamp = None

# store previous counter
prev_attempt_fails = None

# Keep track of file position between calls
log_positions = {}

# store previous counters
_prev_tcp_stats = None
_prev_timestamp = None


def failed_connections_snmp(per_minute=False):
    """
    Return TCP connection metrics from /proc/net/snmp.
    
    Returns:
        dict with keys:
            - total_attempts: ActiveOpens (delta since last call or None)
            - failed_attempts: AttemptFails (delta since last call or None)
        If per_minute=True, rates are normalized to per minute.
    """
    global _prev_tcp_stats, _prev_timestamp

    try:
        with open("/proc/net/snmp", "r") as f:
            lines = f.readlines()
    except FileNotFoundError:
        return None

    # locate TCP section
    for i, line in enumerate(lines):
        if line.startswith("Tcp:"):
            header_line = line
            value_line = lines[i + 1]
            break
    else:
        return None

    headers = header_line.strip().split()[1:]  # skip "Tcp:"
    values = list(map(int, value_line.strip().split()[1:]))  # skip "Tcp:"

    current_stats = dict(zip(headers, values))
    current_time = time.time()

    # first run
    if _prev_tcp_stats is None:
        _prev_tcp_stats = current_stats
        _prev_timestamp = current_time
        return {"total_attempts": None, "failed_attempts": None}

    # compute deltas
    delta_time = current_time - _prev_timestamp
    total_attempts = current_stats.get("ActiveOpens", 0) - _prev_tcp_stats.get("ActiveOpens", 0)
    failed_attempts = current_stats.get("AttemptFails", 0) - _prev_tcp_stats.get("AttemptFails", 0)

    _prev_tcp_stats = current_stats
    _prev_timestamp = current_time

    if total_attempts < 0:
        total_attempts = None  # counter reset
    if failed_attempts < 0:
        failed_attempts = None

    # normalize to per minute if requested
    if per_minute and delta_time > 0:
        factor = 60 / delta_time
        if total_attempts is not None:
            total_attempts = total_attempts * factor
        if failed_attempts is not None:
            failed_attempts = failed_attempts * factor

    return {"total_attempts": total_attempts, "failed_attempts": failed_attempts}


def failed_connections_logs(log_file="/var/log/syslog", keywords=None):
    """
    Count failed connection attempts from log file.
    """
    global log_positions

    if keywords is None:
        keywords = ["connection refused", "failed to connect", "timeout", "reset by peer"]

    # Track last read position
    last_pos = log_positions.get(log_file, 0)

    if not os.path.exists(log_file):
        return None

    count = 0

    with open(log_file, "r") as f:
        f.seek(last_pos)
        for line in f:
            if any(keyword.lower() in line.lower() for keyword in keywords):
                count += 1

        # update last position
        log_positions[log_file] = f.tell()

    return count



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
            "connection_rate": established_connection_rate(),
            "failed_connections_total": failed_connections_logs(),  #  there are two methods for this, failed connectionfrom logs
            "failed_connections_second" : failed_connections_snmp(per_minute=True)
        }
    }

    print("Network Connection Data collected : ", event)

    await event_bus.publish(event)