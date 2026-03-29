export default function Header() {
  return (
    <header className="h-16 bg-[#101622] border-b border-slate-800 flex items-center justify-between px-8 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <h1 className="text-sm font-bold tracking-tight text-slate-500">
          <span className="text-[#256af4]">SysMonitor</span> / machine_01 <span className="text-xs font-normal opacity-60">(v2.4.5)</span>
        </h1>
        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-500/20 text-green-500 uppercase tracking-wider">Stable</span>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-slate-700">
          <span className="material-symbols-outlined text-green-500 text-sm">wifi</span>
          <span className="text-xs font-medium text-slate-100">Connected</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-slate-700">
          <span className="material-symbols-outlined text-[#256af4] text-sm">battery_charging_80</span>
          <span className="text-xs font-medium text-slate-100">85%</span>
        </div>
        <button className="size-9 flex items-center justify-center rounded border border-slate-700 text-slate-300 hover:bg-slate-800 transition-colors">
          <span className="material-symbols-outlined text-lg">notifications</span>
        </button>
      </div>
    </header>
  )
}
