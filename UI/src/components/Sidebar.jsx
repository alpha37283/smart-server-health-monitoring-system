import React from 'react';
import {
  Settings,
  Shield,
  FileText,
  Grid3X3,
  Network,
  HardDrive,
  Zap,
} from 'lucide-react';

export default function Sidebar({ activeNav, setActiveNav }) {
  const navItems = [
    { id: 'CPU', label: 'CPU', icon: Zap },
    { id: 'Memory', label: 'Memory', icon: Grid3X3 },
    { id: 'Disk', label: 'Disk', icon: HardDrive },
    { id: 'Processes', label: 'Processes', icon: FileText },
  ];

  const mainItems = [
    { id: 'Network', label: 'Network', icon: Network },
    { id: 'Security', label: 'Security', icon: Shield },
    { id: 'Settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 border-r border-slate-800 flex flex-col bg-slate-900 h-screen sticky top-0">
      {/* Profile Section */}
      <div className="p-6 flex items-center gap-3 border-b border-slate-800">
        <div className="size-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
          A
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold">Admin</span>
          <span className="text-xs text-slate-400">SysAdmin</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
        {/* System Group */}
        <div className="mb-4">
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-blue-600/10 text-blue-400 mb-1">
            <Grid3X3 size={18} />
            <span className="text-sm font-medium">System</span>
          </div>
          <div className="pl-9 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveNav(item.id)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium w-full transition-all ${
                    activeNav === item.id
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <Icon size={16} />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Navigation */}
        {mainItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveNav(item.id)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium w-full transition-all ${
                activeNav === item.id
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              <Icon size={18} />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Uptime Section */}
      <div className="p-4 border-t border-slate-800">
        <div className="bg-blue-600/5 rounded-lg p-3 text-xs text-slate-400">
          <div className="flex justify-between mb-1">
            <span>Uptime</span>
            <span className="text-slate-200">12d 4h 22m</span>
          </div>
          <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
            <div className="bg-blue-600 h-full w-2/3 rounded-full"></div>
          </div>
        </div>
      </div>
    </aside>
  );
}
