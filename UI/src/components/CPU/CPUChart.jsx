import React from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, } from 'recharts';
import { useMetrics } from '../../context/MetricsContext';

function formatTimeAgo(timestamp) {
  if (!timestamp) return '—';
  const mins = Math.floor((Date.now() - timestamp) / 60000);
  if (mins === 0) return 'Now';
  if (mins < 60) return `${mins}m ago`;
  return `${Math.floor(mins / 60)}h ago`;
}

export default function CPUChart() {
  const { cpuMetrics, cpuHistory } = useMetrics();
  const currentUsage = cpuMetrics?.data?.cpu_usage ?? 0;
  const chartData = cpuHistory.length > 0 ? cpuHistory : [{ index: 0, value: 0 }];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const timeLabel = formatTimeAgo(payload[0].payload.timestamp);
      return (
        <div className="bg-slate-900 text-white p-2 rounded shadow-xl border border-slate-700/50">
          <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
            {timeLabel}
          </div>
          <div className="flex items-center gap-2">
            <div className="size-2 rounded-full bg-blue-500"></div>
            <div className="text-xs font-bold">
              {payload[0].value}%
              <span className="font-normal opacity-60 ml-1">
                {timeLabel}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
      <div className="flex items-baseline gap-2 mb-6">
        <span className="text-4xl font-bold text-blue-400">{typeof currentUsage === 'number' ? currentUsage.toFixed(1) : '0'}%</span>
        <span className="text-slate-400 text-sm">avg. load over last 30 mins</span>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorCPU" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis
              dataKey="index"
              stroke="#64748b"
              tick={false}
              axisLine={{ stroke: '#64748b' }}
            />
            <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#3b82f6"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorCPU)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-between mt-4 text-[10px] uppercase font-bold text-slate-400 tracking-widest">
        <span>30m ago</span>
        <span>20m ago</span>
        <span>10m ago</span>
        <span>Now</span>
      </div>
    </div>
  );
}
