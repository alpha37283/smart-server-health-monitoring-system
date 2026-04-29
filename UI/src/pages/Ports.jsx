import React from 'react';
import PortSummaryCards from '../components/Ports/PortSummaryCards';
import TopProcessesCharts from '../components/Ports/TopProcessesCharts';
import ProcessDetailsTable from '../components/Ports/ProcessDetailsTable';

export default function Ports() {
  return (
    <div className="flex-1 overflow-y-auto bg-[#101622]">
      <div className="p-8 min-h-[calc(100vh-64px)] overflow-y-auto">
        <div className="max-w-[1400px] mx-auto">
          <PortSummaryCards />
          <TopProcessesCharts />
          <ProcessDetailsTable />
        </div>
      </div>
    </div>
  );
}