export default function BandwidthCard({ utilizationPercent }) {
  const pct =
    utilizationPercent != null && Number.isFinite(utilizationPercent)
      ? Math.min(100, Math.max(0, utilizationPercent))
      : null;
  const displayPct = pct != null ? `${pct.toFixed(1)}%` : 'N/A';
  const barPrimary = pct != null ? `${pct}%` : '0%';
  const barSecondary = pct != null ? `${Math.min(15, Math.max(0, 100 - pct))}%` : '15%';

  return (
    <div className="bg-[#0f1521] p-6 rounded border border-slate-800/50">
      <div className="flex justify-between items-end mb-6">
        <div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Bandwidth Utilization</p>
          <h2 className="text-6xl font-black text-slate-100 tracking-tighter">{displayPct}</h2>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Max Link Speed</p>
          <p className="text-lg font-bold text-[#256af4]">1.0 Gbps (Full Duplex)</p>
        </div>
      </div>
      <div className="w-full h-4 bg-slate-900 rounded-full overflow-hidden flex">
        <div className="h-full bg-[#256af4]" style={{ width: barPrimary }}></div>
        <div className="h-full bg-[#256af4]/20" style={{ width: barSecondary }}></div>
      </div>
      <div className="flex justify-between mt-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#256af4]"></span>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Active usage</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#256af4]/20"></span>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Reserved Overhead</span>
        </div>
        <span className="text-[10px] text-slate-500 font-mono">ENET_0: MAC 00:1A:2B:3C:4D:5E</span>
      </div>
    </div>
  )
}
