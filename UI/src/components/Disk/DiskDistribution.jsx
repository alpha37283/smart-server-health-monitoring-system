import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const CustomLabel = (props) => {
  const { cx, cy } = props;
  return (
    <g>
      <text
        x={cx}
        y={cy}
        textAnchor="middle"
        dominantBaseline="central"
        className="fill-primary text-3xl font-bold"
      >
        41%
      </text>
    </g>
  );
};

export default function DiskDistribution() {
  const data = [
    { name: 'Used (210 GB)', value: 210, fill: '#3b82f6' },
    { name: 'Free (302 GB)', value: 302, fill: '#475569' },
  ];

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6">
      <div className="flex flex-col items-center gap-8">
        <div>
          <h3 className="text-lg font-semibold mb-4">Distribution</h3>
          <div className="space-y-2 flex flex-col items-start">
            {[
              { label: 'Used (210 GB)', color: 'bg-primary' },
              { label: 'Free (302 GB)', color: 'bg-slate-700' },
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
                label={<CustomLabel />}
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
