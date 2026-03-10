import React from 'react';

export default function MemoryMetricsCards() {
  const metrics = [
    {
      label: 'Total RAM',
      value: '32 GB',
      color: 'text-slate-300',
    },
    {
      label: 'Available RAM',
      value: '12.4 GB',
      color: 'text-slate-300',
    },
    {
      label: 'Swap Total',
      value: '8 GB',
      color: 'text-slate-300',
    },
    {
      label: 'Swap Used',
      value: '2.1 GB',
      color: 'text-blue-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, idx) => (
        <div
          key={idx}
          className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 flex flex-col gap-2"
        >
          <span className="text-slate-400 text-sm font-medium">{metric.label}</span>
          <span className={`text-2xl font-bold ${metric.color}`}>{metric.value}</span>
        </div>
      ))}
    </div>
  );
}
