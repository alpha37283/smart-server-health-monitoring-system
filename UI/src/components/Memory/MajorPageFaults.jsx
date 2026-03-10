import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AlertCircle } from 'lucide-react';

const data = [
  { time: '0m', faults: 8 },
  { time: '5m', faults: 6 },
  { time: '10m', faults: 9 },
  { time: '15m', faults: 15 },
  { time: '20m', faults: 12 },
  { time: '25m', faults: 10 },
  { time: '30m', faults: 18 },
];

export default function MajorPageFaults() {
  return (
    <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
      <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-6">
        Major Page Faults
      </h3>

      <div className="flex items-center gap-4 mb-4">
        <span className="text-4xl font-bold text-white">12</span>
        <span className="text-slate-400 text-sm font-medium">per sec (avg)</span>
      </div>

      <div className="h-40 w-full mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 30 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis
              dataKey="time"
              stroke="#94a3b8"
              style={{ fontSize: '12px' }}
              tick={{ fill: '#94a3b8' }}
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
              dataKey="faults"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Warning Alert */}
      <div className="p-3 bg-amber-500/10 rounded-lg border border-amber-500/30 flex items-start gap-3">
        <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">
          Slight pressure detected due to process spikes.
        </p>
      </div>
    </div>
  );
}
