import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function ReadWriteOperations() {
  const data = [
    { time: '10:45', readOps: 120, writeOps: 85 },
    { time: '10:47', readOps: 145, writeOps: 92 },
    { time: '10:49', readOps: 165, writeOps: 78 },
    { time: '10:51', readOps: 185, writeOps: 105 },
    { time: '10:53', readOps: 210, writeOps: 128 },
    { time: '10:55', readOps: 195, writeOps: 115 },
    { time: '11:00', readOps: 175, writeOps: 95 },
  ];

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold">Read/Write Operations</h3>
        <p className="text-xs text-slate-400 mt-1">I/O ops per sec</p>
      </div>

      <ResponsiveContainer width="100%" height={250}>
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
            dataKey="readOps"
            stroke="#3b82f6"
            name="Read Ops"
            dot={false}
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="writeOps"
            stroke="#f5f5f5"
            name="Write Ops"
            dot={false}
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>

      <div className="flex justify-between text-xs text-slate-400 mt-4">
        <span>Read: 1.2k</span>
        <span>Write: 0.4k</span>
      </div>
    </div>
  );
}
