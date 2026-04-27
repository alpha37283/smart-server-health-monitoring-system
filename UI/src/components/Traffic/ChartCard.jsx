import React, { useMemo, useState } from 'react';

const BYTES_PER_KB = 1024;
const BYTES_PER_MB = 1024 ** 2;

function historyToChartPath(history) {
  if (!history || history.length === 0) {
    return 'M0 50 L 400 50';
  }
  const values = history.map((p) => p.value);
  const maxV = Math.max(...values, 1e-9);
  const n = history.length;
  const step = 400 / Math.max(n - 1, 1);
  return history
    .map((p, i) => {
      const x = i * step;
      const y = 100 - (p.value / maxV) * 90 - 5;
      return i === 0 ? `M${x},${y}` : `L${x},${y}`;
    })
    .join(' ');
}

export default function ChartCard({ title, rateBytesPerSec, rateHistory, icon }) {
  const [unit, setUnit] = useState('mb');

  const chartPath = useMemo(() => {
    const raw = rateHistory || [];
    const series =
      unit === 'kb'
        ? raw.map((p) => ({ ...p, value: p.value / BYTES_PER_KB }))
        : raw;
    return historyToChartPath(series);
  }, [rateHistory, unit]);

  const displayValue = useMemo(() => {
    if (rateBytesPerSec == null || !Number.isFinite(rateBytesPerSec)) return '—';
    if (unit === 'kb') {
      const kbPerSec = rateBytesPerSec / BYTES_PER_KB;
      return Math.min(kbPerSec, 1e9).toFixed(2);
    }
    const mbPerSec = rateBytesPerSec / BYTES_PER_MB;
    return Math.min(mbPerSec, 1e6).toFixed(2);
  }, [rateBytesPerSec, unit]);

  const unitLabel = unit === 'kb' ? 'KB/s' : 'MB/s';

  return (
    <div className="bg-[#0f1521] rounded border border-slate-800/50 flex flex-col h-64 overflow-hidden">
      <div className="p-4 flex justify-between items-start">
        <div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{title}</p>
          <h4 className="text-2xl font-bold mt-1 text-[#256af4] tracking-tight">
            {displayValue}{' '}
            <span className="text-xs text-slate-500 font-medium">{unitLabel}</span>
          </h4>
        </div>
        <div className="flex bg-slate-900/50 rounded p-0.5 border border-slate-800">
          <button
            type="button"
            onClick={() => setUnit('kb')}
            className={`px-2 py-1 text-[9px] font-bold uppercase tracking-tighter rounded transition-colors ${
              unit === 'kb'
                ? 'bg-[#256af4] text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            KB/S
          </button>
          <button
            type="button"
            onClick={() => setUnit('mb')}
            className={`px-2 py-1 text-[9px] font-bold uppercase tracking-tighter rounded transition-colors ${
              unit === 'mb'
                ? 'bg-[#256af4] text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            MB/S
          </button>
        </div>
        {icon && <span className="material-symbols-outlined text-slate-700">{icon}</span>}
      </div>
      <div className="flex-1 bg-gradient-to-b from-[rgba(37,106,244,0.2)] to-[rgba(37,106,244,0)] relative mt-auto border-t border-slate-800/30">
        <svg className="absolute inset-0 w-full h-full p-2" preserveAspectRatio="none" viewBox="0 0 400 100">
          <path d={chartPath} fill="none" stroke="#06b6d4" strokeWidth="2" vectorEffect="non-scaling-stroke" />
        </svg>
        {title.includes('Bytes') && (
          <div className="absolute bottom-2 left-4 text-[9px] text-slate-600 font-mono tracking-tighter uppercase">
            Real-time Stream: 1s polling · chart {unit === 'kb' ? 'KiB/s' : 'MiB/s'}
          </div>
        )}
      </div>
    </div>
  );
}
