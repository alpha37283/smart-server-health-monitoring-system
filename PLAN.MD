

keep in mind that not all metrics need to be run each second specifically the network_latency_metric.py


There are bugs in UI of network/Connections page fix them.
=======================================================================================

# Container Metrics Collection Plan (Refined)

---

# container_runtime.py

## Purpose
Collect overall container runtime state and lifecycle overview.

## Metrics

```json
{
  "total_containers": {
    "purpose": "Total detected containers",
    "method": "Docker SDK"
  },
  "running_containers": {
    "purpose": "Currently running containers",
    "method": "Docker SDK"
  },
  "stopped_containers": {
    "purpose": "Stopped containers",
    "method": "Docker SDK"
  },
  "paused_containers": {
    "purpose": "Paused containers",
    "method": "Docker SDK"
  },
  "restarting_containers": {
    "purpose": "Containers currently restarting",
    "method": "Docker SDK"
  },
  "dead_containers": {
    "purpose": "Dead/unresponsive containers",
    "method": "Docker SDK"
  },
  "container_runtime_status": {
    "purpose": "Runtime daemon health state",
    "method": "Docker SDK / systemctl"
  },
  "docker_daemon_uptime": {
    "purpose": "Container runtime uptime",
    "method": "Manual implementation"
  },
  "runtime_version": {
    "purpose": "Docker/container runtime version",
    "method": "Docker SDK"
  }
}
```

---

# container_resource.py

## Purpose
Track per-container resource usage.

## Metrics

```json
{
  "container_cpu_percent": {
    "purpose": "CPU usage per container",
    "method": "Docker SDK"
  },
  "container_memory_usage": {
    "purpose": "RAM used by container",
    "method": "Docker SDK"
  },
  "container_memory_limit": {
    "purpose": "Assigned memory limit",
    "method": "Docker SDK"
  },
  "container_memory_percent": {
    "purpose": "Memory utilization percentage",
    "method": "Manual calculation"
  },
  "container_swap_usage": {
    "purpose": "Swap memory usage",
    "method": "Docker SDK"
  },
  "container_pids": {
    "purpose": "Total processes inside container",
    "method": "Docker SDK"
  },
  "container_blk_read_bytes": {
    "purpose": "Disk read activity",
    "method": "Docker SDK"
  },
  "container_blk_write_bytes": {
    "purpose": "Disk write activity",
    "method": "Docker SDK"
  },
  "container_io_rate": {
    "purpose": "Disk IO throughput rate",
    "method": "Manual delta calculation"
  },
  "cpu_throttling_events": {
    "purpose": "CPU throttling occurrences",
    "method": "cgroup files"
  },
  "cpu_throttled_time": {
    "purpose": "Time CPU remained throttled",
    "method": "cgroup files"
  },
  "container_fd_count": {
    "purpose": "Open file descriptors",
    "method": "/proc manual implementation"
  }
}
```

---

# container_network.py

## Purpose
Track container networking activity and traffic visibility.

## Metrics

```json
{
  "container_rx_bytes": {
    "purpose": "Incoming network traffic",
    "method": "Docker SDK"
  },
  "container_tx_bytes": {
    "purpose": "Outgoing network traffic",
    "method": "Docker SDK"
  },
  "container_rx_packets": {
    "purpose": "Incoming packets",
    "method": "Docker SDK"
  },
  "container_tx_packets": {
    "purpose": "Outgoing packets",
    "method": "Docker SDK"
  },
  "container_rx_errors": {
    "purpose": "Receive-side network errors",
    "method": "Docker SDK"
  },
  "container_tx_errors": {
    "purpose": "Transmit-side network errors",
    "method": "Docker SDK"
  },
  "active_container_connections": {
    "purpose": "Current active network connections",
    "method": "psutil + namespace mapping"
  },
  "container_open_ports": {
    "purpose": "Listening/exposed ports",
    "method": "Docker SDK"
  },
  "public_exposed_ports": {
    "purpose": "Ports exposed publicly",
    "method": "Docker SDK"
  },
  "network_bandwidth_rate": {
    "purpose": "Traffic transfer rate/sec",
    "method": "Manual delta calculation"
  }
}
```

---

# container_process.py

## Purpose
Track process behavior inside containers.

## Metrics

