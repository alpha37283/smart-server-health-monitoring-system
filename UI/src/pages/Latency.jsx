import React, { useMemo } from 'react';
import { useMetrics } from '../context/MetricsContext';
import LatencyMetricCard from '../components/Latency/LatencyMetricCard';
import LatencyTable from '../components/Latency/LatencyTable';
import LatencyTrends from '../components/Latency/LatencyTrends';

function formatMs(v) {
  if (v == null || !Number.isFinite(v)) return '—';
  return Number(v).toFixed(1);
}

function buildTableRows(data) {
  if (!data?.latency_per_target) return null;
  const lp = data.latency_per_target;
  const hp = data.handshake_per_target || {};
  const icons = ['public', 'cloud', 'dns'];
  return Object.entries(lp).map(([host, info], idx) => {
    const hInfo = hp[host];
    const lat = info.latency_ms;
    const handshake = hInfo?.handshake_ms;
    const healthy = info.status === 'healthy' && lat != null;
    const status = healthy ? 'HEALTHY' : 'UNREACHABLE';
    return {
      name: info.name || host,
      ip: host,
      icon: icons[idx % icons.length],
      latency: lat != null ? `${Number(lat).toFixed(1)}ms` : '--',
      latencyColor: healthy ? 'text-emerald-500' : 'text-red-500',
      handshake: handshake != null ? `${Math.round(handshake)}ms` : '--',
      status,
      statusColor:
        status === 'HEALTHY' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-red-500/20 text-red-500',
    };
  });
}

export default function Latency() {
  const { networkLatencyMetrics, latencyAvgHistory, latencyHandshakeHistory } = useMetrics();
  const d = networkLatencyMetrics?.data ?? {};
  const tableRows = useMemo(() => buildTableRows(d), [d]);

  return (
    <div className="flex-1 overflow-y-auto bg-[#101622]">
      <div className="p-8 min-h-[calc(100vh-64px)] overflow-y-auto">
        <div className="max-w-[1400px] mx-auto space-y-6">
          <div className="grid grid-cols-4 gap-6">
            <LatencyMetricCard
              label="Average Latency"
              value={formatMs(d.average_latency_ms)}
              unit="MS"
              trend="LIVE"
              trendColor="text-emerald-500"
              trendIcon="sync"
              borderColor="border-[#256af4]"
            />
            <LatencyMetricCard
              label="Min Latency"
              value={formatMs(d.min_latency_ms)}
              unit="MS"
              trend="LIVE"
              trendColor="text-slate-500"
              trendIcon="horizontal_rule"
              borderColor="border-emerald-500"
            />
            <LatencyMetricCard
              label="Max Latency"
              value={formatMs(d.max_latency_ms)}
              unit="MS"
              trend="LIVE"
              trendColor="text-red-500"
              trendIcon="trending_up"
              borderColor="border-red-500"
            />
            <LatencyMetricCard
              label="Avg Handshake Time"
              value={formatMs(d.connection_handshake_time)}
              unit="MS"
              trend="LIVE"
              trendColor="text-amber-500"
              trendIcon="schedule"
              borderColor="border-amber-500"
            />
          </div>

          <LatencyTable rows={tableRows} />

          <LatencyTrends
            avgHistory={latencyAvgHistory}
            handshakeHistory={latencyHandshakeHistory}
          />
        </div>
      </div>
    </div>
  );
}
