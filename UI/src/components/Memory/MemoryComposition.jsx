import React from 'react';
import { useMetrics } from '../../context/MetricsContext';

function fmtGb(v) {
  if (v == null || typeof v !== 'number') return '—';
  return `${v} GB`;
}

export default function MemoryComposition() {
  const { memoryMetrics } = useMetrics();
  const d = memoryMetrics?.data ?? {};
  const total = d.total_memory_gb ?? 1;
  const active = d.active_memory_gb ?? 0;
  const cached = d.cached_memory_gb ?? 0;
  const inactive = d.inactive_memory_gb ?? 0;
  const available = d.available_memory_gb ?? 0;
  const composition = [
    { label: 'ACTIVE', value: fmtGb(active), color: 'bg-blue-600', percentage: total > 0 ? Math.round((active / total) * 100) : 0 },
    { label: 'CACHED', value: fmtGb(cached), color: 'bg-blue-500', percentage: total > 0 ? Math.round((cached / total) * 100) : 0 },
    { label: 'INACTIVE', value: fmtGb(inactive), color: 'bg-blue-400', percentage: total > 0 ? Math.round((inactive / total) * 100) : 0 },
    { label: 'AVAILABLE', value: fmtGb(available), color: 'bg-blue-300', percentage: total > 0 ? Math.round((available / total) * 100) : 0 },
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