```json
{
  "process_count": {
    "purpose": "Total running processes",
    "method": "Docker SDK"
  },
  "zombie_process_count": {
    "purpose": "Zombie processes inside container",
    "method": "psutil"
  },
  "thread_count": {
    "purpose": "Total active threads",
    "method": "psutil"
  },
  "top_cpu_process": {
    "purpose": "Highest CPU consuming process",
    "method": "psutil"
  },
  "top_memory_process": {
    "purpose": "Highest memory consuming process",
    "method": "psutil"
  },
  "fork_rate": {
    "purpose": "Rate of process creation",
    "method": "Manual interval diff"
  },
  "orphan_process_count": {
    "purpose": "Detached/orphan processes",
    "method": "psutil"
  },
  "shell_spawn_count": {
    "purpose": "Interactive shell spawns",
    "method": "Manual process inspection"
  },
  "exec_command_count": {
    "purpose": "docker exec activity",
    "method": "Docker Events API"
  }
}
```

---

# container_health.py

## Purpose
Track container lifecycle stability and operational health.

## Metrics

```json
{
  "healthy_containers": {
    "purpose": "Containers passing health checks",
    "method": "Docker SDK"
  },
  "unhealthy_containers": {
    "purpose": "Containers failing health checks",
    "method": "Docker SDK"
  },
  "restarting_loop_count": {
    "purpose": "Containers stuck in restart loops",
    "method": "Docker SDK"
  },
  "container_uptime": {
    "purpose": "Container runtime duration",
    "method": "Docker SDK"
  },
  "container_restart_count": {
    "purpose": "Container restart frequency",
    "method": "Docker SDK"
  },
  "oom_kill_count": {
    "purpose": "Out-of-memory terminations",
    "method": "Docker Events API"
  },
  "failed_health_checks": {
    "purpose": "Health check failures",
    "method": "Docker SDK"
  },
  "container_exit_codes": {
    "purpose": "Container exit status tracking",
    "method": "Docker SDK"
  }
}
```

---

# container_image.py

## Purpose
Track container image inventory and storage usage.

## Metrics

```json
{
  "total_images": {
    "purpose": "Total images present",
    "method": "Docker SDK"
  },
  "dangling_images": {
    "purpose": "Unused images",
    "method": "Docker SDK"
  },
  "image_size_bytes": {
    "purpose": "Storage size consumed by images",
    "method": "Docker SDK"
  },
  "image_pull_frequency": {
    "purpose": "Frequency of image downloads",
    "method": "Docker Events API"
  },
  "image_age_days": {
    "purpose": "Image age tracking",
    "method": "Manual timestamp calculation"
  },
  "duplicate_image_count": {
    "purpose": "Duplicate/redundant images",
    "method": "Manual grouping"
  },
  "latest_tag_usage": {
    "purpose": "Usage of latest tags",
    "method": "Manual inspection"
  }
}
```

---

# container_volume.py

## Purpose
Track persistent storage usage and mounted volumes.

## Metrics

```json
{
  "total_volumes": {
    "purpose": "Total mounted volumes",
    "method": "Docker SDK"
  },
  "unused_volumes": {
    "purpose": "Orphan/unused volumes",
    "method": "Docker SDK"
  },
  "volume_read_bytes": {
    "purpose": "Volume read throughput",
    "method": "Filesystem stats"
  },
  "volume_write_bytes": {
    "purpose": "Volume write throughput",
    "method": "Filesystem stats"
  },
  "volume_usage_percent": {
    "purpose": "Storage utilization percentage",
    "method": "psutil"
  },
  "high_growth_volumes": {
    "purpose": "Rapidly growing storage",
    "method": "Manual delta calculation"
  },
  "volume_mount_count": {
    "purpose": "Total mounted volumes per container",
    "method": "Docker SDK"
  },
  "deleted_open_files": {
    "purpose": "Hidden disk consumption",
    "method": "lsof/manual implementation"
  }
}
```

---

# container_events.py

## Purpose
Track container runtime events and lifecycle actions.

## Metrics

```json
{
  "container_start_events": {
    "purpose": "Container startup events",
    "method": "Docker Events API"
  },
  "container_stop_events": {
    "purpose": "Container stop events",
    "method": "Docker Events API"
  },
  "container_kill_events": {
    "purpose": "Forced kill events",
    "method": "Docker Events API"
  },
  "container_restart_events": {
    "purpose": "Restart events",
    "method": "Docker Events API"
  },
  "container_exec_events": {
    "purpose": "docker exec activity",
    "method": "Docker Events API"
  },
  "image_pull_events": {
    "purpose": "Image pull events",
    "method": "Docker Events API"
  },
  "attach_events": {
    "purpose": "Interactive attach events",
    "method": "Docker Events API"
  },
  "detach_events": {
    "purpose": "Detach session events",
    "method": "Docker Events API"
  },
  "event_rate": {
    "purpose": "Event frequency per interval",
    "method": "Manual interval counting"
  }
}
```

