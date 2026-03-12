import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

import { useMetrics } from '../../context/MetricsContext';

export default function QueueLength() {
  const { diskQueueHistory } = useMetrics();
  
  const data = diskQueueHistory.length > 0 
    ? diskQueueHistory 
    : [{ time: '00:00', waits: 0 }];

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
        <span>Avg: {(() => {
          if (!diskQueueHistory.length) return '0.00';
          const sum = diskQueueHistory.reduce((acc, curr) => acc + (curr.waits || 0), 0);
          return (sum / diskQueueHistory.length).toFixed(2);
        })()}</span>
      </div>
    </div>
  );
}
