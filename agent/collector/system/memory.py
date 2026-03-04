# agent/collector/system/memory.py

import psutil
import time


BYTES_TO_GB = 1024 ** 3  # 1 GB in bytes


async def collect_memory(event_bus):
    """
    Collect Memory (RAM + Swap) related metrics and publish them to the event bus.

    Converts byte-based values into GB for readability.
    """

    # Virtual memory stats
    virtual_mem = psutil.virtual_memory()

    # Swap memory stats
    swap_mem = psutil.swap_memory()

    # bytes to GB (rounded to 2 decimals)
    def to_gb(value):
        return round(value / BYTES_TO_GB, 2) if value is not None else None

    event = {
        "timestamp": time.time(),
        "type": "memory_metrics",
        "data": {

            #  RAM 
            "total_memory_gb": to_gb(virtual_mem.total),
            "available_memory_gb": to_gb(virtual_mem.available),
            "memory_usage_percent": virtual_mem.percent,
            "cached_memory_gb": to_gb(getattr(virtual_mem, "cached", None)),
            "active_memory_gb": to_gb(getattr(virtual_mem, "active", None)),
            "inactive_memory_gb": to_gb(getattr(virtual_mem, "inactive", None)),

            #  Swap Metrics (GB) 
            "swap_total_gb": to_gb(swap_mem.total),
            "swap_used_gb": to_gb(swap_mem.used),
            "swap_usage_percent": swap_mem.percent,
            "swap_in_gb": to_gb(swap_mem.sin),
            "swap_out_gb": to_gb(swap_mem.sout),

            # Major Page Faults (placeholder for now) 
            "major_page_faults": None,
        }
    }

    print(f"Memory Data collected")

    await event_bus.publish(event)