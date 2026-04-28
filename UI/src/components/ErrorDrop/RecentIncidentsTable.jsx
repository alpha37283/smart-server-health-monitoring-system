const incidents = [
  { timestamp: '2023-10-24 14:22:15', interface: 'eth0', type: 'CRC Error', severity: 'CRITICAL', severityColor: 'text-red-500', sourceIp: '192.168.1.104', packets: 128 },
  { timestamp: '2023-10-24 14:18:02', interface: 'eth0', type: 'Rx Drop', severity: 'WARNING', severityColor: 'text-amber-500', sourceIp: '10.0.0.15', packets: 12 },
  { timestamp: '2023-10-24 13:45:55', interface: 'eth0', type: 'CRC Error', severity: 'CRITICAL', severityColor: 'text-red-500', sourceIp: '192.168.1.104', packets: 256 },
]

export default function RecentIncidentsTable() {
  return (
    <div className="bg-[#141b2a] border border-slate-800 rounded-xl overflow-hidden">
      <div className="bg-[#1a2332] px-6 py-4 border-b border-slate-800">
        <h2 className="font-bold text-sm tracking-tight">RECENT DROP INCIDENTS</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="text-slate-500 border-b border-slate-800 uppercase tracking-wider font-bold">
              <th className="px-6 py-4">Timestamp</th>
              <th className="px-6 py-4">Interface</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Severity</th>
              <th className="px-6 py-4">Source IP (Likely)</th>
              <th className="px-6 py-4 text-right">Packets</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {incidents.map((incident, idx) => (
              <tr key={idx} className="hover:bg-[#1a2332] transition-colors group">
                <td className="px-6 py-4 text-slate-300">{incident.timestamp}</td>
                <td className="px-6 py-4 text-slate-300">{incident.interface}</td>
                <td className="px-6 py-4 text-slate-300">{incident.type}</td>
                <td className={`px-6 py-4 font-bold ${incident.severityColor}`}>{incident.severity}</td>
                <td className="px-6 py-4 text-slate-400">{incident.sourceIp}</td>
                <td className="px-6 py-4 text-right text-slate-100 font-semibold">{incident.packets}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="bg-[#1a2332] px-6 py-4 border-t border-slate-800 text-center">
        <button className="text-[#256af4] hover:text-[#60a5fa] text-xs font-bold uppercase tracking-wider transition-colors">
          View All Network Logs
        </button>
      </div>
    </div>
  )
}
