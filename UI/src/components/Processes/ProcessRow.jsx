import React from 'react';

export default function ProcessRow({ process, getStatusColor }) {
  const cpuColor = process.cpu > 50 ? 'text-red-400' : process.cpu > 20 ? 'text-amber-400' : 'text-slate-100';
  const memoryColor = process.memory > 50 ? 'text-red-400' : process.memory > 20 ? 'text-amber-400' : 'text-slate-100';

  return (
    <tr className="hover:bg-slate-800/40 transition-colors">
      <td className="px-8 py-4 font-mono text-xs text-slate-400">{process.pid}</td>
      <td className="px-6 py-4 font-semibold text-slate-100">{process.name}</td>
      <td className="px-6 py-4">
        <div className="flex flex-col items-end gap-1">
          <span className={`text-xs font-bold ${cpuColor}`}>{process.cpu.toFixed(1)}%</span>
          <div className="w-24 h-1.5 bg-slate-700 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all ${
                process.cpu > 50 ? 'bg-red-500' : process.cpu > 20 ? 'bg-amber-500' : 'bg-primary'
              }`}
              style={{ width: `${Math.min(process.cpu, 100)}%` }}
            ></div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex flex-col items-end gap-1">
          <span className={`text-xs font-bold ${memoryColor}`}>{process.memory.toFixed(1)}%</span>
          <div className="w-24 h-1.5 bg-slate-700 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all ${
                process.memory > 50 ? 'bg-red-500' : process.memory > 20 ? 'bg-amber-500' : 'bg-primary'
              }`}
              style={{ width: `${Math.min(process.memory, 100)}%` }}
            ></div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 text-right font-mono text-slate-300">{process.memMB.toLocaleString()}</td>
      <td className="px-6 py-4 text-right text-slate-400">{process.threads}</td>
      <td className="px-6 py-4">
        <span className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold border border-current ${getStatusColor(process.status)}`}>
          {process.status}
        </span>
      </td>
      <td className="px-8 py-4 text-right font-mono text-slate-400">{process.uptime}</td>
    </tr>
  );
}
