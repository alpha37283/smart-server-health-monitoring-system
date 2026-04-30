# collection of interfaces data, NIC
# MTU => -> is the maximum size of a single data packet (in bytes) that a network interface 
# can send, splitting data into smaller packets if it exceeds this size


import psutil
import time


_prev_bytes_sent = {}
_prev_bytes_recv = {}
_prev_timestamp = {}


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
    Returns tuple: (send_rate_Bps, recv_rate_Bps, total_rate_Bps)
    """
    current_time = time.time()

    # first run for this interface
    if iface not in _prev_bytes_sent:
        _prev_bytes_sent[iface] = bytes_sent
        _prev_bytes_recv[iface] = bytes_recv
        _prev_timestamp[iface] = current_time
        return 0.0, 0.0, 0.0

    diff_sent = bytes_sent - _prev_bytes_sent[iface]
    diff_recv = bytes_recv - _prev_bytes_recv[iface]
    diff_time = current_time - _prev_timestamp[iface]

    # update state
    _prev_bytes_sent[iface] = bytes_sent
    _prev_bytes_recv[iface] = bytes_recv
    _prev_timestamp[iface] = current_time

    # edge cases
    if diff_time <= 0 or diff_sent < 0 or diff_recv < 0:
        return 0.0, 0.0, 0.0

    send_rate = diff_sent / diff_time
    recv_rate = diff_recv / diff_time
    total_rate = send_rate + recv_rate
    return send_rate, recv_rate, total_rate



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

    stats = psutil.net_if_stats()
    counters = psutil.net_io_counters(pernic=True) # returns list of interface avilable 

    interfaces_data = {}

    # stats     -> "status info"
    # counters  -> "traffic info"

    for iface, iface_stats in stats.items():  # for each interface, get two things, 1.

        iface_counters = counters.get(iface) # see for an interface if there is a counter available, if not skip it
        if not iface_counters:
            continue

        speed_mbps = _resolve_interface_speed_mbps(iface, iface_stats.speed)
        send_rate, recv_rate, total_rate = _get_interface_rates(
            iface,
            iface_counters.bytes_sent,
            iface_counters.bytes_recv,
        )
        # If link speed is unknown (0), fall back to current observed throughput for display.
        # This avoids persistent "0 Mbps" for active interfaces on Linux where speed isn't reported.
        display_speed_mbps = speed_mbps if speed_mbps > 0 else round((total_rate * 8) / 1_000_000, 2)

        interfaces_data[iface] = {

            "interface_status": "UP" if iface_stats.isup else "DOWN", # if working or not 

            "interface_speed_mbps": display_speed_mbps, # in mbps

            # Maximum Transmission Unit 
            "mtu": iface_stats.mtu,

            # Traffic counters
            "interface_bytes_sent": iface_counters.bytes_sent,
            "interface_bytes_received": iface_counters.bytes_recv,
            "interface_packets_sent": iface_counters.packets_sent,
            "interface_packets_received": iface_counters.packets_recv,

            # used interface’s bandwidth
            "interface_utilization_percent": interface_utilization_percent(total_rate, display_speed_mbps),
        }

    event = {
        "timestamp": time.time(),
        "type": "network_interface_metrics",
        "data": {
            "interfaces": interfaces_data
        }
    }

    print("Network Interface Data collected : ", event)

    await event_bus.publish(event)