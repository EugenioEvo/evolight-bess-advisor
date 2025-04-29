
import { useMemo } from 'react';
import { DispatchPoint } from '../EnergyDispatchChartTypes';

export function useProcessedDispatchData(data: DispatchPoint[]) {
  return useMemo(() => {
    // Create an array with 24 zero-filled points
    const fullData = Array.from({ length: 24 }, (_, i) => ({
      hour: i as DispatchPoint['hour'],
      hourLabel: `${i}:00`,
      load: 0,
      pv: 0,
      diesel: 0,
      charge: 0,
      discharge: 0,
      grid: 0,
      soc: 0,
      negDis: 0,
      totalLoad: 0
    }));
    
    // Fill in with actual data where available
    data.forEach(point => {
      if (point.hour >= 0 && point.hour < 24) {
        fullData[point.hour] = {
          ...fullData[point.hour],
          ...point,
          // Calculate grid if not provided
          grid: point.grid !== undefined ? 
            point.grid : 
            Math.max(0, point.load - point.pv - point.diesel - point.discharge + point.charge),
          // Add additional calculated fields
          hourLabel: `${point.hour}:00`,
          negDis: -point.discharge, // Negative discharge for proper stacking
          totalLoad: point.load // The total load line should always show the original load
        };
      }
    });
    
    return fullData;
  }, [data]);
}
