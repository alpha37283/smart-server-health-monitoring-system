# agent/collector/containerization/container_process.py

import os
import time
import psutil

from .docker_client import get_docker_client


def get_container_pid_namespace(container_pid):
    """
    Return PID namespace symlink.
    """

    try:
        return os.readlink(
            f"/proc/{container_pid}/ns/pid"
        )

    except Exception:
        return None


def get_container_processes(container_pid):
    """
    Get all processes belonging to container PID namespace.
    """

    processes = []

    target_namespace = (
        get_container_pid_namespace(
            container_pid
        )
    )

    if not target_namespace:
        return processes

    for proc in psutil.process_iter([
        "pid",
        "ppid",
        "name",
        "status",
        "memory_info",
        "cpu_percent",
        "num_threads"
    ]):

        try:

            proc_pid = proc.info["pid"]

            proc_namespace = os.readlink(
                f"/proc/{proc_pid}/ns/pid"
            )

            if proc_namespace == target_namespace:
                processes.append(proc)

        except Exception:
            continue

    return processes


def get_process_count(processes):
    """
    Count total processes.
    """

    return len(processes)


def get_zombie_process_count(processes):
    """
    Count zombie processes.
    """

    count = 0

    for proc in processes:

        try:

            if (
                proc.info["status"]
                == psutil.STATUS_ZOMBIE
            ):

                count += 1

        except Exception:
            continue

    return count


def get_thread_count(processes):
    """
    Count total active threads.
    """

    total_threads = 0

    for proc in processes:

        try:

            total_threads += (
                proc.info["num_threads"] or 0
            )

        except Exception:
            continue

    return total_threads


def get_top_cpu_process(processes):
    """
    Return highest CPU consuming process.
    """

    top_process = None
    highest_cpu = -1

    for proc in processes:

        try:

            cpu_percent = (
                proc.info["cpu_percent"] or 0
            )

            if cpu_percent > highest_cpu:

                highest_cpu = cpu_percent

                top_process = {
                    "pid": proc.info["pid"],
                    "name": proc.info["name"],
                    "cpu_percent": cpu_percent
                }

        except Exception:
            continue

    return top_process


def get_top_memory_process(processes):
    """
    Return highest memory consuming process.
    """

    top_process = None
    highest_memory = -1

    for proc in processes:

        try:

            memory_usage = (
                proc.info["memory_info"].rss
                if proc.info["memory_info"]
                else 0
            )

            if memory_usage > highest_memory:

                highest_memory = memory_usage

                top_process = {
                    "pid": proc.info["pid"],
                    "name": proc.info["name"],
                    "memory_usage": memory_usage
                }

        except Exception:
            continue

    return top_process


def get_orphan_process_count(processes):
    """
    Count orphan processes.
    """

    count = 0

    for proc in processes:

        try:

            if proc.info["ppid"] == 1:
                count += 1

        except Exception:
            continue

    return count


def build_container_process_metrics(container):
    """
    Build metrics for single container.
    """

    try:

        container_id = container.short_id
        container_name = container.name

        container_pid = (
            container.attrs
            .get("State", {})
            .get("Pid")
        )

        if not container_pid:
            return None

        processes = get_container_processes(
            container_pid
        )

        metrics = {

            "container_id": container_id,
            "container_name": container_name,

            "process_count":
                get_process_count(processes),

            "zombie_process_count":
                get_zombie_process_count(processes),

            "thread_count":
                get_thread_count(processes),

            "top_cpu_process":
                get_top_cpu_process(processes),

            "top_memory_process":
                get_top_memory_process(processes),

            "orphan_process_count":
                get_orphan_process_count(processes),
        }

        return metrics

    except Exception:
        return None


def get_container_process_metrics(client):
    """
    Collect process metrics for all containers.
    """

    metrics = []

    try:
        containers = client.containers.list(all=True)

    except Exception:
        return metrics

    for container in containers:

        container_metric = (
            build_container_process_metrics(
                container
            )
        )

        if container_metric:
            metrics.append(container_metric)

    return metrics


async def collect_container_process(event_bus):
    """
    Collect container process metrics.
    """

    client = get_docker_client()

    if client is None:

        event = {
            "timestamp": time.time(),
            "type": "container_process_metrics",
            "data": {
                "runtime_available": False,
                "containers": []
            }
        }

        await event_bus.publish(event)
        return

    metrics = get_container_process_metrics(client)

    event = {
        "timestamp": time.time(),
        "type": "container_process_metrics",
        "data": {
            "runtime_available": True,
            "containers": metrics
        }
    }

    print(". . . Container Process Data collected . . .")

    await event_bus.publish(event)