---

# container_namespace.py

## Purpose
Track namespace isolation visibility.

## Metrics

```json
{
  "pid_namespace_count": {
    "purpose": "PID namespace tracking",
    "method": "/proc inspection"
  },
  "network_namespace_count": {
    "purpose": "Network namespace tracking",
    "method": "/proc inspection"
  },
  "mount_namespace_count": {
    "purpose": "Mount namespace tracking",
    "method": "/proc inspection"
  },
  "shared_namespace_containers": {
    "purpose": "Containers sharing namespaces",
    "method": "Manual comparison"
  },
  "host_network_mode_count": {
    "purpose": "Containers using host networking",
    "method": "Docker SDK"
  }
}
```

---

# container_security.py

## Purpose
Track container security posture and risky configurations.

## Metrics

```json
{
  "privileged_containers": {
    "purpose": "Containers running in privileged mode",
    "method": "Docker SDK"
  },
  "root_user_containers": {
    "purpose": "Containers running as root",
    "method": "Docker SDK"
  },
  "dangerous_capabilities": {
    "purpose": "High-risk Linux capabilities",
    "method": "Docker inspect"
  },
  "seccomp_disabled_count": {
    "purpose": "Containers without seccomp",
    "method": "Docker inspect"
  },
  "apparmor_disabled_count": {
    "purpose": "Containers without AppArmor",
    "method": "Docker inspect"
  },
  "selinux_disabled_count": {
    "purpose": "Containers without SELinux",
    "method": "Docker inspect"
  },
  "writable_rootfs_count": {
    "purpose": "Writable root filesystem containers",
    "method": "Docker inspect"
  },
  "host_pid_namespace_usage": {
    "purpose": "Containers sharing host PID namespace",
    "method": "Docker inspect"
  },
  "host_network_usage": {
    "purpose": "Containers using host networking",
    "method": "Docker inspect"
  },
  "sensitive_mount_count": {
    "purpose": "Sensitive host path mounts",
    "method": "Docker inspect"
  },
  "docker_socket_mount_count": {
    "purpose": "Mounted Docker socket detection",
    "method": "Docker inspect"
  }
}
```

======================= Plan =====================

To make current metric collection compatible with River, we will add another subscriber, and in that subscriber we will filter the metrics, making suitable for River. 

### A. River vs current metric collectors (compatibility)

**What you have today:** Each collector builds a JSON event `{ "timestamp", "type", "data" }` and publishes to the shared `EventBus` (see `agent/main.py`). Values are mostly **scalars and small dicts** (CPU %, connection counts, per-interface maps, process lists). Some fields are **cumulative** (e.g. `bytes_sent`), some are **already rates** (e.g. `read_mb_s`), and some are **interval-dependent** (deltas in `disk.py`, `traffic.py`, `errors_drop.py`) or **first-call null/None** (warm-up windows, optional sysfs/log paths).

**Verdict: compatible**, with an explicit **feature layer** between raw events and River:

| Concern | Why it still works | What to do |
|--------|----------------------|------------|
| Mixed semantic types | River models expect **fixed-size numeric vectors** per step, not arbitrary JSON. | Add a small **normalizer** that maps each `type` → a chosen list of floats (or one model per family, e.g. `cpu_metrics` only). |
| Counters vs rates | Cumulative counters are bad for many online models unless you **difference** them consistently. | Prefer feeding **already-rate fields** from collectors, or compute Δ/second in the feature step (same time base as scheduler). |
| Nested structures | e.g. `interfaces` map, `top_cpu_processes` list. | **Flatten or aggregate**: e.g. sum/max per snapshot, or top-k slots, or skip lists for v1 and score only **scalar summaries**. |
| Missing / `None` | River still needs numbers. | Replace with **sentinel** (e.g. 0 or previous value) and optionally a binary **“missing”** flag feature. |
| Different cadences | Latency collector is intentionally slower; scheduler runs others ~frequently. | Run River on a **timer** (e.g. 1s or 5s) that **consumes last-known snapshot** per type, or subscribe per-type with decimation. |
| High cardinality | Full `connections_per_process` is huge. | Do not feed raw PID maps into one vector; use **aggregates** (count, max connections per process, etc.) or separate optional “heavy” analysis later. |

