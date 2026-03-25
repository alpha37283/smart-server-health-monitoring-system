import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function ActivityAndFailures() {
  const data = [
    { time: '12:00', connectionRate: 12, failureRate: 0.8 },
    { time: '12:15', connectionRate: 14, failureRate: 1.2 },
    { time: '12:30', connectionRate: 11, failureRate: 0.9 },
    { time: '12:45', connectionRate: 15, failureRate: 2.1 },
    { time: '13:00', connectionRate: 10, failureRate: 1.5 },
    { time: '13:15', connectionRate: 13, failureRate: 1.1 },
    { time: '13:30', connectionRate: 12, failureRate: 0.7 },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Failures Chart */}
      <div className="lg:col-span-8 bg-slate-900/50 border border-slate-800/30 rounded-lg p-6">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Connection Activity & Failures</h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="time" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
                labelStyle={{ color: '#f1f5f9' }}
              />
              <Line type="monotone" dataKey="connectionRate" stroke="#256af4" dot={false} strokeWidth={2} name="Connection Rate" />
              <Line type="monotone" dataKey="failureRate" stroke="#ef4444" dot={false} strokeWidth={2} name="Failure Rate" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-3 h-0.5 bg-blue-600"></span>
            <span className="font-bold text-slate-300 tracking-tighter uppercase">Connection Rate (conn/sec)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-0.5 bg-red-500"></span>
            <span className="font-bold text-slate-300 tracking-tighter uppercase">Failed Rate (failures/min)</span>
          </div>
        </div>
      </div>

      {/* Stats Column */}
      <div className="lg:col-span-4 space-y-6">
        {/* Connection Rate */}
        <div className="bg-slate-900 border border-slate-800/50 rounded-lg p-6 flex flex-col justify-center h-[calc(50%-12px)]">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Connection Rate</p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold tracking-tight text-white">12.5</p>
            <p className="text-xs font-bold text-slate-500 tracking-tighter uppercase">conn/sec</p>
          </div>
        </div>

        {/* Failed Connections */}
        <div className="bg-red-950/30 border border-red-900/30 rounded-lg p-6 flex flex-col justify-center h-[calc(50%-12px)]">
          <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest mb-2">Failed Connections</p>
          <div className="flex items-baseline justify-between">
            <p className="text-3xl font-bold tracking-tight text-red-500">3</p>
            <div className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-500 border border-red-500/30 uppercase">Spike Detected</div>
          </div>
        </div>
      </div>
    </div>
  );
}
