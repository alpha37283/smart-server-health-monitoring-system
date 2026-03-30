'use client'

import { useState } from 'react'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import LatencyMetricCard from '@/components/LatencyMetricCard'
import LatencyTable from '@/components/LatencyTable'
import LatencyTrends from '@/components/LatencyTrends'

export default function LatencyPage() {
  const [activeSidebar, setActiveSidebar] = useState('latency')

  return (
    <div className="flex h-screen bg-[#101622]">
      <Sidebar activeSidebar={activeSidebar} setActiveSidebar={setActiveSidebar} />

      {/* Main Content */}
      <div className="ml-64 w-full">
        <Header />

        {/* Main Content Area */}
        <main className="p-8 min-h-[calc(100vh-64px)] overflow-y-auto">
          <div className="max-w-[1400px] mx-auto space-y-6">
            {/* Row 1: Latency Metric Cards */}
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

            {/* Row 2: Target-Wise Latency Table */}
            <LatencyTable />

            {/* Row 3: Latency Trends */}
            <LatencyTrends />
          </div>
        </main>
      </div>

      <style jsx>{`
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: #101622;
        }
        ::-webkit-scrollbar-thumb {
          background: #334155;
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #475569;
        }
      `}</style>
    </div>
  )
}
