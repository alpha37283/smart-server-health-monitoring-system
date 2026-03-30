export default function LatencyMetricCard({ label, value, unit, trend, trendColor, trendIcon, borderColor }) {
  return (
    <div className={`bg-[#1a2332] rounded-lg p-6 border-l-4 ${borderColor}`}>
      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">{label}</div>
      <div className="flex items-baseline gap-2 mb-3">
        <span className="text-4xl font-bold text-white">{value}</span>
        <span className="text-sm text-slate-400">{unit}</span>
      </div>
      <div className={`text-xs font-medium ${trendColor} flex items-center gap-1`}>
        <span className="material-symbols-outlined text-sm">{trendIcon}</span>
        {trend}
      </div>
    </div>
  )
}
