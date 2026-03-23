# collection of interfaces data, NIC
# MTU => -> is the maximum size of a single data packet (in bytes) that a network interface 
# can send, splitting data into smaller packets if it exceeds this size


import psutil
import time


_prev_bytes_sent = {}
_prev_bytes_recv = {}
_prev_timestamp = {}



def interface_utilization_percent(iface, bytes_sent, bytes_recv, speed_mbps):
    """
    Calculate utilization % for a given interface.
    """

    import time

    global _prev_bytes_sent, _prev_bytes_recv, _prev_timestamp

    current_time = time.time()

    # first run for this interface
    if iface not in _prev_bytes_sent:
        _prev_bytes_sent[iface] = bytes_sent
        _prev_bytes_recv[iface] = bytes_recv
        _prev_timestamp[iface] = current_time
        return None

    # deltas, difference for a specific throghtput of an interface 
    diff_sent = bytes_sent - _prev_bytes_sent[iface]
    diff_recv = bytes_recv - _prev_bytes_recv[iface]
    diff_time = current_time - _prev_timestamp[iface]

    # update state
    _prev_bytes_sent[iface] = bytes_sent
    _prev_bytes_recv[iface] = bytes_recv
    _prev_timestamp[iface] = current_time

    # edge cases
    if diff_time <= 0 or diff_sent < 0 or diff_recv < 0:
        return None

    if speed_mbps == 0:
        return None

    # rates send/sec and rec/sec 
    send_rate = diff_sent / diff_time
    recv_rate = diff_recv / diff_time

    total_rate = send_rate + recv_rate

    # Mbps to bytes/sec
    max_bytes_per_sec = (speed_mbps * 1_000_000) / 8

    utilization = (total_rate / max_bytes_per_sec) * 100

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

        interfaces_data[iface] = {

            "interface_status": "UP" if iface_stats.isup else "DOWN", # if working or not 

            "interface_speed_mbps": iface_stats.speed, # in mbps

            # Maximum Transmission Unit 
            "mtu": iface_stats.mtu,

            # Traffic counters
            "interface_bytes_sent": iface_counters.bytes_sent,
            "interface_bytes_received": iface_counters.bytes_recv,
            "interface_packets_sent": iface_counters.packets_sent,
            "interface_packets_received": iface_counters.packets_recv,

            # used interface’s bandwidth
            "interface_utilization_percent": interface_utilization_percent(iface, iface_counters.bytes_sent, iface_counters.bytes_recv, iface_stats.speed),
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