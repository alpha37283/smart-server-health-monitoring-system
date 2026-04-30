import React from 'react';
import { useMetrics } from '../context/MetricsContext';
import MetricCard from '../components/Traffic/MetricCard';
import ChartCard from '../components/Traffic/ChartCard';
import PacketCard from '../components/Traffic/PacketCard';
import BandwidthCard from '../components/Traffic/BandwidthCard';

const BYTES_PER_GB = 1024 ** 3;
function formatGbFromBytes(bytes) {
  if (bytes == null || !Number.isFinite(bytes)) return '—';
  return (bytes / BYTES_PER_GB).toFixed(2);
}

function formatPacketsTotal(n) {
  if (n == null || !Number.isFinite(n)) return '—';
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}`;
  return String(Math.round(n));
}

function formatPacketsUnit(n) {
  if (n == null || !Number.isFinite(n)) return '';
  if (n >= 1_000_000) return 'M';
  if (n >= 1_000) return 'K';
  return '';
}

function formatPps(pps) {
  if (pps == null || !Number.isFinite(pps)) return '—';
  const safe = Math.min(pps, 1e9);
  return safe.toLocaleString(undefined, { maximumFractionDigits: 0 });
}

function historyToChartPath(history) {
  if (!history || history.length === 0) {
    return 'M0 50 L 400 50';
  }
  const values = history.map((p) => p.value);
  const maxV = Math.max(...values, 1e-9);
  const n = history.length;
  const step = 400 / Math.max(n - 1, 1);
  return history
    .map((p, i) => {
      const x = i * step;
      const y = 100 - (p.value / maxV) * 90 - 5;
      return i === 0 ? `M${x},${y}` : `L${x},${y}`;
    })
    .join(' ');
}

export default function Traffic() {
  const {
    networkTrafficMetrics,
    trafficSendBytesHistory,
    trafficRecvBytesHistory,
    trafficSendPpsHistory,
    trafficRecvPpsHistory,
  } = useMetrics();

  const d = networkTrafficMetrics?.data ?? {};

  const bytesSentGb = formatGbFromBytes(d.bytes_sent);
  const bytesRecvGb = formatGbFromBytes(d.bytes_received);
  const pktSent = d.packets_sent;
  const pktRecv = d.packets_received;

  const sendPps = formatPps(d.send_rate_packets_per_sec);
  const recvPps = formatPps(d.receive_rate_packets_per_sec);

  const pathSendPps = historyToChartPath(trafficSendPpsHistory);
  const pathRecvPps = historyToChartPath(trafficRecvPpsHistory);

  return (
    <div className="flex-1 overflow-y-auto bg-[#101622]">
      <div className="p-8 min-h-[calc(100vh-64px)]">
        <div className="max-w-[1400px] mx-auto space-y-6">
          <div className="flex justify-end">
            <span className="text-[10px] font-mono text-slate-500">SCOPE: HOST_TOTAL</span>
          </div>
          <div className="grid grid-cols-4 gap-6">
            <MetricCard
              label="Bytes Sent"
              value={bytesSentGb}
              unit="GB"
              trend="LIVE"
              trendColor="text-emerald-500"
              trendIcon="check_circle"
            />
            <MetricCard
              label="Bytes Received"
              value={bytesRecvGb}
              unit="GB"
              trend="LIVE"
              trendColor="text-emerald-500"
              trendIcon="check_circle"
            />
            <MetricCard
              label="Packets Sent"
              value={formatPacketsTotal(pktSent)}
              unit={formatPacketsUnit(pktSent) ? `${formatPacketsUnit(pktSent)}` : ''}
              trend="LIVE"
              trendColor="text-emerald-500"
              trendIcon="check_circle"
            />
            <MetricCard
              label="Packets Received"
              value={formatPacketsTotal(pktRecv)}
              unit={formatPacketsUnit(pktRecv) ? `${formatPacketsUnit(pktRecv)}` : ''}
              trend="LIVE"
              trendColor="text-emerald-500"
              trendIcon="check_circle"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <ChartCard
              title="Send Rate (Bytes/sec)"
              rateBytesPerSec={d.send_rate_bytes_per_sec}
              rateHistory={trafficSendBytesHistory}
            />
            <ChartCard
              title="Receive Rate (Bytes/sec)"
              rateBytesPerSec={d.receive_rate_bytes_per_sec}
              rateHistory={trafficRecvBytesHistory}
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <PacketCard
              title="Send Rate (Packets/sec)"
              value={sendPps}
              unit="PPS"
              icon="outbox"
              chartPath={pathSendPps}
            />
            <PacketCard
              title="Receive Rate (Packets/sec)"
              value={recvPps}
              unit="PPS"
              icon="inbox"
              chartPath={pathRecvPps}
            />
          </div>

          <BandwidthCard utilizationPercent={d.bandwidth_utilization_percent} />
        </div>
      </div>
    </div>
  );
}
