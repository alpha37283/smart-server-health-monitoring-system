const PLACEHOLDER_ROW = [
  {
    name: 'Waiting for metrics',
    ip: '—',
    icon: 'hourglass_empty',
    latency: '—',
    latencyColor: 'text-slate-500',
    handshake: '—',
    status: '—',
    statusColor: 'bg-slate-500/20 text-slate-500',
  },
];

export default function LatencyTable({ rows }) {
  const targets = rows && rows.length > 0 ? rows : PLACEHOLDER_ROW;

  return (
    <div className="bg-[#1a2332] rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white">Target-Wise Latency</h3>
        <button className="px-4 py-2 text-sm font-medium text-slate-400 border border-slate-700 rounded hover:bg-slate-800 transition-colors">
          EXPORT CSV
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase">Name</th>
              <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase">Latency (ms)</th>
              <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase">Handshake Time (ms)</th>
              <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody>
            {targets.map((target, idx) => (
              <tr key={idx} className="border-b border-slate-800 hover:bg-[#141b27] transition-colors">
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
                      <span className="material-symbols-outlined text-sm">{target.icon}</span>
                    </div>
                    <div>
                      <div className="font-semibold text-slate-100">{target.name}</div>
                      <div className="text-xs text-slate-500">{target.ip}</div>
                    </div>
                  </div>
                </td>
                <td className={`px-4 py-4 font-mono font-semibold ${target.latencyColor}`}>
                  {target.latency}
                </td>
                <td className="px-4 py-4 font-mono text-slate-300">
                  {target.handshake}
                </td>
                <td className="px-4 py-4">
                  <span className={`px-3 py-1 rounded text-xs font-bold ${target.statusColor}`}>
                    {target.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
