import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import { useMetrics } from '../../context/MetricsContext';

export default function ReadWriteOperations() {
  const { diskIoHistory } = useMetrics();

  const data = diskIoHistory.length > 0 
    ? diskIoHistory 
    : [{ time: '00:00', readOps: 0, writeOps: 0 }];

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
        <span>Read Ops/s</span>
        <span>Write Ops/s</span>
      </div>
    </div>
  );
}
