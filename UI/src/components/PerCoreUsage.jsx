import React from 'react';

const coreData = [
  { id: 1, name: 'Core 01', usage: 12 },
  { id: 2, name: 'Core 02', usage: 45 },
  { id: 3, name: 'Core 03', usage: 8 },
  { id: 4, name: 'Core 04', usage: 62 },
  { id: 5, name: 'Core 05', usage: 31 },
  { id: 6, name: 'Core 06', usage: 19 },
  { id: 7, name: 'Core 07', usage: 88 },
  { id: 8, name: 'Core 08', usage: 5 },
  { id: 9, name: 'Core 09', usage: 27 },
  { id: 10, name: 'Core 10', usage: 44 },
  { id: 11, name: 'Core 11', usage: 12 },
  { id: 12, name: 'Core 12', usage: 3 },
];

export default function PerCoreUsage() {
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
