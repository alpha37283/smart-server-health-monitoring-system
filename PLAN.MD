

keep in mind that not all metrics need to be run each second specifically the network_latency_metric.py


There are bugs in UI of network/Connections page fix them.




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

==================================================