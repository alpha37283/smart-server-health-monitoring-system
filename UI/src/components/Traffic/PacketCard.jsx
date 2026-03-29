export default function PacketCard({ title, value, unit, icon, chartPath }) {
  return (
    <div className="bg-[#0f1521] rounded border border-slate-800/50 flex flex-col h-64 overflow-hidden">
      <div className="p-4 flex justify-between items-start">
        <div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{title}</p>
          <h4 className="text-2xl font-bold mt-1 text-slate-100 tracking-tight">{value} <span className="text-xs text-slate-500 font-medium">{unit}</span></h4>
        </div>
        <span className="material-symbols-outlined text-slate-700">{icon}</span>
      </div>
      <div className="flex-1 bg-slate-900/20 relative mt-auto border-t border-slate-800/30">
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 400 100">
          <path d={chartPath} fill="none" stroke="#60a5fa" strokeOpacity="0.6" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
        </svg>
      </div>
    </div>
  )
}
