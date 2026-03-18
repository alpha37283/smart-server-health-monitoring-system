# collection of interfaces data, NIC
# MTU => -> is the maximum size of a single data packet (in bytes) that a network interface can send, splitting data into smaller packets if it exceeds this size
import psutil
import time


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

            # Derived (later)
            "interface_utilization_percent": None,
        }

    event = {
        "timestamp": time.time(),
        "type": "network_interface_metrics",
        "data": {
            "interfaces": interfaces_data
        }
    }

    print("Network Interface Data collected")

    await event_bus.publish(event)