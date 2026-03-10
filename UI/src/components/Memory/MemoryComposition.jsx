import React from 'react';

export default function MemoryComposition() {
  const composition = [
    { label: 'ACTIVE', value: '12.2 GB', color: 'bg-blue-600', percentage: 38 },
    { label: 'CACHED', value: '8.0 GB', color: 'bg-blue-500', percentage: 25 },
    { label: 'INACTIVE', value: '4.8 GB', color: 'bg-blue-400', percentage: 15 },
    { label: 'AVAILABLE', value: '7.0 GB', color: 'bg-blue-300', percentage: 22 },
  ];

  return (
    <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
      <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-6">
        Memory Composition (GB)
      </h3>

      <div className="flex flex-col gap-6">
        {/* Stacked Bar */}
        <div className="w-full h-8 bg-slate-800 rounded-lg overflow-hidden flex">
          {composition.map((item, idx) => (
            <div
              key={idx}
              className={`h-full ${item.color} transition-all hover:opacity-80 cursor-pointer`}
              style={{ width: `${item.percentage}%` }}
              title={`${item.label}: ${item.value}`}
            />
          ))}
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {composition.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <div className={`size-3 rounded ${item.color}`} />
              <div className="flex flex-col">
                <span className="text-xs text-slate-400 uppercase font-bold">{item.label}</span>
                <span className="text-sm font-bold text-white">{item.value}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
