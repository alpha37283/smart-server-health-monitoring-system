# agent/collector/containerization/container_health.py

import time
import subprocess

from .docker_client import get_docker_client



# OOM kill tracking (Docker Events API)
_prev_oom_counts = {}


def update_oom_kills(client):
    """
    Track OOM kill events using Docker Events API.
    """

    global _prev_oom_counts

    try:
        events = client.events(
            decode=True,
            since=int(time.time()) - 5
        )

        for event in events:

            try:
                if event.get("Type") != "container":
                    continue

                action = event.get("Action", "").lower()

                if "oom" not in action:
                    continue

                container_id = (
                    event.get("id", "")[:12]
                )

                if not container_id:
                    continue

                _prev_oom_counts[container_id] = (
                    _prev_oom_counts.get(container_id, 0) + 1
                )

            except Exception:
                continue

    except Exception:
        pass


def get_oom_kill_count(container_id):
    """
    Return OOM kill count per container.
    """

    return _prev_oom_counts.get(container_id, 0)




# Container metrics builder
def get_container_health_metrics(client):
    """
    Collect container health metrics.
    """

    metrics = []

    try:
        containers = client.containers.list(all=True)

    except Exception:
        return metrics

    # update OOM events cache
    update_oom_kills(client)

    for container in containers:

        try:

            container_id = container.short_id
            container_name = container.name

            attrs = container.attrs

            state = attrs.get("State", {})

            health = state.get("Health", {})
            status = health.get("Status", "")

            restart_count = state.get("RestartCount", 0)
            started_at = state.get("StartedAt")
            exit_code = state.get("ExitCode")


            # health classification

            healthy_containers = 1 if status == "healthy" else 0
            unhealthy_containers = 1 if status == "unhealthy" else 0

            failed_health_checks = 0

            if isinstance(health.get("Log"), list):
                for entry in health["Log"]:
                    if entry.get("ExitCode", 0) != 0:
                        failed_health_checks += 1


            # restart loop detection

            restarting_loop_count = 1 if restart_count > 5 else 0


            # uptime calculation

            container_uptime = None

            if started_at:
                try:
                    start_ts = (
                        subprocess.run(
                            ["date", "-d", started_at, "+%s"],
                            capture_output=True,
                            text=True
                        ).stdout.strip()
                    )

                    if start_ts.isdigit():
                        container_uptime = time.time() - int(start_ts)

                except Exception:
                    container_uptime = None


            # exit codes

            container_exit_codes = exit_code


            # final metrics

            metrics.append({

                "container_id": container_id,
                "container_name": container_name,

                "healthy_containers": healthy_containers,
                "unhealthy_containers": unhealthy_containers,

                "restarting_loop_count": restarting_loop_count,

                "container_uptime": container_uptime,

                "container_restart_count": restart_count,

                "oom_kill_count": get_oom_kill_count(container_id),

                "failed_health_checks": failed_health_checks,

                "container_exit_codes": container_exit_codes,
            })

        except Exception:
            continue

    return metrics



# Collector entrypoint
async def collect_container_health(event_bus):
    """
    Publish container health metrics.
    """

    client = get_docker_client()

    if client is None:

        event = {
            "timestamp": time.time(),
            "type": "container_health_metrics",
            "data": {
                "runtime_available": False,
                "containers": []
            }
        }

        await event_bus.publish(event)
        return

    metrics = get_container_health_metrics(client)

    event = {
        "timestamp": time.time(),
        "type": "container_health_metrics",
        "data": {
            "runtime_available": True,
            "containers": metrics
        }
    }

    print(". . . Container Health Data collected . . .")

    await event_bus.publish(event)