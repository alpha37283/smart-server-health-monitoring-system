export default function ErrorDropTrends() {
  return (
    <div className="bg-[#141b2a] border border-slate-800 rounded-xl overflow-hidden">
      <div className="bg-[#1a2332] px-6 py-4 flex justify-between items-center border-b border-slate-800">
        <div>
          <h2 className="font-bold text-sm tracking-tight">ERROR & DROP TRENDS (24H)</h2>
          <p className="text-[10px] text-slate-500 uppercase font-medium">Aggregated data from primary network interface</p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#256af4]"></span>
            <span className="text-[10px] font-bold text-slate-400">INPUT ERRORS</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            <span className="text-[10px] font-bold text-slate-400">INPUT DROPS</span>
          </div>
        </div>
      </div>
      <div className="p-8 h-[360px] relative">
        {/* Chart Container */}
        <div className="absolute inset-x-8 bottom-8 top-16 bg-gradient-to-t from-[#256af4]/10 to-transparent border-b border-l border-slate-800">
          {/* SVG Line Chart */}
          <svg className="w-full h-full" preserveAspectRatio="none">
            {/* Background Fill */}
            <path d="M0,80 Q100,60 200,90 T400,40 T600,100 T800,30 T1000,70 L1000,200 L0,200 Z" fill="rgba(37, 106, 244, 0.1)"></path>
            {/* Input Errors Line (Blue Solid) */}
            <path d="M0,80 Q100,60 200,90 T400,40 T600,100 T800,30 T1000,70" fill="none" stroke="#256af4" strokeWidth="2"></path>
            {/* Input Drops Line (Red Dashed) */}
            <path d="M0,150 Q100,140 200,160 T400,130 T600,170 T800,120 T1000,150" fill="none" stroke="#ef4444" strokeDasharray="4,2" strokeWidth="2"></path>
          </svg>
          {/* Grid Lines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
            <div className="border-t border-slate-600 w-full"></div>
            <div className="border-t border-slate-600 w-full"></div>
            <div className="border-t border-slate-600 w-full"></div>
            <div className="border-t border-slate-600 w-full"></div>
          </div>
        </div>
        {/* Y Axis Labels */}
        <div className="absolute left-2 top-16 bottom-8 flex flex-col justify-between text-[10px] text-slate-500 font-mono">
          <span>2.0k</span>
          <span>1.5k</span>
          <span>1.0k</span>
          <span>0.5k</span>
          <span>0</span>
        </div>
        {/* X Axis Labels */}
        <div className="absolute bottom-2 inset-x-8 flex justify-between text-[10px] text-slate-500 font-mono">
          <span>00:00</span>
          <span>04:00</span>
          <span>08:00</span>
          <span>12:00</span>
          <span>16:00</span>
          <span>20:00</span>
          <span>23:59</span>
        </div>
      </div>
    </div>
  )
}
