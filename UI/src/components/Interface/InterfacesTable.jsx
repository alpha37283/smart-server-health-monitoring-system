export default function InterfacesTable() {
  const interfaces = [
    { name: 'eth0', desc: 'WAN_PRIMARY', status: 'UP', statusColor: 'emerald', speed: '1000 Mbps', mtu: 1500, bytesSent: '142.4 MB', bytesRecv: '894.2 MB', packets: '1.4M / 4.8M', utilization: 62.4 },
    { name: 'eth1', desc: 'LAN_OFFICE', status: 'UP', statusColor: 'emerald', speed: '1000 Mbps', mtu: 1500, bytesSent: '32.1 MB', bytesRecv: '14.8 MB', packets: '342K / 189K', utilization: 12.1 },
    { name: 'eth2', desc: 'DMZ_SERVER', status: 'DOWN', statusColor: 'red', speed: '0 Mbps', mtu: 1500, bytesSent: '0 KB', bytesRecv: '0 KB', packets: '0 / 0', utilization: 0.0 },
    { name: 'wlan0', desc: 'WIFI_GUEST', status: 'UP', statusColor: 'emerald', speed: '450 Mbps', mtu: 1500, bytesSent: '892 KB', bytesRecv: '4.1 MB', packets: '12K / 45K', utilization: 4.2 },
  ]

  const getStatusColor = (color) => {
    return color === 'emerald' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
  }

  return (
    <div className="bg-[#151d2a] rounded-lg overflow-hidden border border-slate-700">
      <div className="px-6 py-4 border-b border-slate-700 bg-[#0f1521]">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Active Interfaces</h3>
          <span className="text-[10px] font-mono text-[#256af4] font-bold">TOTAL_INTERFACES: {interfaces.length}</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm" style={{ tableLayout: 'fixed' }}>
          <colgroup>
            <col style={{ width: '18%' }} />
            <col style={{ width: '12%' }} />
            <col style={{ width: '12%' }} />
            <col style={{ width: '12%' }} />
            <col style={{ width: '13%' }} />
            <col style={{ width: '13%' }} />
            <col style={{ width: '10%' }} />
            <col style={{ width: '10%' }} />
          </colgroup>
          <thead>
            <tr className="bg-[#0f1521] border-b border-slate-700">
              <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-500 text-left">Interface</th>
              <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-500 text-center">Status</th>
              <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-500 text-right">Speed</th>
              <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-500 text-right">MTU</th>
              <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-500 text-right">Bytes Sent</th>
              <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-500 text-right">Bytes Recv</th>
              <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-500 text-right">Packets</th>
              <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-500 text-right">Utilization</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {interfaces.map((iface) => (
              <tr key={iface.name} className="hover:bg-slate-800/30 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-bold text-slate-100">{iface.name}</div>
                  <div className="text-[10px] text-slate-500 font-normal">{iface.desc}</div>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${getStatusColor(iface.statusColor)}`}>
                    {iface.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right font-mono text-slate-300 text-sm">{iface.speed}</td>
                <td className="px-6 py-4 text-right font-mono text-slate-300 text-sm">{iface.mtu}</td>
                <td className="px-6 py-4 text-right font-mono text-slate-300 text-sm">{iface.bytesSent}</td>
                <td className="px-6 py-4 text-right font-mono text-slate-300 text-sm">{iface.bytesRecv}</td>
                <td className="px-6 py-4 text-right font-mono text-slate-300 text-sm">{iface.packets}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <span className="text-[11px] font-bold text-[#256af4]">{iface.utilization}%</span>
                    <div className="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                      <div className="bg-[#256af4] h-full" style={{ width: `${iface.utilization}%` }}></div>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
