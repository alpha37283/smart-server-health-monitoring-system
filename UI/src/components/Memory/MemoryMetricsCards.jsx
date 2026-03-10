import React from 'react';
import { useMetrics } from '../../context/MetricsContext';

function fmtGb(v) {
  if (v == null || typeof v !== 'number') return '—';
  return `${v} GB`;
}

export default function MemoryMetricsCards() {
  const { memoryMetrics } = useMetrics();
  const d = memoryMetrics?.data ?? {};
  const metrics = [
    { label: 'Total RAM', value: fmtGb(d.total_memory_gb), color: 'text-slate-300' },
    { label: 'Available RAM', value: fmtGb(d.available_memory_gb), color: 'text-slate-300' },
    { label: 'Swap Total', value: fmtGb(d.swap_total_gb), color: 'text-slate-300' },
    { label: 'Swap Used', value: fmtGb(d.swap_used_gb), color: 'text-blue-400' },
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
