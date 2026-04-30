import psutil
import time


_prev_bytes_sent = {}
_prev_bytes_recv = {}
_prev_timestamp = {}
_prev_collect_timestamp = None


def _resolve_interface_speed_mbps(iface, reported_speed_mbps):
    """
    Resolve interface link speed in Mbps.
    psutil may report 0/-1 for valid UP interfaces on Linux.
    """
    if isinstance(reported_speed_mbps, (int, float)) and reported_speed_mbps > 0:
        return float(reported_speed_mbps)

    sysfs_speed_path = f"/sys/class/net/{iface}/speed"
    try:
        with open(sysfs_speed_path, "r", encoding="utf-8") as f:
            speed_val = float(f.read().strip())
            if speed_val > 0:
                return speed_val
    except (OSError, ValueError):
        pass

    return 0.0


def _get_interface_rates(iface, bytes_sent, bytes_recv):
    """
    Returns tuple: (send_rate_Bps, recv_rate_Bps, total_rate_Bps, sample_window_sec)
    """
    current_time = time.time()

    if iface not in _prev_bytes_sent:
        _prev_bytes_sent[iface] = bytes_sent
        _prev_bytes_recv[iface] = bytes_recv
        _prev_timestamp[iface] = current_time
        return 0.0, 0.0, 0.0, None

    diff_sent = bytes_sent - _prev_bytes_sent[iface]
    diff_recv = bytes_recv - _prev_bytes_recv[iface]
    diff_time = current_time - _prev_timestamp[iface]

    _prev_bytes_sent[iface] = bytes_sent
    _prev_bytes_recv[iface] = bytes_recv
    _prev_timestamp[iface] = current_time

    if diff_time <= 0 or diff_sent < 0 or diff_recv < 0:
        return 0.0, 0.0, 0.0, None

    send_rate = diff_sent / diff_time
    recv_rate = diff_recv / diff_time
    total_rate = send_rate + recv_rate
    return send_rate, recv_rate, total_rate, diff_time



def interface_utilization_percent(total_rate_bytes_per_sec, speed_mbps):
    """
    Calculate utilization % for a given interface.
    """

    if speed_mbps <= 0:
        return 0.0

    max_bytes_per_sec = (speed_mbps * 1_000_000) / 8
    if max_bytes_per_sec <= 0:
        return 0.0

    utilization = (total_rate_bytes_per_sec / max_bytes_per_sec) * 100
    utilization = max(0.0, min(100.0, utilization))
    return round(utilization, 2)


async def collect_network_interfaces(event_bus):
    global _prev_collect_timestamp

    stats = psutil.net_if_stats()
    counters = psutil.net_io_counters(pernic=True) # returns list of interface avilable 
    now = time.time()

    interfaces_data = {}

    for iface, iface_stats in stats.items():

        iface_counters = counters.get(iface)
        if not iface_counters:
            continue

        speed_mbps = _resolve_interface_speed_mbps(iface, iface_stats.speed)
        send_rate, recv_rate, total_rate, sample_window_sec = _get_interface_rates(
            iface,
            iface_counters.bytes_sent,
            iface_counters.bytes_recv,
        )
        speed_known = speed_mbps > 0

        interfaces_data[iface] = {

            "interface_status": "UP" if iface_stats.isup else "DOWN",

            "interface_speed_mbps": speed_mbps,
            "interface_speed_known": speed_known,

            "mtu": iface_stats.mtu,

            "interface_bytes_sent": iface_counters.bytes_sent,
            "interface_bytes_received": iface_counters.bytes_recv,
            "interface_packets_sent": iface_counters.packets_sent,
            "interface_packets_received": iface_counters.packets_recv,

            "interface_utilization_percent": interface_utilization_percent(total_rate, speed_mbps) if speed_known else None,
            "interface_utilization_estimated": False if speed_known else None,
            "interface_sample_window_sec": sample_window_sec,
            "interface_send_rate_bytes_per_sec": send_rate,
            "interface_receive_rate_bytes_per_sec": recv_rate,
        }

    event_sample_window_sec = None
    if _prev_collect_timestamp is not None:
        diff = now - _prev_collect_timestamp
        if diff > 0:
            event_sample_window_sec = diff
    _prev_collect_timestamp = now

    event = {
        "timestamp": now,
        "timestamp_ns": time.time_ns(),
        "type": "network_interface_metrics",
        "data": {
            "scope": "per_interface",
            "sample_window_sec": event_sample_window_sec,
            "interfaces": interfaces_data
        }
    }

    print("Network Interface Data collected : ", event)

    await event_bus.publish(event)