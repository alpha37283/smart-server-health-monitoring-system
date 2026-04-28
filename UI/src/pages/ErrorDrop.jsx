import React from 'react';
import ErrorDropBreakdown from '../components/ErrorDrop/ErrorDropBreakdown';
import ErrorDropMetricCard from '../components/ErrorDrop/ErrorDropMetricCard';
import ErrorDropTrends from '../components/ErrorDrop/ErrorDropTrends';
import RecentIncidentsTable from '../components/ErrorDrop/RecentIncidentsTable';

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

export default function ErrorDrop() {
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
            {metricCards.map((card) => (
              <ErrorDropMetricCard
                key={card.label}
                label={card.label}
                value={card.value}
                unit={card.unit}
                trend={card.trend}
                trendColor={card.trendColor}
                trendIcon={card.trendIcon}
                borderColor={card.borderColor}
              />
            ))}
          </div>

          {/* Row 2: Breakdown Metrics */}
          <div className="mb-6">
            <ErrorDropBreakdown />
          </div>

          {/* Row 3: Trends Chart */}
          <div className="mb-6">
            <ErrorDropTrends />
          </div>

          {/* Row 4: Recent Incidents Table */}
          <RecentIncidentsTable />
        </div>
      </div>
    </div>
  );
}