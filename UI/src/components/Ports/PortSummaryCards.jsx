export default function PortSummaryCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      {/* Total Processes */}
      <div className="bg-[#1a2332] border border-slate-800/50 rounded p-6">
        <p className="uppercase tracking-widest text-[10px] font-bold text-slate-500 mb-2">Total Processes</p>
        <div className="flex items-end space-x-3 mb-4">
          <h3 className="text-4xl font-bold tracking-tighter text-slate-100">1,428</h3>
          <span className="text-emerald-500 text-xs font-bold mb-1 flex items-center">
            <span className="material-symbols-outlined text-xs">arrow_drop_up</span> +12
          </span>
        </div>
        <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden mb-2">
          <div className="h-full bg-[#256af4] w-[72%]"></div>
        </div>
        <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">72% Resource Allocation</p>
      </div>

      {/* Total Connections */}
      <div className="bg-[#1a2332] border border-slate-800/50 rounded p-6">
        <p className="uppercase tracking-widest text-[10px] font-bold text-slate-500 mb-2">Total Connections</p>
        <div className="flex items-end space-x-3 mb-4">
          <h3 className="text-4xl font-bold tracking-tighter text-slate-100">42,891</h3>
          <span className="text-blue-400 text-xs font-bold mb-1 flex items-center">
            <span className="material-symbols-outlined text-xs">trending_up</span> Active
          </span>
        </div>
        <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden flex gap-0 mb-2">
          <div className="h-full bg-[#256af4] w-[60%]"></div>
          <div className="h-full bg-amber-500 w-[25%]"></div>
          <div className="h-full bg-slate-700 w-[15%]"></div>
        </div>
        <div className="grid grid-cols-3 gap-2 text-[10px] text-slate-500 uppercase font-bold tracking-widest">
          <span>TCP: 28k</span>
          <span>UDP: 11k</span>
          <span>Other: 3k</span>
        </div>
      </div>
    </div>
  )
}
