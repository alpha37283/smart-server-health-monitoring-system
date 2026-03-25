import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function ConnectionTrends() {
  const data = [
    { time: '12:00', total: 2200, tcp: 1650, udp: 400 },
    { time: '12:15', total: 2350, tcp: 1750, udp: 450 },
    { time: '12:30', total: 2180, tcp: 1640, udp: 380 },
    { time: '12:45', total: 2420, tcp: 1810, udp: 480 },
    { time: '13:00', total: 2100, tcp: 1580, udp: 350 },
    { time: '13:15', total: 2380, tcp: 1780, udp: 460 },
    { time: '13:30', total: 2280, tcp: 1710, udp: 410 },
  ];

  return (
    <div className="bg-slate-900/50 border border-slate-800/30 rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Connection Trends</h3>
          <p className="text-xs text-slate-500 mt-1">Real-time sampling every 5 seconds</p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600"></span>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Total</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-400"></span>
            <span className="text-[10px] font-bold text-slate-400 uppercase">TCP</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-slate-500"></span>
            <span className="text-[10px] font-bold text-slate-400 uppercase">UDP</span>
          </div>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="time" stroke="#64748b" />
            <YAxis stroke="#64748b" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
              labelStyle={{ color: '#f1f5f9' }}
            />
            <Line type="monotone" dataKey="total" stroke="#256af4" dot={false} strokeWidth={2} />
            <Line type="monotone" dataKey="tcp" stroke="#60a5fa" dot={false} strokeWidth={2} strokeDasharray="2 2" />
            <Line type="monotone" dataKey="udp" stroke="#64748b" dot={false} strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
