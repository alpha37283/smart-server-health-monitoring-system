# agent/collector/security/session_users.py

import time
import asyncio
import psutil

_prev_sessions = set()


def _is_remote_host(host):
    if not host:
        return False

    host = host.strip().lower()

    local_hosts = {
        "localhost",
        "127.0.0.1",
        "::1",
    }

    return host not in local_hosts


def get_session_user_metrics():
    global _prev_sessions

    counts = {
        "interactive_sessions": 0,
        "distinct_users": 0,
        "remote_sessions": 0,
        "local_sessions": 0,
        "root_sessions": 0,
        "ssh_sessions": 0,
        "new_sessions_interval": 0,
        "terminated_sessions_interval": 0,
    }

    current_sessions = set()
    distinct_users = set()

    try:
        users = psutil.users()
    except Exception:
        return counts

    for user in users:
        username = user.name
        terminal = user.terminal or ""
        host = user.host or ""

        session_id = (username, terminal, host)
        current_sessions.add(session_id)

        distinct_users.add(username)

        counts["interactive_sessions"] += 1

        is_remote = _is_remote_host(host)

        # remote vs local
        if is_remote:
            counts["remote_sessions"] += 1
        else:
            counts["local_sessions"] += 1

        # root sessions
        if username == "root":
            counts["root_sessions"] += 1

        # ssh sessions
        if is_remote:
            counts["ssh_sessions"] += 1

    counts["distinct_users"] = len(distinct_users)

    # interval session tracking
    new_sessions = current_sessions - _prev_sessions
    terminated_sessions = _prev_sessions - current_sessions

    counts["new_sessions_interval"] = len(new_sessions)
    counts["terminated_sessions_interval"] = len(terminated_sessions)

    _prev_sessions = current_sessions

    return counts


async def collect_session_users(event_bus):
    data = await asyncio.to_thread(get_session_user_metrics)

    event = {
        "timestamp": time.time(),
        "type": "security_session_metrics",
        "data": data,
    }

    print("Session user security data collected : ", event)

    await event_bus.publish(event)