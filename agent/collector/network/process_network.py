import psutil


def get_process_network_usage():
    """
    Returns:
    - connections_per_process (detailed)
    - network_process_list (summary)
    """

    connections = psutil.net_connections()

    connections_per_process = {}

    for conn in connections:

        pid = conn.pid

        if pid is None:
            continue

        try:
            proc = psutil.Process(pid)
            name = proc.name()
        except (psutil.NoSuchProcess, psutil.AccessDenied):
            continue

        # initialize process 
        if pid not in connections_per_process:
            connections_per_process[pid] = {
                "pid": pid,
                "name": name,
                "connections": []
            }

        # skip if no local address
        if not conn.laddr:
            continue

        connections_per_process[pid]["connections"].append({
            "port": conn.laddr.port,
            "status": conn.status
        })

    # this part is derivedfrom connection list --------
    network_process_list = [
        {
            "pid": data["pid"],
            "name": data["name"]
        }
        for data in connections_per_process.values()
    ]

    return {
        "connections_per_process": connections_per_process,
        "network_process_list": network_process_list
    }