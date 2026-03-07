import React from 'react';
import { Repeat2, Zap } from 'lucide-react';

const metricsData = [
  {
    title: 'Context Switches',
    value: '12,482',
    unit: '/sec',
    icon: Repeat2,
    color: 'text-blue-400',
  },
  {
    title: 'CPU Frequency',
    value: '3200',
    unit: 'MHz',
    icon: Zap,
    color: 'text-blue-400',
  },
];

const detailedMetricsData = [
  { label: 'Interrupt Handling', value: '2.4%' },
  { label: 'Exception Handling', value: '0.8%' },
  { label: 'System Calls', value: '1.2%' },
  { label: 'Thermal Throttling', value: 'Disabled' },
];

export default function DetailedMetrics() {
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
