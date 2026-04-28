import React, { useState } from 'react';
import Sidebar from './components/CPU/Sidebar';
import Header from './components/CPU/Header';
import CPU from './pages/CPU';
import Memory from './pages/Memory';
import Disk from './pages/Disk';
import Processes from './pages/Processes';
import Connections from './pages/Connections';
import Traffic from './pages/Traffic';
import Latency from './pages/Latency';
import ErrorDrop from './pages/ErrorDrop';

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
            <CPU
              timeRange={timeRange}
              setTimeRange={setTimeRange}
            />
          )}

          {activeNav === 'Memory' && <Memory />}

          {activeNav === 'Disk' && <Disk />}

          {activeNav === 'Processes' && <Processes />}

          {activeNav === 'Connections' && <Connections />}

          {activeNav === 'TrafficAnalysis' && <Traffic />}

          {activeNav === 'Latency' && <Latency />}

          {activeNav === 'ErrorDrop' && <ErrorDrop />}
        </main>
      </div>
    </div>
  );
}
