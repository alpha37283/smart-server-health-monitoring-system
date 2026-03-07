import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';

const data = [
  { time: '30m ago', value: 18 },
  { time: '25m ago', value: 22 },
  { time: '20m ago', value: 28 },
  { time: '15m ago', value: 32 },
  { time: '10m ago', value: 35 },
  { time: '5m ago', value: 38 },
  { time: 'Now', value: 24.8 },
];

export default function CPUChart() {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white p-2 rounded shadow-xl border border-slate-700/50">
          <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
            {payload[0].payload.time}
          </div>
          <div className="flex items-center gap-2">
            <div className="size-2 rounded-full bg-blue-500"></div>
            <div className="text-xs font-bold">
              {payload[0].value}%
              <span className="font-normal opacity-60 ml-1">
                {payload[0].payload.time}
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
        <span className="text-4xl font-bold text-blue-400">24.8%</span>
        <span className="text-slate-400 text-sm">avg. load over last 30 mins</span>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorCPU" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis
              dataKey="time"
              stroke="#64748b"
              style={{ fontSize: '12px' }}
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
