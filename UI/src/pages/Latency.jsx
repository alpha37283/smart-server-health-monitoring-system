import React from 'react';
import LatencyMetricCard from '../components/Latency/LatencyMetricCard';
import LatencyTable from '../components/Latency/LatencyTable';
import LatencyTrends from '../components/Latency/LatencyTrends';

export default function Latency() {
  return (
    <div className="flex-1 overflow-y-auto bg-[#101622]">
      <div className="p-8 min-h-[calc(100vh-64px)] overflow-y-auto">
        <div className="max-w-[1400px] mx-auto space-y-6">
          <div className="grid grid-cols-4 gap-6">
            <LatencyMetricCard
              label="Average Latency"
              value="12.4"
              unit="MS"
              trend="21% FROM LAST HOUR"
              trendColor="text-emerald-500"
              trendIcon="trending_down"
              borderColor="border-[#256af4]"
            />
            <LatencyMetricCard
              label="Min Latency"
              value="4.8"
              unit="MS"
              trend="STABLE OVER 24H"
              trendColor="text-slate-500"
              trendIcon="horizontal_rule"
              borderColor="border-emerald-500"
            />
            <LatencyMetricCard
              label="Max Latency"
              value="84.2"
              unit="MS"
              trend="SPIKE DETECTED 14M AGO"
              trendColor="text-red-500"
              trendIcon="trending_up"
              borderColor="border-red-500"
            />
            <LatencyMetricCard
              label="Avg Handshake Time"
              value="242"
              unit="MS"
              trend="TCP/TLS OVERHEAD OPTIMAL"
              trendColor="text-amber-500"
              trendIcon="schedule"
              borderColor="border-amber-500"
            />
          </div>

          <LatencyTable />

          <LatencyTrends />
        </div>
      </div>
    </div>
  );
}
