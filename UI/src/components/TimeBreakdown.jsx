import React from 'react';

const timeBreakdownData = [
  { label: 'User', percentage: 65.2, color: 'bg-blue-500' },
  { label: 'System', percentage: 25.8, color: 'bg-blue-300' },
  { label: 'I/O Wait', percentage: 9.0, color: 'bg-orange-500' },
];

export default function TimeBreakdown() {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
        Time Breakdown
      </h3>
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-center flex-1">
        <div className="flex h-4 w-full rounded-full overflow-hidden mb-6">
          <div
            className="bg-blue-500"
            style={{ width: '65.2%' }}
            title="User"
          ></div>
          <div
            className="bg-blue-300"
            style={{ width: '25.8%' }}
            title="System"
          ></div>
          <div
            className="bg-orange-500"
            style={{ width: '9.0%' }}
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
              <span className="font-bold text-slate-100">{item.percentage}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
