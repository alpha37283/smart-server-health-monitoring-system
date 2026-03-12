import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

import { useMetrics } from '../../context/MetricsContext';

const CustomLabel = (props) => {
  const { cx, cy, pct } = props;
  return (
    <g>
      <text
        x={cx}
        y={cy}
        textAnchor="middle"
        dominantBaseline="central"
        className="fill-primary text-3xl font-bold"
      >
        {pct != null ? `${pct.toFixed(0)}%` : '0%'}
      </text>
    </g>
  );
};

export default function DiskDistribution() {
  const { diskMetrics } = useMetrics();
  const d = diskMetrics?.data ?? {}; 
  const used = typeof d.used_disk_gb === 'number' ? d.used_disk_gb : 0;
  const free = typeof d.free_disk_gb === 'number' ? d.free_disk_gb : 1;
  const pct = typeof d.disk_usage_percent === 'number' ? d.disk_usage_percent : 0;

  const data = [
    { name: 'Used', value: used, fill: '#3b82f6' },
    { name: 'Free', value: free, fill: '#475569' },
  ];

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6">
      <div className="flex flex-col items-center gap-8">
        <div>
          <h3 className="text-lg font-semibold mb-4">Distribution</h3>
          <div className="space-y-2 flex flex-col items-start">
            {[
              { label: `Used (${used.toFixed(1)} GB)`, color: 'bg-primary' },
              { label: `Free (${free.toFixed(1)} GB)`, color: 'bg-slate-700' },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                <span className="text-xs text-slate-400">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="w-80 h-72 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%" margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={95}
                paddingAngle={2}
                dataKey="value"
                label={(props) => <CustomLabel {...props} pct={pct} />}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
