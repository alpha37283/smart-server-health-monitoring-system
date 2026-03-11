import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function QueueLength() {
  const data = [
    { time: '10:45', waits: 2 },
    { time: '10:47', waits: 5 },
    { time: '10:49', waits: 8 },
    { time: '10:51', waits: 12 },
    { time: '10:53', waits: 18 },
    { time: '10:55', waits: 15 },
    { time: '11:00', waits: 9 },
    { time: '11:05', waits: 6 },
    { time: '11:10', waits: 4 },
    { time: '11:15', waits: 7 },
    { time: '11:20', waits: 11 },
    { time: '11:25', waits: 8 },
  ];

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold">Queue Length</h3>
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="time" stroke="#64748b" style={{ fontSize: '12px' }} />
          <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
          <Tooltip
            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
            labelStyle={{ color: '#e2e8f0' }}
          />
          <Bar dataKey="waits" fill="#3b82f6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>

      <div className="flex items-center justify-between text-xs text-slate-400 mt-4">
        <span>Wait count</span>
        <span>Avg: 0.08</span>
      </div>
    </div>
  );
}
