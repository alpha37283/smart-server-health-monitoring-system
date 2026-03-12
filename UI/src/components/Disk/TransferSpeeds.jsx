import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import { useMetrics } from '../../context/MetricsContext';

export default function TransferSpeeds() {
  const { diskTransferHistory } = useMetrics();

  const data = diskTransferHistory.length > 0 
    ? diskTransferHistory 
    : [{ time: '00:00', readSpeed: 0, writeSpeed: 0 }];

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
