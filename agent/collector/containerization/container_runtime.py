# agent/collector/containerization/container_runtime.py

import time
import subprocess

from .docker_client import get_docker_client


def get_container_counts(client):
    """
    Collect container state metrics.
    """

    metrics = {
        "total_containers": 0,
        "running_containers": 0,
        "stopped_containers": 0,
        "paused_containers": 0,
        "restarting_containers": 0,
        "dead_containers": 0,
    }

    try:
        containers = client.containers.list(all=True)

        metrics["total_containers"] = len(containers)

        for container in containers:

            state = (
                container.attrs
                .get("State", {})
                .get("Status", "")
                .lower()
            )

            if state == "running":
                metrics["running_containers"] += 1

            elif state == "exited":
                metrics["stopped_containers"] += 1

            elif state == "paused":
                metrics["paused_containers"] += 1

            elif state == "restarting":
                metrics["restarting_containers"] += 1

            elif state == "dead":
                metrics["dead_containers"] += 1

    except Exception:
        pass

    return metrics


def get_runtime_status():
    """
    Get Docker daemon health state.
    """

    try:
        result = subprocess.run(
            ["systemctl", "is-active", "docker"],
            capture_output=True,
            text=True,
            timeout=2
        )

        status = result.stdout.strip()

        if status == "active":
            return "active"

        return status or "inactive"

    except Exception:
        return "unknown"


def get_docker_uptime():
    """
    Get Docker daemon uptime in seconds.
    """

    try:
        result = subprocess.run(
            [
                "systemctl",
                "show",
                "docker",
                "--property=ActiveEnterTimestampMonotonic"
            ],
            capture_output=True,
            text=True,
            timeout=2
        )

        output = result.stdout.strip()

        if "=" not in output:
            return None

        value = output.split("=")[1].strip()

        if not value.isdigit():
            return None

        daemon_start_seconds = int(value) / 1_000_000

        system_uptime = time.monotonic()

        uptime = system_uptime - daemon_start_seconds

        return round(max(uptime, 0), 2)

    except Exception:
        return None


def get_runtime_version(client):
    """
    Get Docker runtime version.
    """

    try:
        version_info = client.version()

        return version_info.get("Version")

    except Exception:
        return None


async def collect_container_runtime(event_bus):
    """
    Collect container runtime metrics.
    """

    client = get_docker_client()

    if client is None:

        event = {
            "timestamp": time.time(),
            "type": "container_runtime_metrics",
            "data": {
                "runtime_available": False
            }
        }

        await event_bus.publish(event)
        return

    container_metrics = get_container_counts(client)

    event = {
        "timestamp": time.time(),
        "type": "container_runtime_metrics",
        "data": {

            "runtime_available": True,

            # Container state metrics
            **container_metrics,

            # Runtime metrics
            "container_runtime_status": get_runtime_status(),
            "docker_daemon_uptime": get_docker_uptime(),
            "runtime_version": get_runtime_version(client),
        }
    }

    print(". . . Container Runtime Data collected . . .")

    await event_bus.publish(event)