------------------------------------------------------------
NETWORK METRICS CATEGORIZATION
------------------------------------------------------------
------------------------------------------------------------
1. THROUGHPUT (Network Traffic Volume)
------------------------------------------------------------

Purpose
Measure how much data is moving through the server.

Submetrics

bytes_sent
source: psutil

bytes_received
source: psutil

packets_sent
source: psutil

packets_received
source: psutil

send_rate_bytes_per_sec
source: derived (difference between two psutil samples)

receive_rate_bytes_per_sec
source: derived

send_rate_packets_per_sec
source: derived

receive_rate_packets_per_sec
source: derived

bandwidth_utilization_percent
source: derived (requires interface speed)

Why important

Detect traffic spikes

Detect data exfiltration

AI anomaly detection

------------------------------------------------------------
2. CONNECTION METRICS
------------------------------------------------------------

Purpose
Measure how many network connections the server is handling.

Submetrics

total_connections
source: psutil (net_connections)

tcp_connections
source: psutil

udp_connections
source: psutil

established_connections
source: psutil

listening_sockets
source: psutil

time_wait_connections
source: psutil

connection_rate
source: derived (new connections per interval)

failed_connections
source: manual (requires log analysis)

Why important

Detect connection floods

Detect service overload

Detect brute force attacks

------------------------------------------------------------
3. INTERFACE METRICS
------------------------------------------------------------

Purpose
Monitor health and performance of network interfaces.

Submetrics

interface_status (UP / DOWN)
source: psutil (net_if_stats)

interface_speed_mbps
source: psutil

mtu
source: psutil

interface_bytes_sent
source: psutil (per interface)

interface_bytes_received
source: psutil

interface_packets_sent
source: psutil

interface_packets_received
source: psutil

interface_utilization_percent
source: derived

Why important

Detect failing network interfaces

Detect bandwidth saturation

------------------------------------------------------------
4. ERROR AND DROP METRICS
------------------------------------------------------------

Purpose
Detect network reliability issues.

Submetrics

packet_errors_in
source: psutil

packet_errors_out
source: psutil

packet_drops_in
source: psutil

packet_drops_out
source: psutil

error_rate
source: derived

drop_rate
source: derived

Why important

Detect hardware issues

Detect congestion

Detect driver problems

------------------------------------------------------------
5. PORT ACTIVITY
------------------------------------------------------------

Purpose
Understand which ports are active and heavily used.

Submetrics

open_ports
source: psutil (net_connections)

connections_per_port
source: psutil

top_active_ports
source: derived

port_connection_rate
source: derived

Why important

Detect unusual services

Detect port scanning

------------------------------------------------------------
6. PROCESS NETWORK USAGE
------------------------------------------------------------

Purpose
Identify which processes use network resources.

Submetrics

connections_per_process
source: psutil

network_process_list
source: psutil

top_processes_by_connections
source: derived

top_processes_by_bandwidth
source: manual (requires additional tracking)

Why important

Detect suspicious processes

Detect runaway applications

Useful for AI anomaly detection

------------------------------------------------------------
7. LATENCY AND CONNECTIVITY (Optional but Valuable)
------------------------------------------------------------

Purpose
Measure network responsiveness.

Submetrics

average_latency_ms
source: manual (ping or socket test)

packet_round_trip_time
source: manual

connection_handshake_time
source: manual

Why important

Detect network congestion

Detect routing issues




1. implementing each metrics 
- we dont need separate event queue as it can handle 1000+events/second
- neither we need another scheduler
- hence the architecture will remain same
2. on completion connect the websocket server as subscriber (event queue will be same so)
3. you can create metric + ui or first all metric then their UIs
