import React from 'react';
import CPUChart from '../components/CPU/CPUChart';
import PerCoreUsage from '../components/CPU/PerCoreUsage';
import LoadAverage from '../components/CPU/LoadAverage';
import TimeBreakdown from '../components/CPU/TimeBreakdown';
import DetailedMetrics from '../components/CPU/DetailedMetrics';

export default function CPU({ timeRange, setTimeRange }) {
  return (
    <div className="p-8 space-y-6">
      {/* CPU Usage Over Time */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">CPU Usage Dashboard</h2>
          <div className="flex gap-2">
            {['Live', '1h', '24h'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 text-xs font-medium rounded transition-colors ${timeRange === range
                    ? 'bg-primary/20 text-primary'
                    : 'hover:bg-slate-800'
                  }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
        <CPUChart />
      </section>

      {/* Per-Core Usage */}
      <PerCoreUsage />

      {/* Load Average + Time Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <LoadAverage />
        </div>
        <TimeBreakdown />
      </div>

      {/* Detailed Metrics */}
      <DetailedMetrics />
    </div>
  );
}
