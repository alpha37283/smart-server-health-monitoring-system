import { useMetrics } from '../../context/MetricsContext';

export default function ConnectionStats() {
  const { networkConnectionMetrics } = useMetrics();
  const d = networkConnectionMetrics?.data ?? {};
  
  const est = d.established_connections || 0;
  const listen = d.listening_sockets || 0;
  const tw = d.time_wait_connections || 0;

  const stats = [
    {
      label: 'Established Connections',
      value: est.toLocaleString(),
      status: 'STABLE',
      statusColor: 'text-emerald-500',
    },
    {
      label: 'Listening Sockets',
      value: listen.toLocaleString(),
      status: 'STATIC',
      statusColor: 'text-slate-400',
    },
    {
      label: 'Time Wait Connections',
      value: tw.toLocaleString(),
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
