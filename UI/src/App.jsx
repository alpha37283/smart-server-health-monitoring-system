import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import CPUChart from './components/CPUChart';
import PerCoreUsage from './components/PerCoreUsage';
import LoadAverage from './components/LoadAverage';
import TimeBreakdown from './components/TimeBreakdown';
import DetailedMetrics from './components/DetailedMetrics';
import Memory from './pages/Memory';
import Disk from './pages/Disk';

export default function App() {
  const [activeNav, setActiveNav] = useState('CPU');
  const [timeRange, setTimeRange] = useState('Live');

  return (
    <div className="flex h-screen bg-background-dark text-slate-100">
      <Sidebar activeNav={activeNav} setActiveNav={setActiveNav} />
      
      <div className="flex-1 flex flex-col min-w-0">
        <Header timeRange={timeRange} setTimeRange={setTimeRange} />
        
        <main className="flex-1 overflow-y-auto">
          {activeNav === 'CPU' && (
            <div className="p-8 space-y-6">
              {/* CPU Usage Over Time */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">CPU Usage Dashboard</h2>
                  <div className="flex gap-2">
                    {['Live', '1h', '24h'].map((range) => (
                      <button
                        key={range}
                        onClick={() => setTimeRange(range)}
                        className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                          timeRange === range
                            ? 'bg-primary/20 text-primary'
                            : 'hover:bg-slate-800'
                        }`}
                      >
                        {range}
                      </button>
                    ))}
                  </div>
                </div>
                <CPUChart />
              </section>

              {/* Per-Core Usage */}
              <PerCoreUsage />

              {/* Load Average + Time Breakdown */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <LoadAverage />
                </div>
                <TimeBreakdown />
              </div>

              {/* Detailed Metrics */}
              <DetailedMetrics />
            </div>
          )}

          {activeNav === 'Memory' && <Memory />}

          {activeNav === 'Disk' && <Disk />}
        </main>
      </div>
    </div>
  );
}
