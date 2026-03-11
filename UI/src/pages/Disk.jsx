import React, { useState } from 'react';
import DiskMetricsCards from '../components/Disk/DiskMetricsCards';
import DiskDistribution from '../components/Disk/DiskDistribution';
import TransferSpeeds from '../components/Disk/TransferSpeeds';
import ReadWriteOperations from '../components/Disk/ReadWriteOperations';
import QueueLength from '../components/Disk/QueueLength';
import DiskUtilization from '../components/Disk/DiskUtilization';

export default function Disk() {
  const [timeRange, setTimeRange] = useState('Live');

  return (
    <div className="bg-slate-950 min-h-screen">
      <div className="p-8 space-y-6">
        {/* Metrics Cards */}
        <DiskMetricsCards />

        {/* Transfer Speeds + Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <TransferSpeeds />
          </div>
          <DiskDistribution />
        </div>

        {/* Read/Write Operations + Queue Length */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ReadWriteOperations />
          <QueueLength />
        </div>

        {/* Disk Utilization */}
        <DiskUtilization />
      </div>
    </div>
  );
}
