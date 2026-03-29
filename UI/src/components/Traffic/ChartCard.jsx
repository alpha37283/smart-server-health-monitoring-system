export default function ChartCard({ title, value, unit, unitToggle, chartPath, icon }) {
  return (
    <div className="bg-[#0f1521] rounded border border-slate-800/50 flex flex-col h-64 overflow-hidden">
      <div className="p-4 flex justify-between items-start">
        <div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{title}</p>
          <h4 className="text-2xl font-bold mt-1 text-[#256af4] tracking-tight">{value} <span className="text-xs text-slate-500 font-medium">{unit}</span></h4>
        </div>
        {unitToggle && (
          <div className="flex bg-slate-900/50 rounded p-0.5 border border-slate-800">
            <button className="px-2 py-1 text-[9px] font-bold text-slate-500 hover:text-slate-300 uppercase tracking-tighter">KB/S</button>
            <button className="px-2 py-1 text-[9px] font-bold bg-[#256af4] text-white rounded text-[3px] uppercase tracking-tighter shadow-sm">{unitToggle}</button>
          </div>
        )}
        {icon && <span className="material-symbols-outlined text-slate-700">{icon}</span>}
      </div>
      <div className="flex-1 bg-gradient-to-b from-[rgba(37,106,244,0.2)] to-[rgba(37,106,244,0)] relative mt-auto border-t border-slate-800/30">
        <svg className="absolute inset-0 w-full h-full p-2" preserveAspectRatio="none" viewBox="0 0 400 100">
          <path d={chartPath} fill="none" stroke="#06b6d4" strokeWidth="2" vectorEffect="non-scaling-stroke" />
        </svg>
        {title.includes('Bytes') && (
          <div className="absolute bottom-2 left-4 text-[9px] text-slate-600 font-mono tracking-tighter uppercase">Real-time Stream: 1s polling</div>
        )}
      </div>
    </div>
  )
}
