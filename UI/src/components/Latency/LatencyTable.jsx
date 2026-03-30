export default function LatencyTable() {
  const targets = [
    {
      name: 'edge-us-east-01',
      ip: '104.22.14.221',
      icon: 'public',
      latency: '14.2ms',
      latencyColor: 'text-emerald-500',
      handshake: '210ms',
      status: 'HEALTHY',
      statusColor: 'bg-emerald-500/20 text-emerald-500'
    },
    {
      name: 'aws-internal-vpc',
      ip: '172.31.42.10',
      icon: 'cloud',
      latency: '2.1ms',
      latencyColor: 'text-emerald-500',
      handshake: '42ms',
      status: 'HEALTHY',
      statusColor: 'bg-emerald-500/20 text-emerald-500'
    },
    {
      name: 'cdn-pop-frankfurt',
      ip: '185.11.124.8',
      icon: 'router',
      latency: '312.4ms',
      latencyColor: 'text-red-500',
      handshake: '--',
      status: 'UNREACHABLE',
      statusColor: 'bg-red-500/20 text-red-500'
    },
    {
      name: 'db-master-replica-01',
      ip: '10.0.4.52',
      icon: 'storage',
      latency: '0.8ms',
      latencyColor: 'text-emerald-500',
      handshake: '12ms',
      status: 'HEALTHY',
      statusColor: 'bg-emerald-500/20 text-emerald-500'
    }
  ]

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
  )
}
