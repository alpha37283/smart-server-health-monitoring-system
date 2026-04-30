export default function TopProcessesChart() {
  const processes = [
    { name: 'nginx_main', pid: 1204, connections: 428, width: 85 },
    { name: 'node_api_srv', pid: 3491, connections: 212, width: 45 },
    { name: 'postgres_db', pid: 882, connections: 184, width: 38 },
    { name: 'redis-server', pid: 771, connections: 122, width: 25 },
  ]

  return (
    <div className="bg-[#0f1521] rounded p-6 mb-6 border border-slate-800/50">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-sm font-bold text-white uppercase tracking-widest">Top Processes by Connections</h3>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-[#256af4] rounded-sm"></div>
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">TCP CONNS</span>
        </div>
      </div>

      <div className="space-y-6">
        {processes.map((proc, idx) => (
          <div key={idx} className="space-y-2">
            <div className="flex justify-between text-[10px] font-bold text-slate-500 tracking-widest uppercase">
              <span>{proc.name} (PID: {proc.pid})</span>
              <span className="text-white">{proc.connections} Connections</span>
            </div>
            <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
              <div className="h-full bg-[#256af4] rounded-full" style={{ width: `${proc.width}%` }}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
