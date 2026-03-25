import React from 'react';
import ConnectionDistribution from '../components/Network/ConnectionDistribution';
import ConnectionMetrics from '../components/Network/ConnectionMetrics';
import ConnectionTrends from '../components/Network/ConnectionTrends';
import ConnectionStats from '../components/Network/ConnectionStats';
import ActivityAndFailures from '../components/Network/ActivityAndFailures';

export default function Connections() {
  return (
    <div className="flex-1 overflow-y-auto bg-slate-950">
      <div className="p-8 space-y-8 max-w-7xl mx-auto">
        {/* Row 1: Distribution + Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7">
            <ConnectionDistribution />
          </div>
          <div className="lg:col-span-5">
            <ConnectionMetrics />
          </div>
        </div>

        {/* Row 2: Connection Trends */}
        <ConnectionTrends />

        {/* Row 3: Stats Cards */}
        <ConnectionStats />

        {/* Row 4: Activity & Failures */}
        <ActivityAndFailures />
      </div>
    </div>
  );
}
