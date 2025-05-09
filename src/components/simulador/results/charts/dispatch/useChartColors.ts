
import { useMemo } from 'react';
import { useTheme } from 'next-themes';

export function useChartColors() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  
  return useMemo(() => ({
    pv: isDark ? '#f97316' : '#f97316',           // Orange
    diesel: isDark ? '#fbbf24' : '#f59e0b',       // Amber
    discharge: isDark ? '#4ade80' : '#22c55e',    // Green
    charge: isDark ? '#c4b5fd' : '#8b5cf6',       // Purple
    grid: isDark ? '#fca5a5' : '#ef4444',         // Red
    load: isDark ? '#e5e5e5' : '#333333',         // Gray
    soc: isDark ? '#7dd3fc' : '#0ea5e9',          // Blue
    dieselRef: isDark ? '#fde68a' : '#facc15',    // Yellow
    peakArea: isDark ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.1)',  // Light red
    chargeArea: isDark ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.1)'  // Light purple
  }), [isDark]);
}
