
import { useMemo } from 'react';
import { DispatchPoint } from '../EnergyDispatchChartTypes';
import { BessDispatchPoint } from '@/hooks/bessSimulation/types';

export function useProcessedDispatchData(data: DispatchPoint[] | BessDispatchPoint[]) {
  return useMemo(() => {
    // Ensure we have 24 points with default values
    const fill = Array.from({ length: 24 }, (_, h) => ({
      hour: h, grid: 0, charge: 0, discharge: 0, diesel: 0, pv: 0, load: 0, soc: 0, dieselRef: 0
    }));

    // Log the incoming data to help debugging
    console.log("Processing dispatch data:", data);

    const merged = fill.map((row, h) => {
      // Find matching data point or use default
      const d = data.find(p => p.hour === h) ?? row;
      const discharge = Number(d.discharge ?? 0);

      return {
        hour: h,
        hourLabel: `${h}:00`,
        load: Number(d.load ?? row.load),
        grid: Number(d.grid ?? row.grid),
        charge: Number(d.charge ?? row.charge),
        diesel: Number(d.diesel ?? row.diesel),
        dieselRef: Number(d.dieselRef ?? row.dieselRef),
        pv: Number(d.pv ?? row.pv),
        
        /* Essential for displaying discharge as negative area */
        // Certifica que negDis é sempre um valor negativo para empilhamento correto
        negDis: discharge > 0 ? -discharge : 0, // Always negative for stacking
        discharge,                    // Keep positive for tooltip
        
        soc: Number(d.soc ?? row.soc),
        totalLoad: Number(d.load ?? row.load) // Total load line always shows original load
      };
    });

    console.log("Processed dispatch data:", merged);
    return merged;
  }, [data]);
}
