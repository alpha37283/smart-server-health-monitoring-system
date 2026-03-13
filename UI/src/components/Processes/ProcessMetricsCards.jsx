import React from 'react';

export default function ProcessMetricsCards({ metrics }) {
  const cards = [
    {
      label: 'Total Processes',
      value: metrics.total,
      icon: '📋',
      color: 'border-primary',
      bgColor: 'bg-primary/20',
      textColor: 'text-primary',
    },
    {
      label: 'Running',
      value: metrics.running,
      icon: '▶️',
      color: 'border-emerald-500',
      bgColor: 'bg-emerald-500/20',
      textColor: 'text-emerald-400',
    },
    {
      label: 'Sleeping',
      value: metrics.sleeping,
      icon: '🌙',
      color: 'border-blue-400',
      bgColor: 'bg-blue-400/20',
      textColor: 'text-blue-400',
    },
    {
      label: 'Avg CPU Usage',
      value: `${metrics.avgCPU}%`,
      icon: '⚡',
      color: 'border-amber-500',
      bgColor: 'bg-amber-500/20',
      textColor: 'text-amber-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className={`bg-slate-900/50 border-l-4 ${card.color} border border-slate-800 rounded-lg p-6 flex items-center gap-4`}
        >
          <div className={`w-12 h-12 ${card.bgColor} rounded-lg flex items-center justify-center text-2xl`}>
            {card.icon}
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase font-medium tracking-wider">{card.label}</p>
            <p className={`text-3xl font-bold ${card.textColor}`}>{card.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
