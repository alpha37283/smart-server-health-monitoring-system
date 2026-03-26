import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useMetrics } from '../../context/MetricsContext';

export default function ConnectionDistribution() {
  const { networkConnectionMetrics } = useMetrics();
  const d = networkConnectionMetrics?.data ?? {};

  const total = d.total_connections || 0;
  const tcp = d.tcp_connections || 0;
  const udp = d.udp_connections || 0;
  const remaining = Math.max(0, total - tcp - udp);

  const data = [
    { name: 'TCP', value: tcp, fill: '#256af4' },
    { name: 'UDP', value: udp, fill: '#60a5fa' },
    { name: 'Remaining', value: remaining, fill: '#475569' },
  ];

  let displayTotal = total > 1000 ? (total / 1000).toFixed(1) + 'k' : total.toString();

  const CustomLabel = (props) => {
    const { cx, cy } = props;
    return (
      <g>
        <text
          x={cx}
          y={cy - 10}
          textAnchor="middle"
          dominantBaseline="central"
          className="fill-slate-100 text-3xl font-bold"
        >
          {displayTotal}
        </text>
        <text
          x={cx}
          y={cy + 15}
          textAnchor="middle"
          dominantBaseline="central"
          className="fill-slate-500 text-[10px] font-bold uppercase tracking-widest"
        >
          Total
        </text>
      </g>
    );
  };

  return (
    <div className="bg-slate-900/50 border border-slate-800/30 rounded-lg p-6">
      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Connection Distribution</h3>

      <div className="flex items-center justify-between gap-4">
        <div className="w-56 h-56 flex items-center justify-center flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={95}
                paddingAngle={2}
                dataKey="value"
                label={<CustomLabel />}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-sm bg-blue-600"></div>
            <div>
              <p className="text-xs text-slate-500 font-medium">TCP Connections</p>
              <p className="text-lg font-bold">{tcp.toLocaleString()}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-sm bg-blue-400"></div>
            <div>
              <p className="text-xs text-slate-500 font-medium">UDP Connections</p>
              <p className="text-lg font-bold">{udp.toLocaleString()}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-sm bg-slate-700"></div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Remaining</p>
              <p className="text-lg font-bold">{remaining.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
