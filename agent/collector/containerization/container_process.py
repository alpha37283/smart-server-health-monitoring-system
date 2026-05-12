# agent/collector/containerization/container_process.py

import time
import psutil

from .docker_client import get_docker_client


def get_container_process_metrics(client):
    """
    Collect process-related metrics for containers.
    """

    container_metrics = []

    try:
        containers = client.containers.list(all=True)

    except Exception:
        return container_metrics

    for container in containers:

        try:

            # -----------------------------------
            # Metadata
            # -----------------------------------

            container_id = container.short_id
            container_name = container.name

            container_pid = (
                container.attrs
                .get("State", {})
                .get("Pid")
            )

            if not container_pid:
                continue

            # -----------------------------------
            # Namespace reference
            # -----------------------------------

            try:
                target_ns = (
                    psutil.Process(container_pid)
                    .as_dict(attrs=[])
                )

                target_ns_link = (
                    f"/proc/{container_pid}/ns/pid"
                )

            except Exception:
                continue

            # -----------------------------------
            # Process metrics
            # -----------------------------------

            process_count = 0
            zombie_process_count = 0
            thread_count = 0

            top_cpu_process = None
            top_cpu_percent = -1

            top_memory_process = None
            top_memory_usage = -1

            orphan_process_count = 0

            # -----------------------------------
            # Iterate system processes
            # -----------------------------------

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

                    # Compare PID namespace
                    proc_ns = (
                        f"/proc/{proc_pid}/ns/pid"
                    )

                    if not (
                        psutil.os.path.exists(proc_ns)
                    ):
                        continue

                    if (
                        psutil.os.readlink(proc_ns)
                        !=
                        psutil.os.readlink(target_ns_link)
                    ):
                        continue

                    process_count += 1

                    # -----------------------------------
                    # Zombie processes
                    # -----------------------------------

                    if (
                        proc.info["status"]
                        == psutil.STATUS_ZOMBIE
                    ):

                        zombie_process_count += 1

                    # -----------------------------------
                    # Threads
                    # -----------------------------------

                    thread_count += (
                        proc.info["num_threads"] or 0
                    )

                    # -----------------------------------
                    # Top CPU process
                    # -----------------------------------

                    cpu_percent = (
                        proc.info["cpu_percent"] or 0
                    )

                    if cpu_percent > top_cpu_percent:

                        top_cpu_percent = cpu_percent

                        top_cpu_process = {
                            "pid": proc_pid,
                            "name": proc.info["name"],
                            "cpu_percent": cpu_percent
                        }

                    # -----------------------------------
                    # Top memory process
                    # -----------------------------------

                    memory_usage = (
                        proc.info["memory_info"].rss
                        if proc.info["memory_info"]
                        else 0
                    )

                    if memory_usage > top_memory_usage:

                        top_memory_usage = memory_usage

                        top_memory_process = {
                            "pid": proc_pid,
                            "name": proc.info["name"],
                            "memory_usage": memory_usage
                        }

                    # -----------------------------------
                    # Orphan processes
                    # -----------------------------------

                    if proc.info["ppid"] == 1:
                        orphan_process_count += 1

                except Exception:
                    continue

            # -----------------------------------
            # Final metrics
            # -----------------------------------

            container_metrics.append({

                "container_id": container_id,
                "container_name": container_name,

                # Process metrics
                "process_count": process_count,

                # Zombie processes
                "zombie_process_count":
                    zombie_process_count,

                # Threads
                "thread_count": thread_count,

                # Top CPU process
                "top_cpu_process": top_cpu_process,

                # Top memory process
                "top_memory_process":
                    top_memory_process,

                # Orphans
                "orphan_process_count":
                    orphan_process_count,
            })

        except Exception:
            continue

    return container_metrics


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