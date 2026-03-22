import socket
import time


def get_socket_rtt(host, port=80, timeout=2):
    try:
        start = time.time()
        sock = socket.create_connection((host, port), timeout=timeout)
        sock.close()
        return (time.time() - start) * 1000  # ms
    except Exception:
        return None




def get_handshake_time(host, port=80, timeout=2):
    try:
        start = time.time()

        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(timeout)
        sock.connect((host, port))
        sock.close()

        return (time.time() - start) * 1000  # ms
    except Exception:
        return None


def get_latency_metrics():

    targets = {
        "8.8.8.8": "Google DNS",
        "1.1.1.1": "Cloudflare DNS",
        "google.com": "Google"
    }

    latency_per_target = {}
    rtt_per_target = {}
    handshake_per_target = {}

    for host, name in targets.items():

        rtt = get_socket_rtt(host)
        handshake = get_handshake_time(host)

        latency_per_target[host] = {
            "name": name,
            "latency_ms": rtt
        }

        rtt_per_target[host] = {
            "name": name,
            "rtt_ms": rtt
        }

        handshake_per_target[host] = {
            "name": name,
            "handshake_ms": handshake
        }

    return {
        "latency_per_target": latency_per_target,
        "rtt_per_target": rtt_per_target,
        "handshake_per_target": handshake_per_target
    }



def get_average_latency(latency_per_target):

    values = [
        v["latency_ms"]
        for v in latency_per_target.values()
        if v["latency_ms"] is not None
    ]

    if not values:
        return None

    return sum(values) / len(values)



def get_average_rtt(rtt_per_target):

    values = [
        v["rtt_ms"]
        for v in rtt_per_target.values()
        if v["rtt_ms"] is not None
    ]

    if not values:
        return None

    return sum(values) / len(values)





def get_average_handshake(handshake_per_target):

    values = [
        v["handshake_ms"]
        for v in handshake_per_target.values()
        if v["handshake_ms"] is not None
    ]

    if not values:
        return None

    return sum(values) / len(values)




# the collector 

async def collect_latency_metrics(event_bus):

    data = get_latency_metrics()

    avg_latency = get_average_latency(data["latency_per_target"])
    avg_rtt = get_average_rtt(data["rtt_per_target"])
    avg_handshake = get_average_handshake(data["handshake_per_target"])

    event = {
        "timestamp": time.time(),
        "type": "network_latency_metrics",
        "data": {
            **data,

            "average_latency_ms": avg_latency,
            "packet_round_trip_time": avg_rtt,
            "connection_handshake_time": avg_handshake
        }
    }

    print("Latency Metrics Collected")

    await event_bus.publish(event)