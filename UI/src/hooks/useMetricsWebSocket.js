import { useState, useEffect, useRef } from 'react';

const MAX_BUFFER = 120;

function getWsUrl() {
  const host = import.meta.env.VITE_WS_HOST || window.location.hostname;
  const port = import.meta.env.VITE_WS_PORT || '8000';
  return `ws://${host}:${port}/ws/metrics/system`;
}

function getNetworkWsUrl() {
  const host = import.meta.env.VITE_WS_HOST || window.location.hostname;
  const port = import.meta.env.VITE_WS_PORT || '8000';
  return `ws://${host}:${port}/ws/metrics/network`;
}

export function useMetricsWebSocket() {
  const [cpuMetrics, setCpuMetrics] = useState(null);
  const [memoryMetrics, setMemoryMetrics] = useState(null);
  const [diskMetrics, setDiskMetrics] = useState(null);
  const [diskTransferHistory, setDiskTransferHistory] = useState([]);
  const [diskIoHistory, setDiskIoHistory] = useState([]);
  const [diskQueueHistory, setDiskQueueHistory] = useState([]);
  const [processMetrics, setProcessMetrics] = useState(null);
  const [cpuHistory, setCpuHistory] = useState([]);
  const [load1mHistory, setLoad1mHistory] = useState([]);
  const [load5mHistory, setLoad5mHistory] = useState([]);
  const [load15mHistory, setLoad15mHistory] = useState([]);
  const [memoryHistory, setMemoryHistory] = useState([]);
  const [swapInHistory, setSwapInHistory] = useState([]);
  const [swapOutHistory, setSwapOutHistory] = useState([]);
  const [networkConnectionMetrics, setNetworkConnectionMetrics] = useState(null);
  const [networkErrorMetrics, setNetworkErrorMetrics] = useState(null);
  const [connectionTrendsHistory, setConnectionTrendsHistory] = useState([]);
  const [activityAndFailuresHistory, setActivityAndFailuresHistory] = useState([]);
  const [connected, setConnected] = useState(false);
  const [networkConnected, setNetworkConnected] = useState(false);
  const [error, setError] = useState(null);

  const indexRef = useRef(0);
  const memIndexRef = useRef(0);
  const memPrevRef = useRef({ swapInGb: null, swapOutGb: null, timestamp: null });
  const diskPrevRef = useRef({ readCount: null, writeCount: null, timestamp: null });
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const reconnectAttemptRef = useRef(0);

  const wsNetRef = useRef(null);
  const reconnectNetTimeoutRef = useRef(null);
  const reconnectNetAttemptRef = useRef(0);

  useEffect(() => {
    const url = getWsUrl();
    let mounted = true;

    function connect() {
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        if (mounted) {
          setConnected(true);
          setError(null);
          reconnectAttemptRef.current = 0;
        }
      };

      ws.onmessage = (ev) => {
        if (!mounted) return;
        try {
          const event = JSON.parse(ev.data);
          const { type, data } = event;
          if (!data) return;

          switch (type) {
            case 'cpu_metrics':
              setCpuMetrics(event);
              if (data.cpu_usage != null && typeof data.cpu_usage === 'number') {
                const now = Date.now();
                setCpuHistory((prev) => {
                  const next = [...prev.slice(-(MAX_BUFFER - 1)), { timestamp: now, value: data.cpu_usage }];
                  return next.map((p, i) => ({ ...p, index: i }));
                });
              }
              if (data.load_avg) {
                const i = indexRef.current++;
                if (data.load_avg['1m'] != null) {
                  setLoad1mHistory((prev) => [...prev.slice(-(MAX_BUFFER - 1)), { x: i, y: data.load_avg['1m'] }]);
                }
                if (data.load_avg['5m'] != null) {
                  setLoad5mHistory((prev) => [...prev.slice(-(MAX_BUFFER - 1)), { x: i, y: data.load_avg['5m'] }]);
                }
                if (data.load_avg['15m'] != null) {
                  setLoad15mHistory((prev) => [...prev.slice(-(MAX_BUFFER - 1)), { x: i, y: data.load_avg['15m'] }]);
                }
              }
              break;
            case 'memory_metrics':
              setMemoryMetrics(event);
              if (data.memory_usage_percent != null && typeof data.memory_usage_percent === 'number') {
                const now = Date.now();
                setMemoryHistory((prev) => {
                  const next = [...prev.slice(-(MAX_BUFFER - 1)), { timestamp: now, value: data.memory_usage_percent }];
                  return next.map((p, i) => ({ ...p, index: i }));
                });
              }
              if (data.swap_in_gb != null && data.swap_out_gb != null) {
                const now = Date.now();
                const prev = memPrevRef.current;
                if (prev.timestamp != null && prev.swapInGb != null && prev.swapOutGb != null) {
                  const dt = (now - prev.timestamp) / 1000;
                  if (dt > 0) {
                    const rateIn = (data.swap_in_gb - prev.swapInGb) / dt;
                    const rateOut = (data.swap_out_gb - prev.swapOutGb) / dt;
                    const i = memIndexRef.current++;
                    setSwapInHistory((p) => [...p.slice(-(MAX_BUFFER - 1)), { index: i, value: Math.max(0, rateIn) }]);
                    setSwapOutHistory((p) => [...p.slice(-(MAX_BUFFER - 1)), { index: i, value: Math.max(0, rateOut) }]);
                  }
                }
                memPrevRef.current = { swapInGb: data.swap_in_gb, swapOutGb: data.swap_out_gb, timestamp: now };
              }
              break;
            case 'disk_metrics':
              setDiskMetrics(event);
              if (data.disk_read_speed_mb_s != null && data.disk_write_speed_mb_s != null) {
                const now = new Date();
                const timeStr = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
                setDiskTransferHistory((p) => [...p.slice(-(MAX_BUFFER - 1)), { time: timeStr, readSpeed: data.disk_read_speed_mb_s, writeSpeed: data.disk_write_speed_mb_s }]);
              }
              if (data.queue_length != null) {
                const now = new Date();
                const timeStr = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
                setDiskQueueHistory((p) => [...p.slice(-(MAX_BUFFER - 1)), { time: timeStr, waits: data.queue_length }]);
              }
              if (data.read_count != null && data.write_count != null) {
                const now = Date.now();
                const timeStr = new Date(now).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
                const prev = diskPrevRef.current;
                if (prev.timestamp != null && prev.readCount != null && prev.writeCount != null) {
                  const dt = (now - prev.timestamp) / 1000;
                  if (dt > 0) {
                    const rOps = Math.max(0, (data.read_count - prev.readCount) / dt);
                    const wOps = Math.max(0, (data.write_count - prev.writeCount) / dt);
                    setDiskIoHistory((p) => [...p.slice(-(MAX_BUFFER - 1)), { time: timeStr, readOps: Math.round(rOps), writeOps: Math.round(wOps) }]);
                  }
                }
                diskPrevRef.current = { readCount: data.read_count, writeCount: data.write_count, timestamp: now };
              }
              break;
            case 'process_metrics':
              setProcessMetrics(event);
              break;
            default:
              break;
          }
        } catch (e) {
          console.warn('[Metrics] Parse error:', e);
        }
      };

      ws.onclose = () => {
        if (mounted) setConnected(false);
        if (!mounted) return;
        const delay = Math.min(1000 * Math.pow(2, reconnectAttemptRef.current), 30000);
        reconnectAttemptRef.current += 1;
        reconnectTimeoutRef.current = setTimeout(connect, delay);
      };

      ws.onerror = () => {
        if (mounted) setError('WebSocket error');
      };
    }

    function connectNetwork() {
      const wsNet = new WebSocket(getNetworkWsUrl());
      wsNetRef.current = wsNet;

      wsNet.onopen = () => {
        if (mounted) {
          setNetworkConnected(true);
          reconnectNetAttemptRef.current = 0;
        }
      };

      wsNet.onmessage = (ev) => {
        if (!mounted) return;
        try {
          const event = JSON.parse(ev.data);
          const { type, data } = event;
          if (!data) return;

          switch (type) {
            case 'network_connection_metrics':
              setNetworkConnectionMetrics(event);
              if (data.total_connections != null) {
                const now = new Date();
                const timeStr = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
                
                setConnectionTrendsHistory((p) => [...p.slice(-(MAX_BUFFER - 1)), {
                  time: timeStr,
                  total: data.total_connections,
                  tcp: data.tcp_connections,
                  udp: data.udp_connections
                }]);
                
                setActivityAndFailuresHistory((p) => {
                  const last = p.length > 0 ? p[p.length - 1] : { failureRate: 0 };
                  const fRate = data.failed_connections_second?.failed_attempts || last.failureRate || 0;
                  return [...p.slice(-(MAX_BUFFER - 1)), {
                    time: timeStr,
                    connectionRate: data.connection_rate || 0,
                    failureRate: fRate
                  }];
                });
              }
              break;
            case 'network_error_metrics':
              setNetworkErrorMetrics(event);
              if (data.drop_rate != null || data.error_rate != null) {
                setActivityAndFailuresHistory((p) => {
                  if (p.length === 0) return p;
                  const newP = [...p];
                  const last = newP[newP.length - 1];
                  // Update the last entry with actual drop/error rate if it acts as failure rate
                  const failureRate = data.drop_rate + data.error_rate;
                  newP[newP.length - 1] = { ...last, failureRate: failureRate };
                  return newP;
                });
              }
              break;
            default:
              break;
          }
        } catch (e) {
          console.warn('[Metrics] Network Parse error:', e);
        }
      };

      wsNet.onclose = () => {
        if (mounted) setNetworkConnected(false);
        if (!mounted) return;
        const delay = Math.min(1000 * Math.pow(2, reconnectNetAttemptRef.current), 30000);
        reconnectNetAttemptRef.current += 1;
        reconnectNetTimeoutRef.current = setTimeout(connectNetwork, delay);
      };

      wsNet.onerror = () => {
        // Handle error silently or update state
      };
    }

    connect();
    connectNetwork();
    
    return () => {
      mounted = false;
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      if (reconnectNetTimeoutRef.current) clearTimeout(reconnectNetTimeoutRef.current);
      if (wsRef.current) wsRef.current.close();
      if (wsNetRef.current) wsNetRef.current.close();
    };
  }, []);

  return {
    cpuMetrics,
    memoryMetrics,
    diskMetrics,
    processMetrics,
    cpuHistory,
    load1mHistory,
    load5mHistory,
    load15mHistory,
    memoryHistory,
    swapInHistory,
    swapOutHistory,
    diskTransferHistory,
    diskIoHistory,
    diskQueueHistory,
    networkConnectionMetrics,
    networkErrorMetrics,
    connectionTrendsHistory,
    activityAndFailuresHistory,
    connected,
    networkConnected,
    error,
  };
}
