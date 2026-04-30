export default function ConnectionActivityChart() {
  const heights = [40, 35, 60, 45, 80, 95, 50, 40, 30, 55, 70, 60, 45, 35, 85, 40, 30, 50, 60, 90, 40, 35, 55, 45]
  const spikeIndices = [5, 19]

  return (
    <div className="bg-[#0f1521] rounded p-6 mb-6 border border-slate-800/50">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-sm font-bold text-white uppercase tracking-widest">Connection Activity Score (Last 24H)</h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-[#256af4]"></div>
            <span className="text-[10px] text-slate-500 uppercase font-bold">Standard</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-amber-500"></div>
            <span className="text-[10px] text-slate-500 uppercase font-bold">Spike</span>
          </div>
        </div>
      </div>

      <div className="flex items-end justify-between h-32 gap-1 px-2 mb-4">
        {heights.map((height, idx) => (
          <div
            key={idx}
            className={`w-full rounded-t-sm transition-all hover:brightness-125 ${
              spikeIndices.includes(idx) 
                ? 'bg-amber-500/60' 
                : 'bg-[#256af4]/20'
            }`}
            style={{ height: `${height}%` }}
          ></div>
        ))}
      </div>

      <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest border-t border-slate-800 pt-4">
        <span>00:00</span>
        <span>04:00</span>
        <span>08:00</span>
        <span>12:00</span>
        <span>16:00</span>
        <span>20:00</span>
        <span>23:59</span>
      </div>
    </div>
  )
}
