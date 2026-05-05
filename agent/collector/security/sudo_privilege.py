# agent/collector/security/sudo_privilege.py
# auth.log -> read new lines -> keyword match -> increment counters -> publish event


import os
import time
import asyncio

_log_positions = {}

AUTH_LOG_PATHS = (
    "/var/log/auth.log",
    "/var/log/secure",
)


def _resolve_auth_log_path():
    for path in AUTH_LOG_PATHS:
        if os.path.isfile(path) and os.access(path, os.R_OK):
            return path
    return None


def _seed_eof_if_new(path):
    if path not in _log_positions:
        try:
            _log_positions[path] = os.path.getsize(path)
        except OSError:
            _log_positions[path] = 0


def get_sudo_privilege_interval_counts():
    counts = {
        "sudo_auth_failure_interval": 0,
        "sudo_command_denied_interval": 0,
        "su_failure_interval": 0,
        "sudo_success_interval": 0,
        "su_success_interval": 0,
        "privileged_command_execution_interval": 0,
    }

    path = _resolve_auth_log_path()
    if path is None:
        return counts

    _seed_eof_if_new(path)

    last_pos = _log_positions.get(path, 0)
    try:
        file_size = os.path.getsize(path)
    except OSError:
        file_size = 0

    if last_pos > file_size:
        last_pos = 0

    try:
        with open(path, "r", errors="ignore") as f:
            f.seek(last_pos)

            for line in f:
                lower = line.lower()

                # sudo failures
                if "sudo" in lower and "authentication failure" in lower:
                    counts["sudo_auth_failure_interval"] += 1

                elif "not in sudoers" in lower or "command not allowed" in lower:
                    counts["sudo_command_denied_interval"] += 1

                # su failures
                elif "su:" in lower and "authentication failure" in lower:
                    counts["su_failure_interval"] += 1

                # sudo success
                elif "sudo:" in lower and "session opened" in lower:
                    counts["sudo_success_interval"] += 1

                # su success
                elif "su:" in lower and "session opened" in lower:
                    counts["su_success_interval"] += 1

                # command execution via sudo
                elif "sudo:" in lower and "command=" in lower:
                    counts["privileged_command_execution_interval"] += 1

            _log_positions[path] = f.tell()

    except (OSError, PermissionError, UnicodeDecodeError):
        pass

    return counts


async def collect_sudo_privilege(event_bus):
    data = await asyncio.to_thread(get_sudo_privilege_interval_counts)

    event = {
        "timestamp": time.time(),
        "type": "security_privilege_metrics",
        "data": data,
    }

    print("Sudo privilege security data collected : ", event)

    await event_bus.publish(event)