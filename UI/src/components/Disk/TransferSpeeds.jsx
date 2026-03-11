import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function TransferSpeeds() {
  const data = [
    { time: '10:45', readSpeed: 45, writeSpeed: 28 },
    { time: '10:47', readSpeed: 52, writeSpeed: 31 },
    { time: '10:49', readSpeed: 48, writeSpeed: 26 },
    { time: '10:51', readSpeed: 65, writeSpeed: 38 },
    { time: '10:53', readSpeed: 78, writeSpeed: 45 },
    { time: '10:55', readSpeed: 85, writeSpeed: 52 },
    { time: '11:00', readSpeed: 92, writeSpeed: 58 },
    { time: '11:05', readSpeed: 78, writeSpeed: 48 },
  ];

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-1">Transfer Speeds</h3>
        <p className="text-xs text-slate-400">Real-time disk read and write throughput</p>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="time" stroke="#64748b" style={{ fontSize: '12px' }} />
          <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
          <Tooltip
            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
            labelStyle={{ color: '#e2e8f0' }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="readSpeed"
            stroke="#3b82f6"
            name="Read Speed"
            dot={false}
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="writeSpeed"
            stroke="#94a3b8"
            strokeDasharray="5 5"
            name="Write Speed"
            dot={false}
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
