import React, { useState, useMemo } from 'react';
import ProcessMetricsCards from '../components/Processes/ProcessMetricsCards';
import ProcessTable from '../components/Processes/ProcessTable';
import { useMetrics } from '../context/MetricsContext';

function formatUptime(seconds) {
  if (!seconds || seconds < 0) return '0s';
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (d > 0) return `${d}d ${h}h`;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

export default function Processes() {
  const { processMetrics } = useMetrics();
  const d = processMetrics?.data ?? {};

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('cpu');
  const [sortOrder, setSortOrder] = useState('desc');

  const allProcesses = useMemo(() => {
    const processMap = new Map();
    (d.top_cpu_processes || []).forEach(p => processMap.set(p.pid, p));
    (d.top_memory_processes || []).forEach(p => processMap.set(p.pid, p));

    return Array.from(processMap.values()).map(p => ({
      pid: p.pid,
      name: p.name,
      cpu: p.cpu_percent || 0,
      memory: p.memory_percent || 0,
      memMB: p.memory_mb || 0,
      threads: p.threads || 0,
      status: (typeof p.status === 'string' ? p.status.toUpperCase() : 'UNKNOWN'),
      uptime: formatUptime(p.uptime_seconds)
    }));
  }, [d.top_cpu_processes, d.top_memory_processes]);

  const filteredProcesses = useMemo(() => {
    return allProcesses.filter(p =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.pid.toString().includes(searchTerm)
    );
  }, [searchTerm]);

  const totalPages = Math.ceil(filteredProcesses.length / 5);
  const paginatedProcesses = filteredProcesses.slice((currentPage - 1) * 5, currentPage * 5);

  const metrics = {
    total: d.process_summary?.total || 0,
    running: d.process_summary?.running || 0,
    sleeping: d.process_summary?.sleeping || 0,
    avgCPU: allProcesses.length > 0
      ? (allProcesses.reduce((sum, p) => sum + p.cpu, 0) / allProcesses.length).toFixed(1)
      : '0.0',
  };

  return (
    <div className="p-8 space-y-6 overflow-y-auto bg-slate-950">
      <ProcessMetricsCards metrics={metrics} />
      <ProcessTable
        processes={paginatedProcesses}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
        totalProcesses={filteredProcesses.length}
      />
    </div>
  );
}
