import { useState, useEffect, useMemo } from 'react'

const PAGE_SIZE = 5

const DEFAULT_PROCESSES = [
  { pid: 1204, name: 'nginx_main', established: 380, listen: 40, other: 8, total: 428, ports: [80, 443, 8080, 8443] },
  { pid: 3491, name: 'node_api_srv', established: 190, listen: 15, other: 7, total: 212, ports: [3000, 3001, 5000, 5173] },
  { pid: 882, name: 'postgres_db', established: 175, listen: 5, other: 4, total: 184, ports: [5432, 5433, 6432] },
  { pid: 771, name: 'redis-server', established: 110, listen: 10, other: 2, total: 122, ports: [6379, 6380] },
  { pid: 562, name: 'ssh_agent', established: 12, listen: 2, other: 0, total: 14, ports: [22, 2222] },
];

export default function ProcessTable({ processes = DEFAULT_PROCESSES, totalProcesses = 248 }) {
  const [expandedRows, setExpandedRows] = useState({})
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.max(1, Math.ceil(processes.length / PAGE_SIZE))
  const startIndex = (currentPage - 1) * PAGE_SIZE
  const pageRows = useMemo(
    () => processes.slice(startIndex, startIndex + PAGE_SIZE),
    [processes, startIndex]
  )

  useEffect(() => {
    setCurrentPage((p) => {
      if (processes.length === 0) return 1
      const maxPage = Math.max(1, Math.ceil(processes.length / PAGE_SIZE))
      return Math.min(p, maxPage)
    })
  }, [processes.length])

  const toggleExpand = (pid) => {
    setExpandedRows((prev) => ({
      ...prev,
      [pid]: !prev[pid],
    }))
  }

  const goPrev = () => setCurrentPage((p) => Math.max(1, p - 1))
  const goNext = () => setCurrentPage((p) => Math.min(totalPages, p + 1))
  const showingFrom = processes.length === 0 ? 0 : startIndex + 1
  const showingTo = Math.min(startIndex + pageRows.length, processes.length)

  return (
    <div className="bg-[#0f1521] rounded overflow-hidden border border-slate-800/50">
      {/* Toolbar */}
      <div className="p-4 border-b border-slate-800 flex gap-4 items-center justify-between flex-wrap">
        <div className="relative flex-1 min-w-[300px]">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">search</span>
          <input
            className="w-full bg-slate-900 border border-slate-800 rounded py-2 pl-10 text-[10px] text-white tracking-widest font-bold placeholder:text-slate-600 focus:ring-1 focus:ring-[#256af4]"
            placeholder="SEARCH PROCESSES, PORTS, OR IP ADDRESSES..."
            type="text"
          />
        </div>
        <div className="flex gap-2">
          <button className="bg-slate-800 border border-slate-700 px-4 py-2 rounded text-[10px] font-bold text-white tracking-widest hover:bg-slate-700 flex items-center gap-2 transition-colors">
            <span className="material-symbols-outlined text-sm">filter_list</span> FILTER
          </button>
          <button className="bg-[#256af4] px-4 py-2 rounded text-[10px] font-bold text-white tracking-widest hover:brightness-110 flex items-center gap-2 transition-colors">
            <span className="material-symbols-outlined text-sm">refresh</span> REFRESH
          </button>
        </div>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-12 px-6 py-4 bg-slate-900/30 border-b border-slate-800 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
        <div className="col-span-1">PID</div>
        <div className="col-span-3">Process Name</div>
        <div className="col-span-2 text-center">Established</div>
        <div className="col-span-2 text-center">Listen</div>
        <div className="col-span-2 text-center">Total Connections</div>
        <div className="col-span-2"></div>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-slate-800">
        {pageRows.map((proc) => (
          <div key={proc.pid} className="group">
            <div className="grid grid-cols-12 px-6 py-4 items-center text-xs hover:bg-slate-800/20 transition-colors cursor-pointer">
              <div className="col-span-1 font-mono text-slate-400">{proc.pid}</div>
              <div className="col-span-3 font-bold text-white">{proc.name}</div>
              <div className="col-span-2 text-center font-bold text-white">{proc.established}</div>
              <div className="col-span-2 text-center font-bold text-white">{proc.listen}</div>
              <div className="col-span-2 text-center font-bold text-white">{proc.total}</div>
              <div className="col-span-2 text-right">
                <button
                  onClick={() => toggleExpand(proc.pid)}
                  className="text-slate-600 hover:text-white transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">
                    {expandedRows[proc.pid] ? 'expand_less' : 'expand_more'}
                  </span>
                </button>
              </div>
            </div>

            {expandedRows[proc.pid] && (
              <div className="bg-slate-900/20 px-6 py-4 border-t border-slate-800">
                <div className="text-xs">
                  <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-3">Ports</p>
                  <div className="flex flex-wrap gap-2">
                    {proc.ports.map((port) => (
                      <span
                        key={`${proc.pid}-${port}`}
                        className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-slate-200 font-mono text-[11px]"
                      >
                        {port}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 border-t border-slate-800 flex items-center justify-between">
        <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Showing {showingFrom}-{showingTo} of {totalProcesses} Processes</span>
        <div className="flex gap-1">
          <button
            onClick={goPrev}
            disabled={currentPage === 1}
            className={`bg-slate-800 px-2 py-1 rounded text-[10px] transition-colors ${
              currentPage === 1 ? 'text-slate-600 cursor-not-allowed' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-sm">navigate_before</span>
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              onClick={() => setCurrentPage(num)}
              className={`px-3 py-1 rounded text-[10px] font-bold transition-colors ${
                num === currentPage
                  ? 'bg-[#256af4] text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {num}
            </button>
          ))}
          <button
            onClick={goNext}
            disabled={currentPage === totalPages}
            className={`bg-slate-800 px-2 py-1 rounded text-[10px] transition-colors ${
              currentPage === totalPages ? 'text-slate-600 cursor-not-allowed' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-sm">navigate_next</span>
          </button>
        </div>
      </div>
    </div>
  )
}
