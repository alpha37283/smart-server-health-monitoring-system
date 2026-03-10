import React, { useState } from 'react';
import MemoryMetricsCards from '../components/Memory/MemoryMetricsCards';
import MemoryUsageChart from '../components/Memory/MemoryUsageChart';
import MemoryComposition from '../components/Memory/MemoryComposition';
import SwapIOActivity from '../components/Memory/SwapIOActivity';
import SwapUsageGauge from '../components/Memory/SwapUsageGauge';
import MajorPageFaults from '../components/Memory/MajorPageFaults';

export default function Memory() {
  const [timeRange, setTimeRange] = useState('1h');

  return (
    <div className="flex-1 overflow-y-auto bg-slate-950">
      {/* Metrics Cards */}
      <div className="p-8 space-y-6">
        <MemoryMetricsCards />
        
        {/* Memory Usage Over Time */}
        <MemoryUsageChart timeRange={timeRange} setTimeRange={setTimeRange} />
        
        {/* Memory Composition */}
        <MemoryComposition />
        
        {/* Swap Activity */}
        <SwapIOActivity />
        
        {/* Pressure Indicators Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SwapUsageGauge />
          <MajorPageFaults />
        </div>
      </div>
    </div>
  );
}
