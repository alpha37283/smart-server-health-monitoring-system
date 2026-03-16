# agent/collector/network/traffic.py

import psutil
import time

prev_bytes_received = None
prev_bytes_sent = None
prev_timestamp = None

def bytes_sent_per_second():
    global prev_bytes_sent, prev_timestamp

    current_bytes_sent = psutil.net_io_counters().bytes_sent
    current_time = time.time()

    # first run
    if prev_bytes_sent is None or prev_timestamp is None:
        prev_bytes_sent = current_bytes_sent
        prev_timestamp = current_time
        return None

    diff_bytes = current_bytes_sent - prev_bytes_sent
    diff_time = current_time - prev_timestamp

    # update previous values
    prev_bytes_sent = current_bytes_sent
    prev_timestamp = current_time

    if diff_time <= 0 or diff_bytes < 0:
        return None

    return diff_bytes / diff_time



def bytes_received_per_second():
    global prev_bytes_received, prev_timestamp

    current_bytes_received = psutil.net_io_counters().bytes_recv
    current_time = time.time()

    # first run
    if prev_bytes_received is None or prev_timestamp is None:
        prev_bytes_received = current_bytes_received
        prev_timestamp = current_time
        return None

    diff_bytes = current_bytes_received - prev_bytes_received
    diff_time = current_time - prev_timestamp

    # update previous values
    prev_bytes_received = current_bytes_received
    prev_timestamp = current_time

    if diff_time <= 0 or diff_bytes < 0:
        return None

    return diff_bytes / diff_time   
    

prev_packets_sent = None
prev_packets_recv = None
prev_timestamp_packets = None   


def packets_send_rate_per_sec():
    global prev_packets_sent, prev_timestamp_packets

    net = psutil.net_io_counters()
    current_packets_sent = net.packets_sent
    current_time = time.time()

    if prev_packets_sent is None or prev_timestamp_packets is None:
        prev_packets_sent = current_packets_sent
        prev_timestamp_packets = current_time
        return None

    diff_packets = current_packets_sent - prev_packets_sent
    diff_time = current_time - prev_timestamp_packets

    prev_packets_sent = current_packets_sent
    prev_timestamp_packets = current_time

    if diff_time <= 0 or diff_packets < 0:
        return None

    return diff_packets / diff_time


def packets_receive_rate_per_sec():
    global prev_packets_recv, prev_timestamp_packets

    net = psutil.net_io_counters()
    current_packets_recv = net.packets_recv
    current_time = time.time()

    if prev_packets_recv is None or prev_timestamp_packets is None:
        prev_packets_recv = current_packets_recv
        prev_timestamp_packets = current_time
        return None

    diff_packets = current_packets_recv - prev_packets_recv
    diff_time = current_time - prev_timestamp_packets

    prev_packets_recv = current_packets_recv
    prev_timestamp_packets = current_time

    if diff_time <= 0 or diff_packets < 0:
        return None

    return diff_packets / diff_time




# this calculate that how much of NIC bandwidth is being used 
def bandwidth_utilization_percent(send_rate, receive_rate, interface="eth0"):

    if send_rate is None or receive_rate is None:
        return None

    stats = psutil.net_if_stats().get(interface)

    if not stats or stats.speed == 0:
        return None

    # Mbps -> bytes/sec
    max_bytes_per_sec = (stats.speed * 1_000_000) / 8

    current_throughput = send_rate + receive_rate

    utilization = (current_throughput / max_bytes_per_sec) * 100

    return round(utilization, 2)



async def collect_network_traffic(event_bus):
    """
    Collect basic network traffic metrics using psutil.
    Derived metrics (rates, utilization) will be implemented later.
    """

    net = psutil.net_io_counters()

    event = {
        "timestamp": time.time(),
        "type": "network_traffic_metrics",
        "data": {

            # Raw counters from psutil
            "bytes_sent": net.bytes_sent,
            "bytes_received": net.bytes_recv,
            "packets_sent": net.packets_sent,
            "packets_received": net.packets_recv,

            # Derived metrics (to implement later)
            "send_rate_bytes_per_sec": bytes_sent_per_second(),
            "receive_rate_bytes_per_sec": bytes_received_per_second(),
            "send_rate_packets_per_sec": packets_send_rate_per_sec(),
            "receive_rate_packets_per_sec": packets_receive_rate_per_sec(),
            "bandwidth_utilization_percent": None,
        }
    }

    print("Network Traffic Data collected")

    await event_bus.publish(event)