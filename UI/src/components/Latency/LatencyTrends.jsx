export default function LatencyTrends() {
  return (
    <div className="bg-[#1a2332] rounded-lg p-6">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-white mb-1">Latency Trends</h3>
        <p className="text-xs text-slate-500 uppercase">Real-time aggregated telemetry (60m window)</p>
      </div>

      {/* Legend */}
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

      {/* Chart */}
      <div className="h-80 flex flex-col justify-between">
        {/* Y-axis labels */}
        <div className="flex justify-between text-xs text-slate-500 mb-2">
          <span>400ms</span>
          <span></span>
          <span></span>
          <span></span>
          <span>0ms</span>
        </div>

        {/* Chart SVG */}
        <svg viewBox="0 0 1000 250" className="w-full h-full" preserveAspectRatio="none">
          {/* Grid lines */}
          <line x1="0" y1="250" x2="1000" y2="250" stroke="#334155" strokeWidth="1" />
          <line x1="0" y1="200" x2="1000" y2="200" stroke="#1e293b" strokeWidth="1" strokeDasharray="5,5" />
          <line x1="0" y1="150" x2="1000" y2="150" stroke="#1e293b" strokeWidth="1" strokeDasharray="5,5" />
          <line x1="0" y1="100" x2="1000" y2="100" stroke="#1e293b" strokeWidth="1" strokeDasharray="5,5" />
          <line x1="0" y1="50" x2="1000" y2="50" stroke="#1e293b" strokeWidth="1" strokeDasharray="5,5" />

          {/* Blue line - Average Latency */}
          <path
            d="M 0 220 Q 100 200, 150 160 T 300 120 T 450 140 T 600 80 T 750 120 T 900 60 T 1000 100"
            stroke="#256af4"
            strokeWidth="3"
            fill="none"
            vectorEffect="non-scaling-stroke"
          />

          {/* Orange dashed line - Handshake */}
          <path
            d="M 0 200 Q 100 160, 150 140 T 300 100 T 450 120 T 600 60 T 750 100 T 900 40 T 1000 80"
            stroke="#f59e0b"
            strokeWidth="3"
            strokeDasharray="10,5"
            fill="none"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {/* X-axis labels */}
        <div className="flex justify-between text-xs text-slate-500 mt-2 px-2">
          <span>14:00</span>
          <span>14:15</span>
          <span>14:30</span>
          <span>14:45</span>
          <span>15:00</span>
        </div>
      </div>

      {/* Y-axis scale on left */}
      <div className="text-xs text-slate-500 mt-4 flex gap-2 pl-2">
        <span>200ms</span>
        <span className="flex-1"></span>
      </div>
    </div>
  )
}
