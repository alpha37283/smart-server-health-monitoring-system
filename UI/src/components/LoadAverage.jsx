import React from 'react';
import { useMetrics } from '../context/MetricsContext';

export default function LoadAverage() {
  const { cpuMetrics, load1mHistory, load5mHistory, load15mHistory } = useMetrics();
  const loadAvg = cpuMetrics?.data?.load_avg ?? {};
  const loadAverageData = {
    '1min': {
      value: loadAvg['1m'] ?? 0,
      data: load1mHistory.length > 0 ? load1mHistory : [{ x: 0, y: 0 }],
    },
    '5min': {
      value: loadAvg['5m'] ?? 0,
      data: load5mHistory.length > 0 ? load5mHistory : [{ x: 0, y: 0 }],
    },
    '15min': {
      value: loadAvg['15m'] ?? 0,
      data: load15mHistory.length > 0 ? load15mHistory : [{ x: 0, y: 0 }],
    },
  };

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
        Load Average
      </h3>
      <div className="grid grid-cols-3 gap-4">
        {Object.entries(loadAverageData).map(([key, data]) => (
          <div
            key={key}
            className="bg-slate-900 border border-slate-800 rounded-xl p-4"
          >
            <div className="text-xs text-slate-400 mb-1">
              {key === '1min' ? '1 min' : key === '5min' ? '5 min' : '15 min'}
            </div>
            <div className="text-2xl font-bold mb-3 text-slate-100">
              {typeof data.value === 'number' ? data.value.toFixed(2) : '0'}
            </div>
            <div className="h-8">
              <svg viewBox="0 0 100 20" className="w-full h-full">
                <path
                  d={`M${data.data
                    .map((p) => `${p.x * 10},${p.y}`)
                    .join(' L ')}`}
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
