export default function DiskMetricsCards() {
  const metrics = [
    { label: 'Total Disk', value: '512 GB', color: 'text-slate-400' },
    { label: 'Used Disk', value: '210 GB', color: 'text-primary' },
    { label: 'Free Disk', value: '302 GB', color: 'text-slate-400' },
    { label: 'Disk Usage', value: '41%', color: 'text-primary' },
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
