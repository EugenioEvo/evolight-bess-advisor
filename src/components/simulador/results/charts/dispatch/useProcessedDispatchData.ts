
import { useMemo } from 'react';
import { DispatchPoint } from '../EnergyDispatchChartTypes';

/**
 * Process dispatch data to ensure all necessary fields for the chart are present
 */
export function useProcessedDispatchData(data: DispatchPoint[]) {
  return useMemo(() => {
    if (!data || data.length === 0) {
      return [];
    }
    
    return data.map(point => {
      // Make sure negDis is always a negative number for proper stacking
      const negDis = point.discharge ? -Math.abs(point.discharge) : (point.negDis || 0);
      
      return {
        ...point,
        negDis,
        // Ensure all required fields have default values
        load: point.load || 0,
        pv: point.pv || 0, 
        grid: point.grid || 0,
        charge: point.charge || 0,
        diesel: point.diesel || 0,
        soc: point.soc || 50,
      };
    });
  }, [data]);
}
