
import psutil
import time


_prev_snapshot = None


def _safe_rate(current, previous, dt):
    if dt <= 0:
        return None
    diff = current - previous
    if diff < 0:
        diff = 0
    return diff / dt


def _collect_rates_from_snapshot(now, net):
    """
    Compute all traffic rates from one consistent snapshot window.
    """
    global _prev_snapshot

    if _prev_snapshot is None:
        _prev_snapshot = {
            "timestamp": now,
            "bytes_sent": net.bytes_sent,
            "bytes_received": net.bytes_recv,
            "packets_sent": net.packets_sent,
            "packets_received": net.packets_recv,
        }
        return None, None, None, None, None

    dt = now - _prev_snapshot["timestamp"]
    send_rate_bytes_per_sec = _safe_rate(net.bytes_sent, _prev_snapshot["bytes_sent"], dt)
    receive_rate_bytes_per_sec = _safe_rate(net.bytes_recv, _prev_snapshot["bytes_received"], dt)
    send_rate_packets_per_sec = _safe_rate(net.packets_sent, _prev_snapshot["packets_sent"], dt)
    receive_rate_packets_per_sec = _safe_rate(net.packets_recv, _prev_snapshot["packets_received"], dt)

    _prev_snapshot = {
        "timestamp": now,
        "bytes_sent": net.bytes_sent,
        "bytes_received": net.bytes_recv,
        "packets_sent": net.packets_sent,
        "packets_received": net.packets_recv,
    }

    return (
        send_rate_bytes_per_sec,
        receive_rate_bytes_per_sec,
        send_rate_packets_per_sec,
        receive_rate_packets_per_sec,
        dt if dt > 0 else None,
    )



def bandwidth_utilization_percent(send_rate, receive_rate, interface="eth0"):
    if send_rate is None or receive_rate is None:
        return None

    stats = psutil.net_if_stats().get(interface)
    if not stats or stats.speed == 0:
        return None

    max_bytes_per_sec = (stats.speed * 1_000_000) / 8
    current_throughput = send_rate + receive_rate

    utilization = (current_throughput / max_bytes_per_sec) * 100
    return round(utilization, 2)



async def collect_network_traffic(event_bus):
    """
    Collect network traffic metrics, both raw and derived.
    """
    net = psutil.net_io_counters()
    now = time.time()
    (
        send_rate_bytes_per_sec,
        receive_rate_bytes_per_sec,
        send_rate_packets_per_sec,
        receive_rate_packets_per_sec,
        sample_window_sec,
    ) = _collect_rates_from_snapshot(now, net)

    event = {
        "timestamp": now,
        "timestamp_ns": time.time_ns(),
        "type": "network_traffic_metrics",
        "data": {
            "scope": "host_total",
            "sample_window_sec": sample_window_sec,
            "bytes_sent": net.bytes_sent,
            "bytes_received": net.bytes_recv,
            "packets_sent": net.packets_sent,
            "packets_received": net.packets_recv,

            "send_rate_bytes_per_sec": send_rate_bytes_per_sec,
            "receive_rate_bytes_per_sec": receive_rate_bytes_per_sec,
            "send_rate_packets_per_sec": send_rate_packets_per_sec,
            "receive_rate_packets_per_sec": receive_rate_packets_per_sec,
            "bandwidth_utilization_percent": None,
        }
    }

    print("Network Traffic Data collected : ", event)
    await event_bus.publish(event)