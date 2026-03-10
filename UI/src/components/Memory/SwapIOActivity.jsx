import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useMetrics } from '../../context/MetricsContext';

export default function SwapIOActivity() {
  const { swapInHistory, swapOutHistory } = useMetrics();
  const len = Math.min(swapInHistory.length, swapOutHistory.length);
  const data = len > 0
    ? swapInHistory.slice(0, len).map((p, i) => ({
        index: p.index,
        swapIn: p.value,
        swapOut: swapOutHistory[i]?.value ?? 0,
      }))
    : [{ index: 0, swapIn: 0, swapOut: 0 }];

  return (
    <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider">
          Swap I/O Activity (GB/s)
        </h3>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="h-0.5 w-4 bg-blue-500" />
            <span className="text-xs font-medium text-slate-300">Swap In</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-0.5 w-4 bg-slate-500" />
            <span className="text-xs font-medium text-slate-300">Swap Out</span>
          </div>
        </div>
      </div>

      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 30 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis
              dataKey="index"
              stroke="#94a3b8"
              tick={false}
              axisLine={{ stroke: '#94a3b8' }}
            />
            <YAxis
              stroke="#94a3b8"
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
            <Line
              type="monotone"
              dataKey="swapIn"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={false}
              name="Swap In"
            />
            <Line
              type="monotone"
              dataKey="swapOut"
              stroke="#94a3b8"
              strokeWidth={1.5}
              strokeDasharray="4"
              dot={false}
              name="Swap Out"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
