
import { useMemo } from 'react';
import { DispatchPoint } from '../EnergyDispatchChartTypes';

export function useProcessedDispatchData(data: DispatchPoint[]) {
  return useMemo(() => {
    // Garantir 24 pontos
    const fill = Array.from({ length: 24 }, (_, h) => ({
      hour: h, grid: 0, charge: 0, discharge: 0, diesel: 0, pv: 0, load: 0, soc: 0
    }));

    const merged = fill.map((row, h) => {
      const d = data.find(p => p.hour === h) ?? {};
      const discharge = Number(d.discharge ?? 0);

      return {
        hour: h,
        hourLabel: `${h}:00`,
        load: Number(d.load ?? row.load),
        grid: Number(d.grid ?? row.grid),
        charge: Number(d.charge ?? row.charge),
        diesel: Number(d.diesel ?? row.diesel),
        pv: Number(d.pv ?? row.pv),
        
        /* ESSENCIAL ➜ área negativa! */
        negDis: -discharge,
        discharge,          // se quiser mostrar tooltip positivo
        
        soc: Number(d.soc ?? row.soc),
        totalLoad: Number(d.load ?? row.load) // The total load line should always show the original load
      };
    });

    return merged;
  }, [data]);
}
