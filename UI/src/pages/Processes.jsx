import React, { useState, useMemo } from 'react';
import ProcessMetricsCards from '../components/Processes/ProcessMetricsCards';
import ProcessTable from '../components/Processes/ProcessTable';

export default function Processes() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('cpu');
  const [sortOrder, setSortOrder] = useState('desc');

  const allProcesses = [
    { pid: 4128, name: 'nginx_master', cpu: 84.2, memory: 12.5, memMB: 1424.2, threads: 32, status: 'RUNNING', uptime: '14h 22m' },
    { pid: 1022, name: 'syslogd', cpu: 0.4, memory: 0.1, memMB: 8.4, threads: 2, status: 'SLEEPING', uptime: '12d 04h' },
    { pid: 5521, name: 'cleanup_task', cpu: 0.0, memory: 0.0, memMB: 0.0, threads: 1, status: 'ZOMBIE', uptime: '02m 14s' },
    { pid: 882, name: 'redis-server', cpu: 4.8, memory: 42.1, memMB: 4112.9, threads: 4, status: 'STOPPED', uptime: '1h 05m' },
    { pid: 91, name: 'sshd', cpu: 0.1, memory: 0.3, memMB: 12.2, threads: 1, status: 'RUNNING', uptime: '12d 04h' },
    { pid: 3210, name: 'python_app', cpu: 15.3, memory: 28.4, memMB: 2856.1, threads: 8, status: 'RUNNING', uptime: '5d 12h' },
    { pid: 2048, name: 'node_server', cpu: 22.1, memory: 35.6, memMB: 3584.9, threads: 12, status: 'RUNNING', uptime: '3d 08h' },
    { pid: 1256, name: 'mysql_db', cpu: 3.4, memory: 18.9, memMB: 1896.5, threads: 16, status: 'RUNNING', uptime: '20d 02h' },
    { pid: 756, name: 'apache2', cpu: 1.2, memory: 5.3, memMB: 534.8, threads: 5, status: 'RUNNING', uptime: '15d 10h' },
  ];

  const filteredProcesses = useMemo(() => {
    return allProcesses.filter(p =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.pid.toString().includes(searchTerm)
    );
  }, [searchTerm]);

  const totalPages = Math.ceil(filteredProcesses.length / 5);
  const paginatedProcesses = filteredProcesses.slice((currentPage - 1) * 5, currentPage * 5);

  const metrics = {
    total: allProcesses.length,
    running: allProcesses.filter(p => p.status === 'RUNNING').length,
    sleeping: allProcesses.filter(p => p.status === 'SLEEPING').length,
    avgCPU: (allProcesses.reduce((sum, p) => sum + p.cpu, 0) / allProcesses.length).toFixed(1),
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
