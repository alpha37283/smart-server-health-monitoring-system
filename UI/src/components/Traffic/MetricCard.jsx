export default function MetricCard({ label, value, unit, trend, trendColor, trendIcon }) {
  return (
    <div className="bg-[#0f1521] p-5 rounded border-l border-[#256af4]/30 relative overflow-hidden">
      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{label}</p>
      <h3 className="text-4xl font-bold text-slate-100 leading-tight tracking-tight">
        {value} <span className="text-sm font-medium text-slate-500">{unit}</span>
      </h3>
      <div className={`mt-2 flex items-center text-[10px] font-bold ${trendColor}`}>
        <span className="material-symbols-outlined text-xs mr-1">{trendIcon}</span>
        {trend}
      </div>
    </div>
  )
}
