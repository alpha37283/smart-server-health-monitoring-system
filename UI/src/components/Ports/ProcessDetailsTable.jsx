import React, { useState } from 'react'

export default function ProcessDetailsTable() {
  const [expandedRows, setExpandedRows] = useState({})

  const processes = [
    { name: 'nginx.worker', pid: 14201, totalConn: 8122, established: 7820, listen: 42, other: 260, bindPort: '80, 443', status: 'ACTIVE', throughput: '1.2 GB/s', errorRate: '0.002%' },
    { name: 'postgresql.service', pid: 882, totalConn: 6431, established: 6100, listen: 1, other: 330, bindPort: '5432', status: 'ACTIVE', throughput: '850 MB/s', errorRate: '0.005%' },
    { name: 'redis-server', pid: 1204, totalConn: 4209, established: 4150, listen: 1, other: 58, bindPort: '6379', status: 'ACTIVE', throughput: '450 MB/s', errorRate: '0.001%' },
  ]

  const toggleExpand = (idx) => {
    setExpandedRows(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }))
  }

  return (
    <div className="bg-[#1a2332] border border-slate-800/50 rounded overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-800 bg-[#151d2a]">
        <h4 className="text-sm font-bold uppercase tracking-widest text-slate-100">Process Connection Details</h4>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse" style={{ tableLayout: 'fixed' }}>
          <colgroup>
            <col style={{ width: '35%' }} />
            <col style={{ width: '13%' }} />
            <col style={{ width: '17%' }} />
            <col style={{ width: '17%' }} />
            <col style={{ width: '18%' }} />
          </colgroup>
          <thead>
            <tr className="bg-[#0f1521] border-b border-slate-800">
              <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-500">Process Name</th>
              <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-500">PID</th>
              <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-500">Total Conn</th>
              <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-500">Established</th>
              <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-500">Listen</th>
            </tr>
          </thead>
          <tbody>
            {processes.map((proc, idx) => (
              <React.Fragment key={idx}>
                <tr className="hover:bg-slate-900/40 transition-colors border-b border-slate-800">
                  <td className="px-6 py-4 overflow-hidden">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-slate-400 text-sm flex-shrink-0">dns</span>
                      <span className="text-xs font-bold text-slate-200 truncate">{proc.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs font-mono text-slate-400">{proc.pid}</td>
                  <td className="px-6 py-4 text-xs font-bold text-slate-100">{proc.totalConn.toLocaleString()}</td>
                  <td className="px-6 py-4 text-xs text-emerald-500">{proc.established.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs text-slate-400">{proc.listen}</span>
                      <button onClick={() => toggleExpand(idx)} className="text-slate-500 hover:text-[#256af4] transition-colors flex-shrink-0">
                        <span className="material-symbols-outlined text-sm">
                          {expandedRows[idx] ? 'expand_less' : 'expand_more'}
                        </span>
                      </button>
                    </div>
                  </td>
                </tr>
                {expandedRows[idx] && (
                  <tr className="bg-[#0f1521]/50 border-b border-slate-800">
                    <td colSpan="5" className="px-6 py-4">
                      <div className="grid grid-cols-4 gap-4 p-4 border border-slate-800 rounded bg-[#0f1521]">
                        <div>
                          <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest mb-1">Bind Port</p>
                          <p className="text-xs font-mono text-[#256af4]">{proc.bindPort}</p>
                        </div>
                        <div>
                          <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest mb-1">Status</p>
                          <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 inline-block rounded uppercase tracking-widest">{proc.status}</span>
                        </div>
                        <div>
                          <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest mb-1">Throughput (OUT)</p>
                          <p className="text-xs font-mono text-slate-300">{proc.throughput}</p>
                        </div>
                        <div>
                          <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest mb-1">Error Rate</p>
                          <p className="text-xs font-mono text-slate-300">{proc.errorRate}</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
