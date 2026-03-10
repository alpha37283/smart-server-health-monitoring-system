import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useMetrics } from '../../context/MetricsContext';

export default function MemoryUsageChart({ timeRange, setTimeRange }) {
  const { memoryMetrics, memoryHistory } = useMetrics();
  const currentPercent = memoryMetrics?.data?.memory_usage_percent ?? 0;
  const chartData = memoryHistory.length > 0 ? memoryHistory : [{ index: 0, value: 0 }];

  return (
    <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
      <div className="flex justify-between items-end mb-6">
        <div className="flex flex-col gap-1">
          <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider">
            Memory Usage (%) - Last 30 Minutes
          </h3>
          <div className="flex items-center gap-3">
            <span className="text-4xl font-bold text-white">{typeof currentPercent === 'number' ? currentPercent.toFixed(1) : '0'}%</span>
          </div>
        </div>
        <div className="flex gap-2">
          {['Live', '1h', '24h'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 text-xs font-semibold rounded transition-colors ${
                timeRange === range
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 30 }}>
            <defs>
              <linearGradient id="memoryGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis
              dataKey="index"
              stroke="#94a3b8"
              tick={false}
              axisLine={{ stroke: '#94a3b8' }}
            />
            <YAxis
              stroke="#94a3b8"
              domain={[0, 100]}
              style={{ fontSize: '12px' }}
              tick={{ fill: '#94a3b8' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                border: '1px solid #475569',
                borderRadius: '8px',
              }}
              labelStyle={{ color: '#e2e8f0' }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#3b82f6"
              fill="url(#memoryGradient)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
