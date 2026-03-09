import React from 'react';
import { useMetrics } from '../context/MetricsContext';

export default function TimeBreakdown() {
  const { cpuMetrics } = useMetrics();
  const d = cpuMetrics?.data ?? {};
  const user = typeof d.user_time === 'number' ? d.user_time : 0;
  const system = typeof d.system_time === 'number' ? d.system_time : 0;
  const iowait = typeof d.io_wait === 'number' ? d.io_wait : 0;
  const timeBreakdownData = [
    { label: 'User', percentage: user, color: 'bg-blue-500' },
    { label: 'System', percentage: system, color: 'bg-blue-300' },
    { label: 'I/O Wait', percentage: iowait, color: 'bg-orange-500' },
  ];

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
        Time Breakdown
      </h3>
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-center flex-1">
        <div className="flex h-4 w-full rounded-full overflow-hidden mb-6">
          <div
            className="bg-blue-500"
            style={{ width: `${user}%` }}
            title="User"
          ></div>
          <div
            className="bg-blue-300"
            style={{ width: `${system}%` }}
            title="System"
          ></div>
          <div
            className="bg-orange-500"
            style={{ width: `${iowait}%` }}
            title="I/O Wait"
          ></div>
        </div>

        <div className="space-y-3">
          {timeBreakdownData.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className={`size-2 rounded-full ${item.color}`}></div>
                <span className="text-slate-400">{item.label}</span>
              </div>
              <span className="font-bold text-slate-100">{typeof item.percentage === 'number' ? item.percentage.toFixed(1) : '0'}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
