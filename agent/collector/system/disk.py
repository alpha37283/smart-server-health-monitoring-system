# agent/collector/system/disk.py

import psutil
import time


BYTES_TO_GB = 1024 ** 3


async def collect_disk(event_bus):
    """
    Collect Disk-related metrics and publish them to the event bus.

    This function:
    1. Reads disk usage and IO stats
    2. Calculates disk read/write speeds
    3. Calculates disk utilization (delta-based)
    4. Builds structured event
    5. Publishes to event bus
    """

    
    # Disk Space (Root Partition)
    disk_usage = psutil.disk_usage("/")

    def to_gb(value):
        ret_val = round(value / BYTES_TO_GB, 2)
        return ret_val


    
    # Disk IO Stats (Cumulative Since Boot)
    io = psutil.disk_io_counters()
    current_time = time.time()

    
    # Initialize state (first run)
    if not hasattr(collect_disk, "_prev_io"):
        collect_disk._prev_io = io
        collect_disk._prev_time = current_time

        read_speed = 0
        write_speed = 0
        utilization_percent = 0

    else:
        # Time difference
        time_diff = current_time - collect_disk._prev_time

        # Prevent division by zero
        if time_diff <= 0:
            time_diff = 0.000001

        # Speed Calculation (delta bytes / delta time)

        read_speed = (io.read_bytes - collect_disk._prev_io.read_bytes) / time_diff
        write_speed = (io.write_bytes - collect_disk._prev_io.write_bytes) / time_diff



        # Disk Utilization (delta busy time)

        if hasattr(io, "busy_time") and hasattr(collect_disk._prev_io, "busy_time"):
            busy_diff = io.busy_time - collect_disk._prev_io.busy_time
            utilization_percent = round((busy_diff / 1000) / time_diff * 100, 2)
        else:
            utilization_percent = None

        # Update previous state AFTER calculations
        collect_disk._prev_io = io
        collect_disk._prev_time = current_time

    
    # Convert speeds to MB/s
    read_speed_mb = round(read_speed / (1024 ** 2), 2)
    write_speed_mb = round(write_speed / (1024 ** 2), 2)

    
    # Queue Length (Approximation)
    queue_length = None
    if hasattr(io, "read_merged_count"):
        queue_length = getattr(io, "read_merged_count", None)

    
    # Build Event
    event = {
        "timestamp": current_time,
        "type": "disk_metrics",
        "data": {

            # Disk Space (GB)
            "total_disk_gb": to_gb(disk_usage.total),
            "used_disk_gb": to_gb(disk_usage.used),
            "free_disk_gb": to_gb(disk_usage.free),
            "disk_usage_percent": disk_usage.percent,

            # IO Counters (Converted to MB/s instead of cumulative GB)
            "read_mb_s": read_speed_mb,
            "write_mb_s": write_speed_mb,
            "read_count": io.read_count,
            "write_count": io.write_count,

            # Speeds (MB/s)
            "disk_read_speed_mb_s": read_speed_mb,
            "disk_write_speed_mb_s": write_speed_mb,

            # Advanced Metrics
            "disk_utilization_percent": utilization_percent,
            "queue_length": queue_length,
        }
    }

    print(f"Disk Data Collected")

    await event_bus.publish(event)