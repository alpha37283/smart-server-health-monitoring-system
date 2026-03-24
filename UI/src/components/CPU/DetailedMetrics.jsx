import React from 'react';
import { Repeat2, Zap } from 'lucide-react';
import { useMetrics } from '../context/MetricsContext';

function formatNumber(n) {
  if (n == null || typeof n !== 'number') return '—';
  return n.toLocaleString();
}

export default function DetailedMetrics() {
  const { cpuMetrics } = useMetrics();
  const d = cpuMetrics?.data ?? {};
  const contextSwitches = d.context_switches;
  const frequencyMhz = d.frequency_mhz;

  const metricsData = [
    {
      title: 'Context Switches',
      value: formatNumber(contextSwitches),
      unit: '',
      icon: Repeat2,
      color: 'text-blue-400',
    },
    {
      title: 'CPU Frequency',
      value: frequencyMhz != null ? String(Math.round(frequencyMhz)) : '—',
      unit: 'MHz',
      icon: Zap,
      color: 'text-blue-400',
    },
  ];

  const detailedMetricsData = [
    { label: 'Interrupt Handling', value: 'N/A' },
    { label: 'Exception Handling', value: 'N/A' },
    { label: 'System Calls', value: 'N/A' },
    { label: 'Thermal Throttling', value: 'N/A' },
  ];

  return (
    <section>
      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
        Detailed Metrics
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {metricsData.map((metric, idx) => {
          const Icon = metric.icon;
          return (
            <div
              key={idx}
              className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex items-center gap-5"
            >
              <div className="size-12 rounded-lg bg-blue-600/10 flex items-center justify-center">
                <Icon size={24} className={metric.color} />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-tight">
                  {metric.title}
                </div>
                <div className="text-2xl font-bold text-slate-100">
                  {metric.value}
                  <span className="text-sm font-normal text-slate-400 ml-1">
                    {metric.unit}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Additional Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {detailedMetricsData.map((item, idx) => (
          <div
            key={idx}
            className="bg-slate-900 border border-slate-800 rounded-lg p-4"
          >
            <div className="text-xs text-slate-400 font-semibold uppercase tracking-tight mb-2">
              {item.label}
            </div>
            <div className="text-xl font-bold text-slate-100">{item.value}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
