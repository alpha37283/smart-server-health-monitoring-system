import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export default function SwapUsageGauge() {
  const percentage = 26;
  const data = [
    { name: 'Used', value: percentage },
    { name: 'Available', value: 100 - percentage },
  ];

  return (
    <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 flex flex-col items-center">
      <h3 className="w-full text-slate-400 text-sm font-medium uppercase tracking-wider mb-8 text-left">
        Swap Usage (%)
      </h3>

      <div className="flex flex-col items-center gap-4">
        <div className="h-48 w-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                startAngle={90}
                endAngle={-270}
                dataKey="value"
              >
                <Cell fill="#3b82f6" />
                <Cell fill="#334155" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="text-center">
          <span className="text-4xl font-bold text-white">{percentage}%</span>
          <div className="text-slate-400 text-xs font-semibold uppercase mt-1">of 8GB</div>
        </div>
      </div>

      <div className="mt-8 flex justify-between w-full text-xs font-medium text-slate-400">
        <span>0%</span>
        <span className="text-blue-400 font-bold">Optimal</span>
        <span>100%</span>
      </div>
    </div>
  );
}
