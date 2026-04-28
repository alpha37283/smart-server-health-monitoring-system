import React from 'react';
import ErrorDropBreakdown from '../components/ErrorDrop/ErrorDropBreakdown';
import ErrorDropMetricCard from '../components/ErrorDrop/ErrorDropMetricCard';
import ErrorDropTrends from '../components/ErrorDrop/ErrorDropTrends';
import RecentIncidentsTable from '../components/ErrorDrop/RecentIncidentsTable';
import { useMetrics } from '../context/MetricsContext';

const metricCards = [
  {
    label: 'Total Packet Loss',
    value: '0.02',
    unit: '%',
    trend: '+12% FROM PREVIOUS HOUR',
    trendColor: 'text-red-500',
    trendIcon: 'trending_up',
    borderColor: 'border-red-500',
  },
  {
    label: 'Healthy Packets',
    value: '99.98',
    unit: '%',
    trend: 'WITHIN OPTIMAL RANGE',
    trendColor: 'text-emerald-500',
    trendIcon: 'check_circle',
    borderColor: 'border-[#256af4]',
  },
  {
    label: 'RX Errors',
    value: '1,402',
    unit: '',
    trend: 'DEGRADED PERFORMANCE',
    trendColor: 'text-amber-500',
    trendIcon: 'warning',
    borderColor: 'border-amber-500',
  },
  {
    label: 'TX Drops',
    value: '12',
    unit: '',
    trend: 'STABLE MARGIN',
    trendColor: 'text-slate-500',
    trendIcon: 'video_stable',
    borderColor: 'border-slate-700',
  },
];

function fmt(n, digits = 2) {
  if (n == null || !Number.isFinite(n)) return '0';
  return Number(n).toFixed(digits);
}

export default function ErrorDrop() {
  const { networkErrorMetrics, networkErrorHistory } = useMetrics();
  const d = networkErrorMetrics?.data ?? {};
  const totalPacketLoss = (Number(d.error_rate || 0) + Number(d.drop_rate || 0)).toFixed(2);
  const healthyPct = Math.max(0, 100 - Number(totalPacketLoss)).toFixed(2);
  return (
    <div className="flex-1 overflow-y-auto bg-[#101622]">
      <div className="p-8 min-h-[calc(100vh-64px)] overflow-y-auto">
        <div className="max-w-[1400px] mx-auto">
          {/* Error & Drop Monitoring Page */}
          {/* Header Section */}
          <div className="flex justify-between items-end mb-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-100">Network Error & Drop Monitoring</h1>
              <p className="text-slate-400 text-sm mt-1 uppercase tracking-widest font-medium">Interface: ETH0 / Active Protocol: IPv4</p>
            </div>
            <div className="flex gap-2">
              <button className="bg-[#1a2332] border border-slate-700 px-4 py-2 text-xs font-bold text-slate-300 hover:bg-[#252d3d] transition-colors flex items-center gap-2 rounded">
                <span className="material-symbols-outlined text-base">refresh</span>
                REFRESH
              </button>
            </div>
          </div>

          {/* Row 1: Summary Cards */}
          <div className="grid grid-cols-4 gap-6 mb-6">
            {metricCards.map((card) => {
              const dynamicCard =
                card.label === 'Total Packet Loss'
                  ? { ...card, value: totalPacketLoss, trend: 'LIVE RATE' }
                  : card.label === 'Healthy Packets'
                    ? { ...card, value: healthyPct, trend: 'LIVE RATE' }
                    : card.label === 'RX Errors'
                      ? { ...card, value: fmt(d.packet_errors_in_per_sec), trend: 'PER SECOND' }
                      : card.label === 'TX Drops'
                        ? { ...card, value: fmt(d.packet_drops_out_per_sec), trend: 'PER SECOND' }
                        : card;
              return (
              <ErrorDropMetricCard
                key={card.label}
                label={dynamicCard.label}
                value={dynamicCard.value}
                unit={dynamicCard.unit}
                trend={dynamicCard.trend}
                trendColor={dynamicCard.trendColor}
                trendIcon={dynamicCard.trendIcon}
                borderColor={dynamicCard.borderColor}
              />
              );
            })}
          </div>

          {/* Row 2: Breakdown Metrics */}
          <div className="mb-6">
            <ErrorDropBreakdown
              rxErrors={d.packet_errors_in_per_sec || 0}
              rxDrops={d.packet_drops_in_per_sec || 0}
              txErrors={d.packet_errors_out_per_sec || 0}
              txDrops={d.packet_drops_out_per_sec || 0}
            />
          </div>

          {/* Row 3: Trends Chart */}
          <div className="mb-6">
            <ErrorDropTrends history={networkErrorHistory} />
          </div>

          {/* Row 4: Recent Incidents Table */}
          <RecentIncidentsTable />
        </div>
      </div>
    </div>
  );
}