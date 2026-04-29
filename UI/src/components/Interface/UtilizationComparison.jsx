export default function UtilizationComparison() {
  const interfaces = [
    { name: 'eth0', utilization: 62.4 },
    { name: 'eth1', utilization: 12.1 },
    { name: 'wlan0', utilization: 4.2 },
    { name: 'eth2', utilization: 0.0, disabled: true },
  ]

  const systemAvg = 19.7
  const peakNode = 62.4
  const pktSecAvg = 912.4

  return (
    <div className="bg-[#151d2a] rounded-lg border border-slate-700 p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Utilization Comparison</h3>
        <span className="text-[10px] text-slate-500 font-mono">VALUES_IN_%</span>
      </div>

      <div className="space-y-5">
        {interfaces.map((iface) => (
          <div key={iface.name} className={`group ${iface.disabled ? 'opacity-40' : ''}`}>
            <div className="flex justify-between text-[11px] text-slate-400 mb-2 px-1">
              <span>{iface.name}</span>
              <span className="font-bold text-white">{iface.utilization}%</span>
            </div>
            <div className="relative h-8 bg-slate-800 rounded flex items-center px-1 overflow-hidden">
              <div 
                className={`h-6 border-r-2 transition-all duration-500 ${
                  iface.disabled 
                    ? 'bg-slate-700/20 border-slate-700' 
                    : 'bg-[#256af4]/20 border-[#256af4] group-hover:bg-[#256af4]/30'
                }`}
                style={{ width: `${iface.utilization}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-slate-700 flex justify-between">
        <div className="text-center">
          <div className="text-2xl font-black text-white leading-tight">{systemAvg}%</div>
          <div className="text-[9px] text-slate-500 tracking-widest uppercase mt-1">System Avg</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-black text-[#256af4] leading-tight">{peakNode}%</div>
          <div className="text-[9px] text-slate-500 tracking-widest uppercase mt-1">Peak Node</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-black text-white leading-tight">{pktSecAvg}</div>
          <div className="text-[9px] text-slate-500 tracking-widest uppercase mt-1">Pkt/Sec Avg</div>
        </div>
      </div>
    </div>
  )
}
