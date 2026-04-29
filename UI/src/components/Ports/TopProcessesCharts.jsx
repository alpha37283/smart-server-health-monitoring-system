export default function TopProcessesCharts() {
  const topByConnections = [
    { name: 'nginx.worker', value: 8122, percent: 95 },
    { name: 'postgresql.service', value: 6431, percent: 75 },
    { name: 'redis-server', value: 4209, percent: 50 },
    { name: 'node.exe (backend)', value: 3110, percent: 38 },
    { name: 'ssh.agent', value: 942, percent: 12 },
  ]

  const topByActivity = [
    { name: 'prometheus-collector', value: '14.2k', percent: 88 },
    { name: 'nginx.worker', value: '12.1k', percent: 78 },
    { name: 'influxdb.engine', value: '9.8k', percent: 62 },
    { name: 'logstash.pipeline', value: '4.2k', percent: 30 },
    { name: 'docker-proxy', value: '1.2k', percent: 10 },
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* Top Processes by Connections */}
      <div className="bg-[#1a2332] border border-slate-800/50 rounded p-6">
        <div className="flex justify-between items-center mb-6">
          <h4 className="text-sm font-bold uppercase tracking-widest text-slate-100">Top Processes by Connections</h4>
          <span className="material-symbols-outlined text-slate-500 text-sm">more_vert</span>
        </div>
        <div className="space-y-4">
          {topByConnections.map((proc, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest mb-1">
                <span className="text-slate-300">{proc.name}</span>
                <span className="text-[#256af4]">{proc.value.toLocaleString()}</span>
              </div>
              <div className="h-2 w-full bg-slate-800/50 rounded-sm overflow-hidden">
                <div className="h-full bg-[#256af4] rounded-sm" style={{ width: `${proc.percent}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Processes by Activity */}
      <div className="bg-[#1a2332] border border-slate-800/50 rounded p-6">
        <div className="flex justify-between items-center mb-6">
          <h4 className="text-sm font-bold uppercase tracking-widest text-slate-100">Top Processes by Activity (Req/s)</h4>
          <span className="material-symbols-outlined text-slate-500 text-sm">more_vert</span>
        </div>
        <div className="space-y-4">
          {topByActivity.map((proc, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest mb-1">
                <span className="text-slate-300">{proc.name}</span>
                <span className="text-amber-500">{proc.value}</span>
              </div>
              <div className="h-2 w-full bg-slate-800/50 rounded-sm overflow-hidden">
                <div className="h-full bg-amber-500 rounded-sm" style={{ width: `${proc.percent}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
