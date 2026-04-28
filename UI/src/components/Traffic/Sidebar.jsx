export default function Sidebar({ activeSidebar, setActiveSidebar }) {
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-[#101622] border-r border-slate-800 flex flex-col py-0 z-20">
      {/* User Profile */}
      <div className="p-6 flex items-center gap-3">
        <div className="size-10 rounded-full bg-[#256af4] flex items-center justify-center overflow-hidden border-2 border-[#256af4]/20">
          <span className="text-white font-bold">A</span>
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-slate-100">Admin</span>
          <span className="text-xs text-slate-500">SysAdmin</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
        {/* System Group */}
        <div className="mb-4">
          <button onClick={() => setActiveSidebar('system')} className="w-full flex items-center gap-3 px-3 py-2 rounded text-slate-400 hover:bg-slate-800 cursor-pointer mb-1 transition-colors">
            <span className="material-symbols-outlined">developer_board</span>
            <span className="text-sm font-medium">System</span>
            <span className="material-symbols-outlined ml-auto text-sm">keyboard_arrow_right</span>
          </button>
        </div>

        {/* Network Group */}
        <div className="mb-4">
          <div className="flex items-center gap-3 px-3 py-2 rounded bg-[#256af4]/10 text-[#256af4] cursor-pointer mb-1">
            <span className="material-symbols-outlined">public</span>
            <span className="text-sm font-medium">Network</span>
            <span className="material-symbols-outlined ml-auto text-sm">keyboard_arrow_down</span>
          </div>
          <div className="pl-9 space-y-1">
            <button onClick={() => setActiveSidebar('connections')} className="flex items-center gap-3 px-3 py-2 rounded text-slate-400 hover:bg-slate-800 text-sm font-medium transition-colors w-full text-left">
              <span className="material-symbols-outlined text-sm">lan</span>
              Connections
            </button>
            <button onClick={() => setActiveSidebar('traffic')} className="flex items-center gap-3 px-3 py-2 rounded bg-[#256af4] text-white text-sm font-medium w-full text-left">
              <span className="material-symbols-outlined text-sm">speed</span>
              Traffic Analysis
            </button>
          </div>
        </div>


        <button onClick={() => setActiveSidebar('errorDrop')} className={`flex items-center gap-3 px-3 py-2 rounded text-sm font-medium w-full text-left transition-colors ${activeSidebar === 'errorDrop' ? 'bg-[#256af4] text-white' : 'text-slate-400 hover:bg-slate-800'}`}>
              <span className="material-symbols-outlined text-sm">error_outline</span>
              Error & Drop
        </button>

        {/* Other Options */}
        <button onClick={() => setActiveSidebar('security')} className="flex items-center gap-3 px-3 py-2 rounded text-slate-400 hover:bg-slate-800 text-sm font-medium transition-colors w-full text-left">
          <span className="material-symbols-outlined">shield</span>
          Security
        </button>
        <button onClick={() => setActiveSidebar('logs')} className="flex items-center gap-3 px-3 py-2 rounded text-slate-400 hover:bg-slate-800 text-sm font-medium transition-colors w-full text-left">
          <span className="material-symbols-outlined">description</span>
          Logs
        </button>
        <button onClick={() => setActiveSidebar('settings')} className="flex items-center gap-3 px-3 py-2 rounded text-slate-400 hover:bg-slate-800 text-sm font-medium transition-colors w-full text-left">
          <span className="material-symbols-outlined">settings</span>
          Settings
        </button>
      </nav>

      {/* Uptime Indicator */}
      <div className="p-4 border-t border-slate-800">
        <div className="bg-[#256af4]/5 rounded p-3 text-xs text-slate-500">
          <div className="flex justify-between mb-1">
            <span>Uptime</span>
            <span className="text-slate-200">99.9%</span>
          </div>
          <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
            <div className="bg-[#256af4] h-1 rounded-full w-[99.9%]"></div>
          </div>
        </div>
      </div>
    </aside>
  )
}
