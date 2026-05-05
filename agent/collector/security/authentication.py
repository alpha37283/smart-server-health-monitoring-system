# agent/collector/security/authentication.py

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
    """First time we see a file, tail from EOF so we do not replay history."""
    if path not in _log_positions:
        try:
            _log_positions[path] = os.path.getsize(path)
        except OSError:
            _log_positions[path] = 0


def get_authentication_interval_counts():
    """
    Read new lines appended to the auth log since the last call and classify them.

    Returns counts for the current interval only (since last read position).
    """
    counts = {
        "failed_password_count_interval": 0,
        "invalid_user_count_interval": 0,
        "connection_closed_preauth_interval": 0,
        "successful_logins_interval": 0,
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
                if "failed password for invalid user" in lower:
                    counts["invalid_user_count_interval"] += 1
                    counts["failed_password_count_interval"] += 1
                elif "failed password" in lower:
                    counts["failed_password_count_interval"] += 1
                elif "connection closed by" in lower and "preauth" in lower:
                    counts["connection_closed_preauth_interval"] += 1
                elif (
                    "accepted password" in lower
                    or "accepted publickey" in lower
                    or "accepted keyboard-interactive" in lower
                ):
                    counts["successful_logins_interval"] += 1

            _log_positions[path] = f.tell()
    except (OSError, PermissionError, UnicodeDecodeError):
        pass

    return counts


async def collect_authentication(event_bus):
    """
    Collect SSH / PAM authentication signals from the auth log and publish to the event bus.
    """

    data = await asyncio.to_thread(get_authentication_interval_counts)

    event = {
        "timestamp": time.time(),
        "type": "security_authentication_metrics",
        "data": data,
    }

    print("Authentication security data collected : ", event)

    await event_bus.publish(event)
