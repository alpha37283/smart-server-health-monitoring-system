import React from 'react';
import { Wifi, Battery, Bell } from 'lucide-react';

export default function Header({ timeRange, setTimeRange }) {
  return (
    <header className="h-16 border-b border-slate-800 flex items-center justify-between px-8 bg-slate-900 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <h1 className="text-sm font-bold tracking-tight text-slate-400">
          <span className="text-blue-400">SysMonitor</span> / machine_01{' '}
          <span className="text-xs font-normal opacity-60">(v2.4.5)</span>
        </h1>
        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-500/20 text-green-500 uppercase tracking-wider">
          Stable
        </span>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700">
          <Wifi size={16} className="text-green-500" />
          <span className="text-xs font-medium">Connected</span>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700">
          <Battery size={16} className="text-blue-400" />
          <span className="text-xs font-medium">85%</span>
        </div>

        <button className="size-9 flex items-center justify-center rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 transition-colors">
          <Bell size={18} />
        </button>
      </div>
    </header>
  );
}
