import { useMemo } from 'react';
import { DispatchPoint } from '../EnergyDispatchChartTypes';
import { BessDispatchPoint } from '@/hooks/bessSimulation/types';

export function useProcessedDispatchData(data: DispatchPoint[] | BessDispatchPoint[]) {
  return useMemo(() => {
    // Garantir 24 pontos
    const fill = Array.from({ length: 24 }, (_, h) => ({
      hour: h, grid: 0, charge: 0, discharge: 0, diesel: 0, pv: 0, load: 0, soc: 0, dieselRef: 0
    }));

    const merged = fill.map((row, h) => {
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
        
        /* ESSENCIAL ➜ área negativa! */
        negDis: -Math.abs(discharge), // Garantindo que será sempre negativo
        discharge,                    // Mantém descarga positiva para tooltip
        
        soc: Number(d.soc ?? row.soc),
        totalLoad: Number(d.load ?? row.load) // The total load line should always show the original load
      };
    });

    return merged;
  }, [data]);
}
