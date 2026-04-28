export default function ErrorDropBreakdown({
  rxErrors = 0,
  rxDrops = 0,
  txErrors = 0,
  txDrops = 0,
}) {
  const toPct = (n) => `${Math.max(0, Math.min(100, n))}%`;
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Input Errors & Drops (RX) */}
      <div className="bg-[#141b2a] border border-slate-800 rounded-xl overflow-hidden">
        <div className="bg-[#1a2332] p-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#256af4]">arrow_downward</span>
            <span className="font-bold text-sm tracking-tight">INPUT ERRORS & DROPS (RX)</span>
          </div>
          <span className="text-[10px] font-black text-slate-500 px-2 py-0.5 border border-slate-700 rounded">REAL-TIME</span>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-8">
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Total Errors</label>
              <div className="text-3xl font-bold text-slate-100">{Number(rxErrors).toFixed(2)}</div>
              <div className="w-full bg-[#1e2638] h-1 mt-4">
                <div className="bg-red-500 h-full" style={{ width: toPct(rxErrors * 10) }}></div>
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Total Drops</label>
              <div className="text-3xl font-bold text-slate-100">{Number(rxDrops).toFixed(2)}</div>
              <div className="w-full bg-[#1e2638] h-1 mt-4">
                <div className="bg-amber-500 h-full" style={{ width: toPct(rxDrops * 10) }}></div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-800">
            <div>
              <label className="text-[9px] font-bold text-slate-500 uppercase">Overruns</label>
              <div className="text-lg font-bold text-slate-100">0</div>
            </div>
            <div>
              <label className="text-[9px] font-bold text-slate-500 uppercase">Frame</label>
              <div className="text-lg font-bold text-slate-100">89</div>
            </div>
            <div>
              <label className="text-[9px] font-bold text-slate-500 uppercase">CRC Errors</label>
              <div className="text-lg font-bold text-slate-100">1,313</div>
            </div>
          </div>
        </div>
      </div>

      {/* Output Errors & Drops (TX) */}
      <div className="bg-[#141b2a] border border-slate-800 rounded-xl overflow-hidden">
        <div className="bg-[#1a2332] p-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#256af4]">arrow_upward</span>
            <span className="font-bold text-sm tracking-tight">OUTPUT ERRORS & DROPS (TX)</span>
          </div>
          <span className="text-[10px] font-black text-slate-500 px-2 py-0.5 border border-slate-700 rounded">REAL-TIME</span>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-8">
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Total Errors</label>
              <div className="text-3xl font-bold text-slate-100">{Number(txErrors).toFixed(2)}</div>
              <div className="w-full bg-[#1e2638] h-1 mt-4">
                <div className="bg-[#256af4] h-full" style={{ width: toPct(txErrors * 10) }}></div>
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Total Drops</label>
              <div className="text-3xl font-bold text-slate-100">{Number(txDrops).toFixed(2)}</div>
              <div className="w-full bg-[#1e2638] h-1 mt-4">
                <div className="bg-slate-600 h-full" style={{ width: toPct(txDrops * 10) }}></div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-800">
            <div>
              <label className="text-[9px] font-bold text-slate-500 uppercase">Carrier</label>
              <div className="text-lg font-bold text-slate-100">0</div>
            </div>
            <div>
              <label className="text-[9px] font-bold text-slate-500 uppercase">Collisions</label>
              <div className="text-lg font-bold text-slate-100">0</div>
            </div>
            <div>
              <label className="text-[9px] font-bold text-slate-500 uppercase">Aborted</label>
              <div className="text-lg font-bold text-slate-100">0</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
