
import psutil
import time



# calculat eprevious state for rate calculations
prev_bytes_sent = None
prev_bytes_received = None
prev_timestamp_bytes = None

prev_packets_sent = None
prev_packets_recv = None
prev_timestamp_packets = None




# calculate bytes sent per second
def bytes_sent_per_second():
    global prev_bytes_sent, prev_timestamp_bytes

    current = psutil.net_io_counters().bytes_sent
    now = time.time()

    if prev_bytes_sent is None or prev_timestamp_bytes is None:
        prev_bytes_sent, prev_timestamp_bytes = current, now
        return None

    diff_bytes = current - prev_bytes_sent
    diff_time = now - prev_timestamp_bytes

    prev_bytes_sent, prev_timestamp_bytes = current, now

    if diff_time <= 0 or diff_bytes < 0:
        return None

    return diff_bytes / diff_time


# calculate bytes received per second
def bytes_received_per_second():
    global prev_bytes_received, prev_timestamp_bytes

    current = psutil.net_io_counters().bytes_recv
    now = time.time()

    if prev_bytes_received is None or prev_timestamp_bytes is None:
        prev_bytes_received, prev_timestamp_bytes = current, now
        return None

    diff_bytes = current - prev_bytes_received
    diff_time = now - prev_timestamp_bytes

    prev_bytes_received, prev_timestamp_bytes = current, now

    if diff_time <= 0 or diff_bytes < 0:
        return None

    return diff_bytes / diff_time



# calculate packets sent per second
def packets_send_rate_per_sec():
    global prev_packets_sent, prev_timestamp_packets

    net = psutil.net_io_counters()
    current = net.packets_sent
    now = time.time()

    if prev_packets_sent is None or prev_timestamp_packets is None:
        prev_packets_sent, prev_timestamp_packets = current, now
        return None

    diff_packets = current - prev_packets_sent
    diff_time = now - prev_timestamp_packets

    prev_packets_sent, prev_timestamp_packets = current, now

    if diff_time <= 0 or diff_packets < 0:
        return None

    return diff_packets / diff_time


# calculate packets received per second
def packets_receive_rate_per_sec():
    global prev_packets_recv, prev_timestamp_packets

    net = psutil.net_io_counters()
    current = net.packets_recv
    now = time.time()

    if prev_packets_recv is None or prev_timestamp_packets is None:
        prev_packets_recv, prev_timestamp_packets = current, now
        return None

    diff_packets = current - prev_packets_recv
    diff_time = now - prev_timestamp_packets

    prev_packets_recv, prev_timestamp_packets = current, now

    if diff_time <= 0 or diff_packets < 0:
        return None

    return diff_packets / diff_time



# calculate bandwidth utilization percentage
def bandwidth_utilization_percent(send_rate, receive_rate, interface="eth0"):
    if send_rate is None or receive_rate is None:
        return None

    stats = psutil.net_if_stats().get(interface)
    if not stats or stats.speed == 0:
        return None

    # Convert Mbps -> bytes/sec
    max_bytes_per_sec = (stats.speed * 1_000_000) / 8
    current_throughput = send_rate + receive_rate

    utilization = (current_throughput / max_bytes_per_sec) * 100
    return round(utilization, 2)



# collection function 
async def collect_network_traffic(event_bus):
    """
    Collect network traffic metrics, both raw and derived.
    """
    net = psutil.net_io_counters()

    event = {
        "timestamp": time.time(),
        "type": "network_traffic_metrics",
        "data": {
            # Raw counters
            "bytes_sent": net.bytes_sent,
            "bytes_received": net.bytes_recv,
            "packets_sent": net.packets_sent,
            "packets_received": net.packets_recv,

            # Derived metrics
            "send_rate_bytes_per_sec": bytes_sent_per_second(),
            "receive_rate_bytes_per_sec": bytes_received_per_second(),
            "send_rate_packets_per_sec": packets_send_rate_per_sec(),
            "receive_rate_packets_per_sec": packets_receive_rate_per_sec(),
            "bandwidth_utilization_percent": None,  # this is not working = ? 
        }
    }

    print("Network Traffic Data collected : ", event)
    await event_bus.publish(event)