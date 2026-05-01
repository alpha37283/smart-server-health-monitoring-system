import React from 'react';
import ProcessMetricsCards from '../components/NetworkProcess/ProcessMetricsCards';
import TopProcessesChart from '../components/NetworkProcess/TopProcessesChart';
import ConnectionActivityChart from '../components/NetworkProcess/ConnectionActivityChart';
import ProcessTable from '../components/NetworkProcess/ProcessTable';
import { useMetrics } from '../context/MetricsContext';

function toProcessRows(connectionsPerProcess = {}) {
  return Object.values(connectionsPerProcess)
    .map((proc) => {
      const conns = proc.connections || [];
      const established = conns.filter((c) => c.status === 'ESTABLISHED').length;
      const listen = conns.filter((c) => c.status === 'LISTEN').length;
      const other = conns.length - established - listen;
      const ports = [...new Set(conns.map((c) => c.port).filter((p) => Number.isFinite(p)))];
      return {
        pid: proc.pid,
        name: proc.name,
        established,
        listen,
        other,
        total: conns.length,
        ports,
      };
    })
    .sort((a, b) => b.total - a.total);
}

export default function NetworkProcesses() {
  const { networkProcessMetrics } = useMetrics();
  const data = networkProcessMetrics?.data || {};
  const connectionsPerProcess = data.connections_per_process || {};
  const processRows = toProcessRows(connectionsPerProcess);
  const displayedRows = processRows.slice(0, 5);

  const totalProcesses = (data.network_process_list || []).length;
  const activeConnections = processRows.reduce((sum, p) => sum + p.total, 0);
  const establishedConnections = processRows.reduce((sum, p) => sum + p.established, 0);
  const listeningConnections = processRows.reduce((sum, p) => sum + p.listen, 0);

  const topByConnections = (data.top_processes_by_connections || []).map((p) => ({
    name: p.name,
    pid: p.pid,
    connections: (p.connections || []).length,
  }));
  const fallbackTop = displayedRows.map((p) => ({ name: p.name, pid: p.pid, connections: p.total }));
  const chartBase = topByConnections.length ? topByConnections : fallbackTop;
  const maxConnections = Math.max(1, ...chartBase.map((p) => p.connections || 0));
  const topProcesses = chartBase.map((p) => ({
    ...p,
    width: Math.max(8, ((p.connections || 0) / maxConnections) * 100),
  }));

  const latestActivityScore = activeConnections > 0
    ? Math.min(100, Math.max(5, (establishedConnections / activeConnections) * 100))
    : null;

  return (
    <div className="flex-1 overflow-y-auto bg-[#101622]">
      <div className="p-8 min-h-[calc(100vh-64px)]">
        <div className="max-w-[1400px] mx-auto">
          {/* Network Processes Page */}
          <ProcessMetricsCards
            totalProcesses={totalProcesses || 248}
            activeConnections={activeConnections || 1042}
            establishedConnections={establishedConnections || 892}
            listeningConnections={listeningConnections || 150}
          />
          <TopProcessesChart processes={topProcesses} />
          <ConnectionActivityChart latestActivityScore={latestActivityScore} />
          <ProcessTable processes={displayedRows} totalProcesses={totalProcesses || 248} />
        </div>
      </div>
    </div>
  );
}