**Bottom line:** The algorithms in `agent/collector/system` and `agent/collector/network` are **not incompatible** with River; they are **inputs**. The work is **feature design + one consistent sampling strategy**, not rewriting collectors (unless you want cleaner rates everywhere).

---

### B. Plan: integrating River into this project

**Goal:** Keep collectors dumb (measure → publish). Add an **analysis path** that reads events and emits **scores / flags / optional explanations** without blocking collectors.

1. **Placement (recommended)**  
   - **Option 1 (minimal):** New package `agent/analytics/` or `core/river_pipeline.py` with an async task subscribed to `EventBus` (same pattern as WebSocket subscriber).  
   - **Option 2 (scale-out):** Separate process that subscribes via Redis/NATS later; skip until you need multi-host.

2. **Data flow**  
   - Collectors → `EventBus` → (existing) WebSocket fan-out **unchanged**.  
   - Same bus → **River consumer**: maintains **last value cache** keyed by `type`, builds feature vector on a fixed tick or on each selected event.  
   - Output: new events e.g. `{ "type": "anomaly_metrics", "data": { "scores": {...}, "series": "cpu" } }` so the UI can subscribe without touching collector code.

3. **Model scope (phased)**  
   - **Phase 1:** One River model per **simple series**: `cpu_metrics` (usage + load), `memory_metrics`, `disk_metrics` (usage + rw rates), `network_error_metrics` (error/drop rates). Use **online anomaly / drift-friendly** pieces (e.g. adaptive windows, half-space trees, or robust z-score via rolling stats—River documents several patterns).  
   - **Phase 2:** Multivariate **mini-vectors** (CPU + mem + disk IO) for a single “host stress” score.  
   - **Phase 3:** Optional LLM layer **only on alert** (not per tick).

4. **Operational rules**  
   - Do **not** run heavy River work at the same 0.8s rate for **all** types; **batch** or **sample** (e.g. 1 Hz for scoring).  
   - Persist **minimal** state (River’s internal state + last features) if you restart the agent—otherwise cold start again.

5. **UI**  
   - Extend WebSocket contract with `anomaly_metrics` (or merge into existing dashboard payloads). Start with **one badge / sparkline** before full charts.

---

### C. More collectors — categories (mirror `system/` layout)

Use **one subdirectory per domain**, each file = one publishable concern + one primary `type`, same as `cpu.py` / `connection.py`.

| New folder under `agent/collector/` | Purpose | Example files (each → related metrics) |
|-------------------------------------|---------|----------------------------------------|
| **`container/`** | Docker/Podman workload visibility | `docker_stats.py` — CPU/mem per container, restarts, network mode summary. |
| **`host_extended/`** or split clearly | Beyond psutil basics | `thermal.py` — temps/fans if sysfs; `power.py` if laptop/ACPI; `gpu.py` — NVIDIA/AMD utilization (optional deps). |
| **`security/`** | Lightweight security signals | `auth_failures.py` — SSH/journal counts (rate-limited); `listening_ports_delta.py` — change detection vs previous snapshot. |
| **`http/`** | Synthetic / service probes | `endpoint_health.py` — latency, status code, TLS expiry from probe targets (config file). |
| **`logs/`** (careful) | Aggregates only, not full log shipping | `journal_errors.py` — error line rate per interval from journal/syslog tail position (same idea as connection log scrape but structured). |

**Rules for new files (same as system/network):**  
- One **async** `collect_* (event_bus)` per file.  
- Single **`type`** string per event; **`data`** flat where possible for later River features.  
- Document **interval** in code or shared config (some collectors **must not** run every 0.8s—e.g. HTTP probes, journal scrape, GPU APIs).  
- Register in `agent/main.py` with `scheduler.run(..., interval=...)` if you extend the scheduler, or a separate `asyncio.sleep` loop per collector.

---

### D. Guide: adding a new collector (checklist)

1. Create `agent/collector/<category>/<name>.py` with `collect_<name>(event_bus)`.  
2. Build `event = { "timestamp", "type", "data" }`; keep **`data` numeric-friendly** for River (avoid huge raw lists in v1).  
3. `await event_bus.publish(event)` once per tick.  
4. Wire in `agent/main.py` (import + `create_task`).  
5. If the UI should show it: add handling in `streaming/` / WebSocket bridge and a hook in React (`useMetricsWebSocket` pattern).  
6. For River: add **feature mapping** for this `type` in the analytics module when you want it scored.

This keeps **collection**, **transport**, and **ML** decoupled so River can roll out incrementally without rewriting existing collectors.
