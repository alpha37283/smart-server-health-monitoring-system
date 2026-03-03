# core/scheduler.py

import asyncio


class Scheduler:
    """
    Scheduler runs given async tasks at fixed intervals.

    For now, it runs a single collector every 3 seconds.
    """

    def __init__(self, interval=3):
        self.interval = interval  # seconds

    async def run(self, task_function, event_bus):
        """
        Repeatedly execute the given task function
        every `interval` seconds.

        task_function must be async and accept event_bus.
        """

        while True:
            try:
                # Run the collector
                await task_function(event_bus)

            except Exception as e:
                print(f"[Scheduler Error] {e}")

            # Wait for next cycle
            await asyncio.sleep(self.interval)