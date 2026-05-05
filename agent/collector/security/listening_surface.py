# agent/collector/security/listening_surface.py

import time
import asyncio
import psutil
import socket

_prev_ports = set()


def get_listening_surface_metrics():
    global _prev_ports

    counts = {
        "listen_socket_count": 0,
        "tcp_listen_count": 0,
        "udp_listen_count": 0,
        "distinct_listen_ports": 0,
        "new_listen_ports_interval": 0,
        "public_listen_count": 0,
        "privileged_port_count": 0,
    }

    current_ports = set()

    try:
        connections = psutil.net_connections()
    except Exception:
        return counts

    for conn in connections:
        if not conn.laddr:
            continue

        ip = conn.laddr.ip
        port = conn.laddr.port

        # TCP LISTEN
        if conn.type == socket.SOCK_STREAM and conn.status == "LISTEN":
            counts["listen_socket_count"] += 1
            counts["tcp_listen_count"] += 1
            current_ports.add(port)

            if ip not in ("127.0.0.1", "::1"):
                counts["public_listen_count"] += 1

            if port < 1024:
                counts["privileged_port_count"] += 1

        # UDP (no LISTEN state)
        elif conn.type == socket.SOCK_DGRAM:
            counts["listen_socket_count"] += 1
            counts["udp_listen_count"] += 1
            current_ports.add(port)

            if ip not in ("127.0.0.1", "::1"):
                counts["public_listen_count"] += 1

            if port < 1024:
                counts["privileged_port_count"] += 1

    counts["distinct_listen_ports"] = len(current_ports)

    # new ports since last interval
    new_ports = current_ports - _prev_ports
    counts["new_listen_ports_interval"] = len(new_ports)

    _prev_ports = current_ports

    return counts


async def collect_listening_surface(event_bus):
    data = await asyncio.to_thread(get_listening_surface_metrics)

    event = {
        "timestamp": time.time(),
        "type": "security_listening_surface_metrics",
        "data": data,
    }

    print("Listening surface security data collected : ", event)

    await event_bus.publish(event)