import React, { useMemo } from 'react';

const MOCK_PATH_AVG =
  'M 0 220 Q 100 200, 150 160 T 300 120 T 450 140 T 600 80 T 750 120 T 900 60 T 1000 100';
const MOCK_PATH_HS =
  'M 0 200 Q 100 160, 150 140 T 300 100 T 450 120 T 600 60 T 750 100 T 900 40 T 1000 80';

function buildPath(values, scaleMax, viewH = 250) {
  if (!values.length) return '';
  const pad = 15;
  const usable = viewH - pad * 2;
  const max = Math.max(scaleMax, 1e-6);
  const pts = values.length === 1 ? [values[0], values[0]] : values;
  const step = 1000 / Math.max(pts.length - 1, 1);
  return pts
    .map((v, i) => {
      const x = i * step;
      const clamped = Math.min(Math.max(v, 0), max);
      const y = viewH - pad - (clamped / max) * usable;
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');
}

export default function LatencyTrends({ avgHistory = [], handshakeHistory = [] }) {
  const { pathAvg, pathHs, hasLive } = useMemo(() => {
    const avgVals = avgHistory.map((p) => p.value);
    const hsVals = handshakeHistory.map((p) => p.value);
    const hasLiveData = avgVals.length > 0 || hsVals.length > 0;
    if (!hasLiveData) {
      return { pathAvg: '', pathHs: '', hasLive: false };
    }
    const all = [...avgVals, ...hsVals];
    const scaleMax = Math.min(Math.max(...all, 10) * 1.15, 8000);
    const pathAvg = avgVals.length ? buildPath(avgVals, scaleMax) : '';
    const pathHs = hsVals.length ? buildPath(hsVals, scaleMax) : '';
    return { pathAvg, pathHs, hasLive: true };
  }, [avgHistory, handshakeHistory]);

  const flatLine = 'M 0 245 L 1000 245';
  const dAvg = pathAvg || (hasLive ? flatLine : MOCK_PATH_AVG);
  const dHs = pathHs || (hasLive ? flatLine : MOCK_PATH_HS);

  return (
    <div className="bg-[#1a2332] rounded-lg p-6">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-white mb-1">Latency Trends</h3>
        <p className="text-xs text-slate-500 uppercase">Real-time aggregated telemetry (60m window)</p>
      </div>

      <div className="flex gap-6 mb-8">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#256af4]"></div>
          <span className="text-sm text-slate-400">AVG LATENCY</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#f59e0b]" style={{ borderStyle: 'dashed' }}></div>
          <span className="text-sm text-slate-400">HANDSHAKE</span>
        </div>
      </div>

      <div className="h-80 flex flex-col justify-between">
        <div className="flex justify-between text-xs text-slate-500 mb-2">
          <span>400ms</span>
          <span></span>
          <span></span>
          <span></span>
          <span>0ms</span>
        </div>

        <svg viewBox="0 0 1000 250" className="w-full h-full" preserveAspectRatio="none">
          <line x1="0" y1="250" x2="1000" y2="250" stroke="#334155" strokeWidth="1" />
          <line x1="0" y1="200" x2="1000" y2="200" stroke="#1e293b" strokeWidth="1" strokeDasharray="5,5" />
          <line x1="0" y1="150" x2="1000" y2="150" stroke="#1e293b" strokeWidth="1" strokeDasharray="5,5" />
          <line x1="0" y1="100" x2="1000" y2="100" stroke="#1e293b" strokeWidth="1" strokeDasharray="5,5" />
          <line x1="0" y1="50" x2="1000" y2="50" stroke="#1e293b" strokeWidth="1" strokeDasharray="5,5" />

          <path
            d={dAvg}
            stroke="#256af4"
            strokeWidth="3"
            fill="none"
            vectorEffect="non-scaling-stroke"
          />

          <path
            d={dHs}
            stroke="#f59e0b"
            strokeWidth="3"
            strokeDasharray="10,5"
            fill="none"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        <div className="flex justify-between text-xs text-slate-500 mt-2 px-2">
          <span>14:00</span>
          <span>14:15</span>
          <span>14:30</span>
          <span>14:45</span>
          <span>15:00</span>
        </div>
      </div>

      <div className="text-xs text-slate-500 mt-4 flex gap-2 pl-2">
        <span>200ms</span>
        <span className="flex-1"></span>
      </div>
    </div>
  );
}
