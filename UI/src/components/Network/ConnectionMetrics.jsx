export default function ConnectionMetrics() {
  return (
    <div className="bg-slate-900 border border-slate-800/50 rounded-lg p-8 flex flex-col justify-between h-full">
      <div>
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6">Connection Metrics</h3>
        <div className="space-y-8">
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Total Active</p>
            <p className="text-4xl font-bold text-white tracking-tight">2,412</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-slate-900/40 rounded-lg border border-slate-800/30">
              <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1">TCP Established</p>
              <p className="text-2xl font-bold">1,850</p>
            </div>
            <div className="p-4 bg-slate-900/40 rounded-lg border border-slate-800/30">
              <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1">UDP Active</p>
              <p className="text-2xl font-bold">562</p>
            </div>
          </div>
        </div>
      </div>
      <div className="pt-6 border-t border-slate-800/50 flex items-center gap-2 text-emerald-500">
        <span className="text-sm">📈</span>
        <span className="text-xs font-semibold">+4.2% from last hour</span>
      </div>
    </div>
  );
}
