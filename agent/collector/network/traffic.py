# agent/collector/network/traffic.py

import psutil
import time


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