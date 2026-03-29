'use client'

import { useState } from 'react'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import MetricCard from '@/components/MetricCard'
import ChartCard from '@/components/ChartCard'
import PacketCard from '@/components/PacketCard'
import BandwidthCard from '@/components/BandwidthCard'

export default function TrafficAnalysis() {
  const [activeSidebar, setActiveSidebar] = useState('traffic')

  return (
    <div className="flex h-screen bg-[#101622]">
      <Sidebar activeSidebar={activeSidebar} setActiveSidebar={setActiveSidebar} />

      {/* Main Content */}
      <div className="ml-64 w-full">
        <Header />

        {/* Main Content Area */}
        <main className="p-8 min-h-[calc(100vh-64px)] overflow-y-auto">
          <div className="max-w-[1400px] mx-auto space-y-6">
            {/* Row 1: Metric Cards */}
            <div className="grid grid-cols-4 gap-6">
              <MetricCard label="Bytes Sent" value="1.42" unit="GB" trend="+12% vs. PREV HOUR" trendColor="text-emerald-500" trendIcon="trending_up" />
              <MetricCard label="Bytes Received" value="8.65" unit="GB" trend="STABLE FLOW" trendColor="text-slate-500" trendIcon="horizontal_rule" />
              <MetricCard label="Packets Sent" value="124" unit="K" trend="-4% DROPPED" trendColor="text-red-500" trendIcon="trending_down" />
              <MetricCard label="Packets Received" value="942" unit="K" trend="99.9% INTEGRITY" trendColor="text-emerald-500" trendIcon="check_circle" />
            </div>

            {/* Row 2: Send/Receive Rate (Bytes) */}
            <div className="grid grid-cols-2 gap-6">
              <ChartCard 
                title="Send Rate (Bytes/sec)" 
                value="2.4" 
                unit="MB/s"
                unitToggle="MB/S"
                chartPath="M0 80 Q 50 75, 100 85 T 200 60 T 300 70 T 400 30" 
              />
              <ChartCard 
                title="Receive Rate (Bytes/sec)" 
                value="14.8" 
                unit="MB/s"
                unitToggle="MB/S"
                chartPath="M0 40 Q 50 45, 100 30 T 200 70 T 300 50 T 400 10" 
              />
            </div>

            {/* Row 3: Send/Receive Rate (Packets) */}
            <div className="grid grid-cols-2 gap-6">
              <PacketCard 
                title="Send Rate (Packets/sec)" 
                value="412" 
                unit="PPS"
                icon="outbox"
                chartPath="M0 60 L 20 65 L 40 50 L 60 70 L 80 55 L 100 62 L 120 45 L 140 58 L 160 30 L 180 40 L 200 35 L 220 50 L 240 45 L 260 55 L 280 40 L 300 30 L 320 25 L 340 35 L 360 40 L 380 30 L 400 35" 
              />
              <PacketCard 
                title="Receive Rate (Packets/sec)" 
                value="2,108" 
                unit="PPS"
                icon="inbox"
                chartPath="M0 80 L 20 75 L 40 85 L 60 70 L 80 65 L 100 72 L 120 65 L 140 78 L 160 50 L 180 60 L 200 55 L 220 70 L 240 65 L 260 75 L 280 60 L 300 50 L 320 45 L 340 55 L 360 60 L 380 50 L 400 55" 
              />
            </div>

            {/* Row 4: Bandwidth Utilization */}
            <BandwidthCard />
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
