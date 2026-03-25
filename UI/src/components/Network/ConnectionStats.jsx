export default function ConnectionStats() {
  const stats = [
    {
      label: 'Established Connections',
      value: '1,240',
      status: 'STABLE',
      statusColor: 'text-emerald-500',
    },
    {
      label: 'Listening Sockets',
      value: '42',
      status: 'STATIC',
      statusColor: 'text-slate-400',
    },
    {
      label: 'Time Wait Connections',
      value: '85',
      status: 'MODERATE',
      statusColor: 'text-amber-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, idx) => (
        <div key={idx} className="bg-slate-900 border border-slate-800/50 rounded-lg p-6">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">{stat.label}</p>
          <div className="flex items-end justify-between">
            <p className="text-3xl font-bold tracking-tight">{stat.value}</p>
            <span className={`text-xs font-bold ${stat.statusColor} mb-1`}>{stat.status}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
