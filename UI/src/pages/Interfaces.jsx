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

function formatMbpsFromBytesPerSec(bytesPerSec) {
  if (!Number.isFinite(bytesPerSec) || bytesPerSec <= 0) return '0 Mbps';
  const mbps = (bytesPerSec * 8) / 1_000_000;
  return `${mbps.toFixed(2)} Mbps`;
}

function isVirtualInterface(name) {
  const n = String(name || '').toLowerCase();
  return (
    n.startsWith('docker') ||
    n.startsWith('br-') ||
    n.startsWith('veth') ||
    n.startsWith('virbr') ||
    n.startsWith('vmnet') ||
    n.startsWith('tun') ||
    n.startsWith('tap')
  );
}

export default function Interfaces() {
  const { networkInterfaceMetrics } = useMetrics();
  const liveInterfaces = networkInterfaceMetrics?.data?.interfaces || null;
  const [packetRates, setPacketRates] = useState({});
  const [byteRates, setByteRates] = useState({});
  const [hideDownAndVirtual, setHideDownAndVirtual] = useState(true);
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

    const nextPacketRates = {};
    const nextByteRates = {};
    Object.entries(liveInterfaces).forEach(([name, iface]) => {
      const old = prev.counters[name];
      if (!old) return;
      const sentDiff = (iface.interface_packets_sent || 0) - (old.interface_packets_sent || 0);
      const recvDiff = (iface.interface_packets_received || 0) - (old.interface_packets_received || 0);
      const sentBytesDiff = (iface.interface_bytes_sent || 0) - (old.interface_bytes_sent || 0);
      const recvBytesDiff = (iface.interface_bytes_received || 0) - (old.interface_bytes_received || 0);
      nextPacketRates[name] = Math.max(0, sentDiff + recvDiff) / dt;
      nextByteRates[name] = {
        sent: Math.max(0, sentBytesDiff) / dt,
        recv: Math.max(0, recvBytesDiff) / dt,
      };
    });
    setPacketRates(nextPacketRates);
    setByteRates(nextByteRates);
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
      const status = iface.interface_status || 'DOWN';
      const isVirtual = isVirtualInterface(name);
      const sendRateBps = iface.interface_send_rate_bytes_per_sec ?? byteRates[name]?.sent ?? 0;
      const recvRateBps = iface.interface_receive_rate_bytes_per_sec ?? byteRates[name]?.recv ?? 0;
      const totalRateBps = Math.max(0, sendRateBps + recvRateBps);
      const reportedSpeedMbps = iface.interface_speed_mbps || 0;
      const speedDisplay = reportedSpeedMbps > 0
        ? `${reportedSpeedMbps} Mbps`
        : (status === 'UP' ? formatMbpsFromBytesPerSec(totalRateBps) : '0 Mbps');

      return {
        name,
        desc: buildDesc(name),
        status,
        statusColor: status === 'UP' ? 'emerald' : 'red',
        speed: speedDisplay,
        mtu: iface.mtu || 0,
        bytesSent: formatBytes(iface.interface_bytes_sent || 0),
        bytesRecv: formatBytes(iface.interface_bytes_received || 0),
        packets: `${formatCompact(iface.interface_packets_sent || 0)} / ${formatCompact(iface.interface_packets_received || 0)}`,
        utilization,
        utilizationDisplay: isUtilizationValid ? `${utilization.toFixed(1)}%` : null,
        disabled: status !== 'UP',
        isVirtual,
        recvRaw: iface.interface_bytes_received || 0,
        sentRaw: iface.interface_bytes_sent || 0,
        recvRateRaw: recvRateBps,
        sentRateRaw: sendRateBps,
        totalRateRaw: totalRateBps,
      };
    });

    const visibleEntries = hideDownAndVirtual
      ? entries.filter((e) => e.status === 'UP' && !e.isVirtual)
      : entries;

    const maxRecvRate = Math.max(1, ...visibleEntries.map((e) => e.recvRateRaw));
    const maxSentRate = Math.max(1, ...visibleEntries.map((e) => e.sentRateRaw));
    const maxTotalRate = Math.max(1, ...visibleEntries.map((e) => e.totalRateRaw));

    const trafficItems = visibleEntries.map((e) => ({
      name: e.name,
      received: Math.max(2, (e.recvRateRaw / maxRecvRate) * 100),
      sent: Math.max(2, (e.sentRateRaw / maxSentRate) * 100),
      disabled: e.disabled,
    }));

    const utilizationItems = visibleEntries.map((e) => ({
      name: e.name,
      utilization: e.utilizationDisplay == null ? Math.max(0, Math.min(100, (e.totalRateRaw / maxTotalRate) * 100)) : e.utilization,
      displayValue: e.utilizationDisplay || `${Math.max(0, Math.min(100, (e.totalRateRaw / maxTotalRate) * 100)).toFixed(1)}%`,
      disabled: e.disabled,
    }));

    const rateValues = visibleEntries.map((e) => packetRates[e.name] || 0);
    const pktSecAvg = rateValues.length ? rateValues.reduce((s, v) => s + v, 0) / rateValues.length : 0;

    const maxBytes = Math.max(...visibleEntries.map((e) => Math.max(e.recvRateRaw, e.sentRateRaw)));
    const maxPktLabel = `${formatBytes(maxBytes)}/s`;

    return {
      tableRows: visibleEntries,
      utilizationItems,
      trafficItems,
      pktSecAvg,
      maxPktLabel,
    };
  }, [liveInterfaces, packetRates, byteRates, hideDownAndVirtual]);

  return (
    <div className="flex-1 overflow-y-auto bg-[#101622]">
      <div className="p-8 min-h-[calc(100vh-64px)] overflow-y-auto">
        <div className="max-w-[1400px] mx-auto">
          {/* Network Interfaces Page */}
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-100 mb-1">Network Interfaces</h1>
            <p className="text-slate-500 text-sm">NIC-level telemetry for physical and virtual interfaces</p>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setHideDownAndVirtual((v) => !v)}
                className="bg-[#1a2332] border border-slate-700 px-4 py-2 text-xs font-bold text-slate-300 hover:bg-[#252d3d] transition-colors rounded"
              >
                {hideDownAndVirtual ? 'SHOW ALL INTERFACES' : 'HIDE DOWN/VIRTUAL'}
              </button>
              <button className="bg-[#1a2332] border border-slate-700 px-4 py-2 text-xs font-bold text-slate-300 hover:bg-[#252d3d] transition-colors rounded">
                REFRESH POOL
              </button>
            </div>
          </div>

          {/* Interfaces Table */}
          <div className="mb-8">
            <InterfacesTable interfaces={mapped.tableRows} />
          </div>

          {/* Utilization & Traffic Charts */}
          <div className="grid grid-cols-2 gap-6">
            <UtilizationComparison
              interfaces={mapped.utilizationItems}
              pktSecAvg={mapped.pktSecAvg}
            />
            <TrafficThroughput data={mapped.trafficItems} maxPktLabel={mapped.maxPktLabel} />
          </div>
        </div>
      </div>
    </div>
  );
}