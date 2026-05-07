# agent/collector/security/kernel_security.py

import time
import asyncio
import subprocess

_last_timestamp = None


def get_kernel_security_metrics():
    global _last_timestamp

    counts = {
        "segfault_interval": 0,
        "oom_kill_interval": 0,
        "disk_io_error_interval": 0,
        "permission_denied_kernel_interval": 0,
        "kernel_panic_interval": 0,
        "watchdog_timeout_interval": 0,
        "hardware_error_interval": 0,
        "module_load_interval": 0,
        "usb_device_event_interval": 0,
    }

    cmd = ["journalctl", "-k", "--no-pager", "--output=short-unix"]

    if _last_timestamp:
        cmd.extend(["--since", _last_timestamp])

    try:
        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            timeout=5,
        )

        lines = result.stdout.splitlines()

    except Exception:
        return counts

    for line in lines:
        lower = line.lower()

        # segfaults
        if "segfault" in lower or "general protection fault" in lower:
            counts["segfault_interval"] += 1

        # oom killer
        elif (
            "out of memory" in lower
            or "oom-killer" in lower
            or "killed process" in lower
        ):
            counts["oom_kill_interval"] += 1

        # disk / filesystem errors
        elif (
            "i/o error" in lower
            or "buffer i/o error" in lower
            or "ext4-fs error" in lower
        ):
            counts["disk_io_error_interval"] += 1

        # permission denials
        elif (
            'apparmor="denied"' in lower
            or "audit: denied" in lower
            or "avc: denied" in lower
        ):
            counts["permission_denied_kernel_interval"] += 1

        # kernel panic
        elif "kernel panic" in lower:
            counts["kernel_panic_interval"] += 1

        # watchdog / lockups
        elif (
            "watchdog" in lower
            or "soft lockup" in lower
            or "hard lockup" in lower
        ):
            counts["watchdog_timeout_interval"] += 1

        # hardware errors
        elif (
            "hardware error" in lower
            or "mce" in lower
            or "thermal shutdown" in lower
        ):
            counts["hardware_error_interval"] += 1

        # kernel modules
        elif (
            "module loaded" in lower
            or "loading kernel module" in lower
        ):
            counts["module_load_interval"] += 1

        # usb activity
        elif (
            "new usb device" in lower
            or "usb disconnect" in lower
        ):
            counts["usb_device_event_interval"] += 1

    _last_timestamp = "now"

    return counts


async def collect_kernel_security(event_bus):
    data = await asyncio.to_thread(get_kernel_security_metrics)

    event = {
        "timestamp": time.time(),
        "type": "security_kernel_metrics",
        "data": data,
    }

    print("Kernel security data collected : ", event)

    await event_bus.publish(event)