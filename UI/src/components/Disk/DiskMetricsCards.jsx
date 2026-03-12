import { useMetrics } from '../../context/MetricsContext';

function fmtGb(v) {
  if (v == null || typeof v !== 'number') return '—';
  return `${v} GB`;
}
function fmtPct(v) {
  if (v == null || typeof v !== 'number') return '—';
  return `${v}%`;
}

export default function DiskMetricsCards() {
  const { diskMetrics } = useMetrics();
  const d = diskMetrics?.data ?? {};
  const metrics = [
    { label: 'Total Disk', value: fmtGb(d.total_disk_gb), color: 'text-slate-400' },
    { label: 'Used Disk', value: fmtGb(d.used_disk_gb), color: 'text-primary' },
    { label: 'Free Disk', value: fmtGb(d.free_disk_gb), color: 'text-slate-400' },
    { label: 'Disk Usage', value: fmtPct(d.disk_usage_percent), color: 'text-primary' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, idx) => (
        <div
          key={idx}
          className="bg-slate-900/50 border border-slate-800 rounded-lg p-6"
        >
          <p className="text-slate-400 text-sm font-medium mb-2">
            {metric.label}
          </p>
          <p className={`text-2xl font-bold ${metric.color}`}>
            {metric.value}
          </p>
        </div>
      ))}
    </div>
  );
}
