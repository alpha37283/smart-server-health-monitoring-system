import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const CustomGaugeLabel = (props) => {
  const { cx, cy } = props;
  return (
    <g>
      <text
        x={cx}
        y={cy - 20}
        textAnchor="middle"
        dominantBaseline="central"
        className="fill-primary text-4xl font-bold"
      >
        32%
      </text>
      <text
        x={cx}
        y={cy + 20}
        textAnchor="middle"
        dominantBaseline="central"
        className="fill-slate-400 text-xs font-semibold uppercase"
      >
        Active Time
      </text>
    </g>
  );
};

export default function DiskUtilization() {
  const data = [
    { value: 32, fill: '#3b82f6' },
    { value: 68, fill: '#334155' },
  ];

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-8">
      <h3 className="text-lg font-semibold mb-8">Disk Utilization (%)</h3>

      <div className="flex flex-col items-center gap-16">
        {/* Gauge Chart */}
        <div className="w-96 h-64 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%" margin={{ top: 20, right: 20, bottom: 40, left: 20 }}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="60%"
                startAngle={180}
                endAngle={0}
                innerRadius={70}
                outerRadius={110}
                dataKey="value"
                label={<CustomGaugeLabel />}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-3 gap-12 w-full">
          <div className="text-center">
            <p className="text-2xl font-semibold text-slate-100">2.1ms</p>
            <p className="text-xs text-slate-400 uppercase mt-2">Avg Response</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-semibold text-slate-100">64KB</p>
            <p className="text-xs text-slate-400 uppercase mt-2">Request Size</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-semibold text-slate-100">0.02s</p>
            <p className="text-xs text-slate-400 uppercase mt-2">Latency</p>
          </div>
        </div>
      </div>
    </div>
  );
}
