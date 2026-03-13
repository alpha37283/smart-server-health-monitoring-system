import React from 'react';
import ProcessRow from './ProcessRow';

export default function ProcessTable({
  processes,
  searchTerm,
  setSearchTerm,
  currentPage,
  totalPages,
  setCurrentPage,
  totalProcesses,
}) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'RUNNING':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'SLEEPING':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'ZOMBIE':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'STOPPED':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-lg overflow-hidden">
      {/* Header with Search */}
      <div className="px-8 py-6 border-b border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-100">Process Management</h2>
          <p className="text-xs text-slate-400">Real-time update active • Next refresh in 3s</p>
        </div>
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Search PID or process name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-800/50 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">🔍</span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-800/30 border-b border-slate-700">
              <th className="px-8 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">PID</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Process Name</th>
              <th className="px-6 py-4 text-right text-xs font-bold text-slate-400 uppercase tracking-wider">CPU %</th>
              <th className="px-6 py-4 text-right text-xs font-bold text-slate-400 uppercase tracking-wider">Memory %</th>
              <th className="px-6 py-4 text-right text-xs font-bold text-slate-400 uppercase tracking-wider">Mem (MB)</th>
              <th className="px-6 py-4 text-right text-xs font-bold text-slate-400 uppercase tracking-wider">Threads</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
              <th className="px-8 py-4 text-right text-xs font-bold text-slate-400 uppercase tracking-wider">Uptime</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {processes.map((process) => (
              <ProcessRow key={process.pid} process={process} getStatusColor={getStatusColor} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="px-8 py-4 border-t border-slate-700 bg-slate-800/20 flex justify-between items-center">
        <span className="text-xs text-slate-400">
          Showing {processes.length} of {totalProcesses} processes
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="p-1 hover:bg-slate-700 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            ◀
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 text-xs font-bold rounded transition-colors ${
                currentPage === page
                  ? 'bg-primary/20 text-primary'
                  : 'hover:bg-slate-700 text-slate-400'
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="p-1 hover:bg-slate-700 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            ▶
          </button>
        </div>
      </div>
    </div>
  );
}
