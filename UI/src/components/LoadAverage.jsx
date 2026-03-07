import React from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';

const loadAverageData = {
  '1min': {
    value: 0.82,
    data: [
      { x: 0, y: 10 },
      { x: 1, y: 12 },
      { x: 2, y: 8 },
      { x: 3, y: 15 },
      { x: 4, y: 10 },
      { x: 5, y: 14 },
      { x: 6, y: 5 },
      { x: 7, y: 12 },
      { x: 8, y: 10 },
      { x: 9, y: 15 },
      { x: 10, y: 10 },
    ],
  },
  '5min': {
    value: 1.12,
    data: [
      { x: 0, y: 15 },
      { x: 1, y: 10 },
      { x: 2, y: 12 },
      { x: 3, y: 5 },
      { x: 4, y: 15 },
      { x: 5, y: 10 },
      { x: 6, y: 12 },
      { x: 7, y: 8 },
      { x: 8, y: 15 },
      { x: 9, y: 12 },
      { x: 10, y: 5 },
    ],
  },
  '15min': {
    value: 1.05,
    data: [
      { x: 0, y: 10 },
      { x: 1, y: 12 },
      { x: 2, y: 10 },
      { x: 3, y: 12 },
      { x: 4, y: 10 },
      { x: 5, y: 12 },
      { x: 6, y: 10 },
      { x: 7, y: 12 },
      { x: 8, y: 10 },
      { x: 9, y: 12 },
      { x: 10, y: 10 },
    ],
  },
};

export default function LoadAverage() {
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
              {data.value}
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
