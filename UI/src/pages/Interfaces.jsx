import React, { useEffect, useMemo, useRef, useState } from 'react';
import InterfacesTable from '../components/Interface/InterfacesTable';
import UtilizationComparison from '../components/Interface/UtilizationComparison';
import TrafficThroughput from '../components/Interface/TrafficThroughput';
import { useMetrics } from '../context/MetricsContext';

function formatBytes(bytes) {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 KB';
  if (bytes >= 1024 ** 3) return `${(bytes / 1024 ** 3).toFixed(1)} GB`;
  if (bytes >= 1024 ** 2) return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
  return `${(bytes / 1024).toFixed(1)} KB`;
}

function formatCompact(value) {
  if (!Number.isFinite(value)) return '0';
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return `${Math.round(value)}`;
}

function buildDesc(name) {
  return `IFACE_${String(name || 'UNKNOWN').toUpperCase().replace(/[^A-Z0-9]+/g, '_')}`;
}

export default function Interfaces() {
  const { networkInterfaceMetrics } = useMetrics();
  const liveInterfaces = networkInterfaceMetrics?.data?.interfaces || null;
  const [packetRates, setPacketRates] = useState({});
  const prevRef = useRef({ timestamp: null, counters: {} });

  useEffect(() => {
    if (!liveInterfaces) return;
    const now = Date.now();
    const prev = prevRef.current;
    if (prev.timestamp == null) {
      prevRef.current = { timestamp: now, counters: liveInterfaces };
      return;
    }
    const dt = (now - prev.timestamp) / 1000;
    if (dt <= 0) return;

    const nextRates = {};
    Object.entries(liveInterfaces).forEach(([name, iface]) => {
      const old = prev.counters[name];
      if (!old) return;
      const sentDiff = (iface.interface_packets_sent || 0) - (old.interface_packets_sent || 0);
      const recvDiff = (iface.interface_packets_received || 0) - (old.interface_packets_received || 0);
      nextRates[name] = Math.max(0, sentDiff + recvDiff) / dt;
    });
    setPacketRates(nextRates);
    prevRef.current = { timestamp: now, counters: liveInterfaces };
  }, [liveInterfaces]);

  const mapped = useMemo(() => {
    if (!liveInterfaces || Object.keys(liveInterfaces).length === 0) {
      return {
        tableRows: [],
        utilizationItems: [],
        trafficItems: [],
        systemAvg: 0,
        peakNode: 0,
        pktSecAvg: 0,
        maxPktLabel: '0 KB/s',
      };
    }

    const entries = Object.entries(liveInterfaces).map(([name, iface]) => {
      const utilizationRaw = iface.interface_utilization_percent;
      const isUtilizationValid = Number.isFinite(utilizationRaw);
      const utilization = isUtilizationValid ? Math.max(0, Math.min(100, utilizationRaw)) : 0;

      return {
        name,
        desc: buildDesc(name),
        status: iface.interface_status || 'DOWN',
        statusColor: iface.interface_status === 'UP' ? 'emerald' : 'red',
        speed: `${iface.interface_speed_mbps || 0} Mbps`,
        mtu: iface.mtu || 0,
        bytesSent: formatBytes(iface.interface_bytes_sent || 0),
        bytesRecv: formatBytes(iface.interface_bytes_received || 0),
        packets: `${formatCompact(iface.interface_packets_sent || 0)} / ${formatCompact(iface.interface_packets_received || 0)}`,
        utilization,
        utilizationDisplay: isUtilizationValid ? `${utilization.toFixed(1)}%` : 'N/A',
        disabled: (iface.interface_status || 'DOWN') !== 'UP',
        recvRaw: iface.interface_bytes_received || 0,
        sentRaw: iface.interface_bytes_sent || 0,
      };
    });

    const maxRecv = Math.max(1, ...entries.map((e) => e.recvRaw));
    const maxSent = Math.max(1, ...entries.map((e) => e.sentRaw));

    const trafficItems = entries.map((e) => ({
      name: e.name,
      received: Math.max(2, (e.recvRaw / maxRecv) * 100),
      sent: Math.max(2, (e.sentRaw / maxSent) * 100),
      disabled: e.disabled,
    }));

    const utilizationItems = entries.map((e) => ({
      name: e.name,
      utilization: e.utilization,
      displayValue: e.utilizationDisplay,
      disabled: e.disabled,
    }));

    const validUtils = entries.filter((e) => e.utilizationDisplay !== 'N/A').map((e) => e.utilization);
    const systemAvg = validUtils.length ? validUtils.reduce((s, v) => s + v, 0) / validUtils.length : 0;
    const peakNode = validUtils.length ? Math.max(...validUtils) : 0;

    const rateValues = Object.values(packetRates);
    const pktSecAvg = rateValues.length ? rateValues.reduce((s, v) => s + v, 0) / rateValues.length : 0;

    const maxBytes = Math.max(...entries.map((e) => Math.max(e.recvRaw, e.sentRaw)));
    const maxPktLabel = `${formatBytes(maxBytes)}/s`;

    return {
      tableRows: entries,
      utilizationItems,
      trafficItems,
      systemAvg,
      peakNode,
      pktSecAvg,
      maxPktLabel,
    };
  }, [liveInterfaces, packetRates]);

  return (
    <div className="flex-1 overflow-y-auto bg-[#101622]">
      <div className="p-8 min-h-[calc(100vh-64px)] overflow-y-auto">
        <div className="max-w-[1400px] mx-auto">
          {/* Network Interfaces Page */}
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-100 mb-1">Network Interfaces</h1>
            <p className="text-slate-500 text-sm">Real-time telemetry for physical and virtual interfaces</p>
            <button className="mt-4 bg-[#1a2332] border border-slate-700 px-4 py-2 text-xs font-bold text-slate-300 hover:bg-[#252d3d] transition-colors rounded">
              REFRESH POOL
            </button>
          </div>

          {/* Interfaces Table */}
          <div className="mb-8">
            <InterfacesTable interfaces={mapped.tableRows} />
          </div>

          {/* Utilization & Traffic Charts */}
          <div className="grid grid-cols-2 gap-6">
            <UtilizationComparison
              interfaces={mapped.utilizationItems}
              systemAvg={mapped.systemAvg}
              peakNode={mapped.peakNode}
              pktSecAvg={mapped.pktSecAvg}
            />
            <TrafficThroughput data={mapped.trafficItems} maxPktLabel={mapped.maxPktLabel} />
          </div>
        </div>
      </div>
    </div>
  );
}