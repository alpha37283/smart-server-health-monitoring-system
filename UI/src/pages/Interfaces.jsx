import React from 'react';
import InterfacesTable from '../components/Interface/InterfacesTable';
import UtilizationComparison from '../components/Interface/UtilizationComparison';
import TrafficThroughput from '../components/Interface/TrafficThroughput';

export default function Interfaces() {
  return (
    <div className="flex-1 overflow-y-auto bg-[#101622]">
      <div className="p-8 min-h-[calc(100vh-64px)] overflow-y-auto">
        <div className="max-w-[1400px] mx-auto">
          {/* Network Interfaces Page */}
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-100 mb-1">Network Interfaces</h1>
            <p className="text-slate-500 text-sm">Real-time telemetry for physical and virtual interfaces</p>
            <button className="mt-4 bg-[#1a2332] border border-slate-700 px-4 py-2 text-xs font-bold text-slate-300 hover:bg-[#252d3d] transition-colors rounded">
              REFRESH POOL
            </button>
          </div>

          {/* Interfaces Table */}
          <div className="mb-8">
            <InterfacesTable />
          </div>

          {/* Utilization & Traffic Charts */}
          <div className="grid grid-cols-2 gap-6">
            <UtilizationComparison />
            <TrafficThroughput />
          </div>
        </div>
      </div>
    </div>
  );
}