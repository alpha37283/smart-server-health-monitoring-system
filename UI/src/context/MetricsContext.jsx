import React, { createContext, useContext } from 'react';
import { useMetricsWebSocket } from '../hooks/useMetricsWebSocket';

const MetricsContext = createContext(null);

export function MetricsProvider({ children }) {
  const metrics = useMetricsWebSocket();
  return (
    <MetricsContext.Provider value={metrics}>
      {children}
    </MetricsContext.Provider>
  );
}

export function useMetrics() {
  const ctx = useContext(MetricsContext);
  if (!ctx) {
    throw new Error('useMetrics must be used within MetricsProvider');
  }
  return ctx;
}
