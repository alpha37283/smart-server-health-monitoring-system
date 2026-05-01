export default function ProcessMetricsCards({
  totalProcesses = 248,
  activeConnections = 1042,
  establishedConnections = 892,
  listeningConnections = 150,
}) {
  return (
    <div className="grid grid-cols-4 gap-6 mb-6">
      <div className="bg-[#0f1521] p-5 rounded border border-slate-800/50">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Total Processes</p>
        <div className="flex items-end gap-2">
          <span className="text-4xl font-bold text-white">{totalProcesses}</span>
          <span className="text-emerald-500 text-[10px] font-bold mb-1 flex items-center gap-0.5">
            <span className="material-symbols-outlined text-xs">arrow_upward</span> 2.4%
          </span>
        </div>
      </div>

      <div className="bg-[#0f1521] p-5 rounded border border-slate-800/50">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Active Connections</p>
        <div className="flex items-end gap-2">
          <span className="text-4xl font-bold text-white">{activeConnections.toLocaleString()}</span>
          <span className="text-[#256af4] text-[10px] font-bold mb-1 flex items-center gap-0.5">
            <span className="material-symbols-outlined text-xs">sync</span> LOAD
          </span>
        </div>
      </div>

      <div className="bg-[#0f1521] p-5 rounded border border-slate-800/50">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Established</p>
        <div className="flex items-end gap-2">
          <span className="text-4xl font-bold text-white">{establishedConnections.toLocaleString()}</span>
          <span className="text-slate-500 text-[10px] font-bold mb-1 uppercase">Stable</span>
        </div>
      </div>

      <div className="bg-[#0f1521] p-5 rounded border border-slate-800/50">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Listening</p>
        <div className="flex items-end gap-2">
          <span className="text-4xl font-bold text-white">{listeningConnections.toLocaleString()}</span>
          <span className="text-amber-500 text-[10px] font-bold mb-1 flex items-center gap-0.5">
            <span className="material-symbols-outlined text-xs">sensors</span> BROADCAST
          </span>
        </div>
      </div>
    </div>
  )
}
