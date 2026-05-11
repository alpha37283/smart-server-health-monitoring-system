# agent/collector/containerization/container_resource.py

import time

from .docker_client import get_docker_client


# Previous IO stats for throughput calculation
_prev_container_io = {}


def calculate_memory_percent(usage, limit):
    """
    Calculate memory utilization percentage.
    """

    if limit <= 0:
        return 0.0

    return round((usage / limit) * 100, 2)





def calculate_io_rate(container_id, current_total_bytes):
    """
    Calculate disk IO throughput rate (bytes/sec).
    """

    global _prev_container_io

    current_time = time.time()

    previous = _prev_container_io.get(container_id)

    # First run
    if previous is None:

        _prev_container_io[container_id] = {
            "bytes": current_total_bytes,
            "timestamp": current_time
        }

        return 0.0

    prev_bytes = previous["bytes"]
    prev_timestamp = previous["timestamp"]

    time_delta = current_time - prev_timestamp

    if time_delta <= 0:
        return 0.0

    byte_delta = current_total_bytes - prev_bytes

    io_rate = byte_delta / time_delta

    # Update cache
    _prev_container_io[container_id] = {
        "bytes": current_total_bytes,
        "timestamp": current_time
    }

    return round(max(io_rate, 0), 2)


def get_cpu_throttling_metrics(stats):
    """
    Extract CPU throttling metrics from cgroup stats.
    """

    throttling_data = (
        stats.get("cpu_stats", {})
        .get("throttling_data", {})
    )

    cpu_throttling_events = throttling_data.get(
        "throttled_periods",
        0
    )

    cpu_throttled_time = throttling_data.get(
        "throttled_time",
        0
    )

    return (
        cpu_throttling_events,
        cpu_throttled_time
    )



def get_container_resource_metrics(client):
    """
    Collect per-container resource metrics using Docker SDK.
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
            # Basic metadata
            # -----------------------------------

            container_id = container.short_id
            container_name = container.name

            # -----------------------------------
            # CPU %
            # Docker official calculation
            # -----------------------------------

            cpu_stats = stats.get("cpu_stats", {})
            precpu_stats = stats.get("precpu_stats", {})

            cpu_delta = (
                cpu_stats.get("cpu_usage", {}).get("total_usage", 0)
                - precpu_stats.get("cpu_usage", {}).get("total_usage", 0)
            )

            system_delta = (
                cpu_stats.get("system_cpu_usage", 0)
                - precpu_stats.get("system_cpu_usage", 0)
            )

            online_cpus = cpu_stats.get("online_cpus", 1)

            container_cpu_percent = 0.0

            if system_delta > 0 and cpu_delta > 0:
                container_cpu_percent = (
                    (cpu_delta / system_delta)
                    * online_cpus
                    * 100.0
                )

            # -----------------------------------
            # Memory
            # -----------------------------------

            memory_stats = stats.get("memory_stats", {})

            container_memory_usage = memory_stats.get("usage", 0)

            container_memory_limit = memory_stats.get("limit", 0)

            # -----------------------------------
            # Swap
            # -----------------------------------

            container_swap_usage = memory_stats.get("stats", {}).get(
                "swap",
                0
            )

            # -----------------------------------
            # PIDs
            # -----------------------------------

            container_pids = (
                stats.get("pids_stats", {})
                .get("current", 0)
            )

            # -----------------------------------
            # Block IO
            # -----------------------------------

            blk_read = 0
            blk_write = 0

            blkio_stats = (
                stats.get("blkio_stats", {})
                .get("io_service_bytes_recursive", [])
            )

            for entry in blkio_stats:

                operation = entry.get("op", "").lower()

                if operation == "read":
                    blk_read += entry.get("value", 0)

                elif operation == "write":
                    blk_write += entry.get("value", 0)

            # -----------------------------------
            # Final metric object
            # -----------------------------------

            container_metrics.append({

                "container_id": container_id,
                "container_name": container_name,

                # CPU
                "container_cpu_percent": round(
                    container_cpu_percent,
                    2
                ),

                # Memory
                "container_memory_usage": container_memory_usage,
                "container_memory_limit": container_memory_limit,

                # Swap
                "container_swap_usage": container_swap_usage,

                # PIDs
                "container_pids": container_pids,

                # Block IO
                "container_blk_read_bytes": blk_read,
                "container_blk_write_bytes": blk_write,
            })

        except Exception:
            continue

    return container_metrics


async def collect_container_resources(event_bus):
    """
    Collect container resource metrics.
    """

    client = get_docker_client()

    if client is None:

        event = {
            "timestamp": time.time(),
            "type": "container_resource_metrics",
            "data": {
                "runtime_available": False,
                "containers": []
            }
        }

        await event_bus.publish(event)
        return

    metrics = get_container_resource_metrics(client)

    event = {
        "timestamp": time.time(),
        "type": "container_resource_metrics",
        "data": {
            "runtime_available": True,
            "containers": metrics
        }
    }

    print(". . . Container Resource Data collected . . .")

    await event_bus.publish(event)