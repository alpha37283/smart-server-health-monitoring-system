const DEFAULT_DATA = [
  { name: 'eth0', received: 90, sent: 40 },
  { name: 'eth1', received: 15, sent: 30 },
  { name: 'eth2', received: 2, sent: 2, disabled: true },
  { name: 'wlan0', received: 12, sent: 5 },
];

export default function TrafficThroughput({ data = DEFAULT_DATA, maxPktLabel = '1.2 GB/s' }) {

  return (
    <div className="bg-[#151d2a] rounded-lg border border-slate-700 p-6">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Traffic Throughput</h3>
        <div className="flex gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#256af4]"></span>
            <span className="text-[10px] text-slate-400 uppercase">Received</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-slate-700 border border-[#256af4]/40"></span>
            <span className="text-[10px] text-slate-400 uppercase">Sent</span>
          </div>
        </div>
      </div>

      <div className="h-64 flex items-end justify-around gap-6 px-2">
        {data.map((item) => (
          <div key={item.name} className={`flex-1 flex flex-col items-center gap-2 group ${item.disabled ? 'opacity-20' : ''}`}>
            <div className="flex items-end gap-1.5 h-full w-full justify-center">
              {/* Sent bar (outline/hollow) */}
              <div 
                className={`w-4 rounded-t h-full border-t-2 transition-all duration-500 ${
                  item.disabled
                    ? 'bg-slate-700 border-slate-700'
                    : 'bg-slate-700/30 border-[#256af4]/40 group-hover:bg-[#256af4]/10'
                }`}
                style={{ height: `${item.sent}%` }}
              ></div>
              {/* Received bar (solid) */}
              <div 
                className={`w-4 rounded-t border-t-2 transition-all duration-500 ${
                  item.disabled
                    ? 'bg-slate-700 border-slate-700'
                    : 'bg-[#256af4]/60 border-[#256af4] group-hover:bg-[#256af4]/80'
                }`}
                style={{ height: `${item.received}%` }}
              ></div>
            </div>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tight mt-2">{item.name}</span>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-between items-center text-xs">
        <span className="text-slate-500">
          <span className="material-symbols-outlined text-xs align-middle mr-1">schedule</span>
          Last 60 Minutes
        </span>
        <span className="text-[#256af4] font-bold font-mono">MAX_PKT: {maxPktLabel}</span>
      </div>
    </div>
  )
}
