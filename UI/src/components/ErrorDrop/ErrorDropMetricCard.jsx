export default function ErrorDropMetricCard({ label, value, unit, trend, trendColor, trendIcon, borderColor }) {
  return (
    <div className={`bg-[#1a2332] p-6 rounded-lg border-l-4 ${borderColor}`}>
      <span className="text-[10px] font-bold text-slate-500 tracking-[0.2em] uppercase">{label}</span>
      <div className="flex items-baseline gap-2 mt-2">
        <span className="text-4xl font-bold text-slate-100">{value}</span>
        <span className="text-xl font-bold text-slate-500">{unit}</span>
      </div>
      <div className={`mt-4 flex items-center gap-2 ${trendColor} text-xs font-bold`}>
        <span className="material-symbols-outlined text-sm">{trendIcon}</span>
        {trend}
      </div>
    </div>
  )
}
