import React from 'react';
import { useMetrics } from '../../context/MetricsContext';

export default function PerCoreUsage() {
  const { cpuMetrics } = useMetrics();
  const perCore = cpuMetrics?.data?.per_core_usage ?? [];
  const coreData = perCore.map((usage, i) => ({
    id: i + 1,
    name: `Core ${String(i + 1).padStart(2, '0')}`,
    usage: typeof usage === 'number' ? Math.round(usage) : 0,
  }));

  return (
    <section>
      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
        Per-Core Usage
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {coreData.map((core) => (
          <div
            key={core.id}
            className="bg-slate-900 border border-slate-800 rounded-lg p-3"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-semibold text-slate-400">
                {core.name}
              </span>
              <span
                className={`text-xs font-bold ${
                  core.usage > 75
                    ? 'text-red-500'
                    : core.usage > 50
                    ? 'text-yellow-500'
                    : 'text-blue-400'
                }`}
              >
                {core.usage}%
              </span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  core.usage > 75
                    ? 'bg-red-500'
                    : core.usage > 50
                    ? 'bg-yellow-500'
                    : 'bg-blue-500'
                }`}
                style={{ width: `${core.usage}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
