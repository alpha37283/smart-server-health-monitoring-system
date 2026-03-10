import { useState, useEffect, useRef } from 'react';

const MAX_BUFFER = 120;

function getWsUrl() {
  const host = import.meta.env.VITE_WS_HOST || window.location.hostname;
  const port = import.meta.env.VITE_WS_PORT || '8000';
  return `ws://${host}:${port}/ws/metrics/system`;
}

export function useMetricsWebSocket() {
  const [cpuMetrics, setCpuMetrics] = useState(null);
  const [memoryMetrics, setMemoryMetrics] = useState(null);
  const [diskMetrics, setDiskMetrics] = useState(null);
  const [processMetrics, setProcessMetrics] = useState(null);
  const [cpuHistory, setCpuHistory] = useState([]);
  const [load1mHistory, setLoad1mHistory] = useState([]);
  const [load5mHistory, setLoad5mHistory] = useState([]);
  const [load15mHistory, setLoad15mHistory] = useState([]);
  const [memoryHistory, setMemoryHistory] = useState([]);
  const [swapInHistory, setSwapInHistory] = useState([]);
  const [swapOutHistory, setSwapOutHistory] = useState([]);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState(null);

  const indexRef = useRef(0);
  const memIndexRef = useRef(0);
  const memPrevRef = useRef({ swapInGb: null, swapOutGb: null, timestamp: null });
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const reconnectAttemptRef = useRef(0);

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

    connect();
    return () => {
      mounted = false;
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      if (wsRef.current) wsRef.current.close();
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
    connected,
    error,
  };
}
