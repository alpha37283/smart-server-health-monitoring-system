import React from 'react';
import ProcessMetricsCards from '../components/NetworkProcess/ProcessMetricsCards';
import TopProcessesChart from '../components/NetworkProcess/TopProcessesChart';
import ConnectionActivityChart from '../components/NetworkProcess/ConnectionActivityChart';
import ProcessTable from '../components/NetworkProcess/ProcessTable';

export default function NetworkProcesses() {
  return (
    <div className="flex-1 overflow-y-auto bg-[#101622]">
      <div className="p-8 min-h-[calc(100vh-64px)]">
        <div className="max-w-[1400px] mx-auto">
          {/* Network Processes Page */}
          <ProcessMetricsCards />
          <TopProcessesChart />
          <ConnectionActivityChart />
          <ProcessTable />
        </div>
      </div>
    </div>
  );
}