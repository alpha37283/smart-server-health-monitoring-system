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
            "send_rate_packets_per_sec": None,
            "receive_rate_packets_per_sec": None,
            "bandwidth_utilization_percent": None,
        }
    }

    print("Network Traffic Data collected")

    await event_bus.publish(event)