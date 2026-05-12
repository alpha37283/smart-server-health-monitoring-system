# agent/collector/containerization/container_network.py

import time

from .docker_client import get_docker_client

import psutil

import os


def get_active_container_connections(container_pid):
    """
    Count active ESTABLISHED connections
    belonging to a container namespace.
    """

    if not container_pid:
        return 0

    try:

        target_ns = os.readlink(
            f"/proc/{container_pid}/ns/net"
        )

    except Exception:
        return 0

    active_connections = 0

    try:

        for conn in psutil.net_connections(kind="inet"):

            if conn.status != "ESTABLISHED":
                continue

            if conn.pid is None:
                continue

            try:

                conn_ns = os.readlink(
                    f"/proc/{conn.pid}/ns/net"
                )

                if conn_ns == target_ns:
                    active_connections += 1

            except Exception:
                continue

    except Exception:
        return 0

    return active_connections



# Store previous bandwidth stats
_prev_network_stats = {}


def calculate_bandwidth_rate(
    container_id,
    total_bytes
):
    """
    Calculate bandwidth throughput rate (bytes/sec).
    """

    global _prev_network_stats

    current_time = time.time()

    previous = _prev_network_stats.get(container_id)

    # First run
    if previous is None:

        _prev_network_stats[container_id] = {
            "bytes": total_bytes,
            "timestamp": current_time
        }

        return 0.0

    prev_bytes = previous["bytes"]
    prev_timestamp = previous["timestamp"]

    time_delta = current_time - prev_timestamp

    if time_delta <= 0:
        return 0.0

    byte_delta = total_bytes - prev_bytes

    bandwidth_rate = byte_delta / time_delta

    # Update cache
    _prev_network_stats[container_id] = {
        "bytes": total_bytes,
        "timestamp": current_time
    }

    return round(max(bandwidth_rate, 0), 2)


def get_container_network_metrics(client):
    """
    Collect Docker SDK based network metrics.
    """

    container_metrics = []

    try:
        containers = client.containers.list(all=True)

    except Exception:
        return container_metrics

    for container in containers:

        try:
            stats = container.stats(stream=False)

            # -----------------------------------
            # Metadata
            # -----------------------------------

            container_id = container.short_id
            container_name = container.name

            # -----------------------------------
            # Network stats
            # -----------------------------------

            networks = stats.get("networks", {})

            rx_bytes = 0
            tx_bytes = 0

            rx_packets = 0
            tx_packets = 0

            rx_errors = 0
            tx_errors = 0

            for interface_data in networks.values():

                rx_bytes += interface_data.get(
                    "rx_bytes",
                    0
                )

                tx_bytes += interface_data.get(
                    "tx_bytes",
                    0
                )

                rx_packets += interface_data.get(
                    "rx_packets",
                    0
                )

                tx_packets += interface_data.get(
                    "tx_packets",
                    0
                )

                rx_errors += interface_data.get(
                    "rx_errors",
                    0
                )

                tx_errors += interface_data.get(
                    "tx_errors",
                    0
                )

            # -----------------------------------
            # Bandwidth rate
            # -----------------------------------

            total_network_bytes = rx_bytes + tx_bytes

            network_bandwidth_rate = (
                calculate_bandwidth_rate(
                    container_id,
                    total_network_bytes
                )
            )

            # -----------------------------------
            # Open ports
            # -----------------------------------

            ports = (
                container.attrs
                .get("NetworkSettings", {})
                .get("Ports", {})
            )

            container_open_ports = []

            public_exposed_ports = []

            for container_port, bindings in ports.items():

                container_open_ports.append(
                    container_port
                )

                # Public exposure check
                if bindings:

                    for binding in bindings:

                        host_ip = binding.get(
                            "HostIp",
                            ""
                        )

                        host_port = binding.get(
                            "HostPort"
                        )

                        if host_ip in (
                            "0.0.0.0",
                            "::"
                        ):

                            public_exposed_ports.append({
                                "container_port": container_port,
                                "host_port": host_port,
                                "host_ip": host_ip
                            })

            # -----------------------------------
            # Container PID
            # -----------------------------------

            container_pid = (
                container.attrs
                .get("State", {})
                .get("Pid")
            )



            # -----------------------------------
            # Active connections
            # -----------------------------------

            active_container_connections = (
                get_active_container_connections(
                    container_pid
                )
            )



            # -----------------------------------
            # Final metrics
            # -----------------------------------

            container_metrics.append({

                "container_id": container_id,
                "container_name": container_name,

                # Traffic
                "container_rx_bytes": rx_bytes,
                "container_tx_bytes": tx_bytes,

                # Packets
                "container_rx_packets": rx_packets,
                "container_tx_packets": tx_packets,

                # Errors
                "container_rx_errors": rx_errors,
                "container_tx_errors": tx_errors,

                # Ports
                "container_open_ports": container_open_ports,
                "public_exposed_ports": public_exposed_ports,

                # Throughput
                "network_bandwidth_rate": network_bandwidth_rate,

                # active connections containers
                "active_container_connections": active_container_connections,
            })

        except Exception:
            continue

    return container_metrics


async def collect_container_network(event_bus):
    """
    Collect container network metrics.
    """

    client = get_docker_client()

    if client is None:

        event = {
            "timestamp": time.time(),
            "type": "container_network_metrics",
            "data": {
                "runtime_available": False,
                "containers": [],
                
            }
        }

        await event_bus.publish(event)
        return

    metrics = get_container_network_metrics(client)

    event = {
        "timestamp": time.time(),
        "type": "container_network_metrics",
        "data": {
            "runtime_available": True,
            "containers": metrics
        }
    }

    print(". . . Container Network Data collected . . .")

    await event_bus.publish(event)