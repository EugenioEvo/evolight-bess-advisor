
import React from 'react';
import { 
  ResponsiveContainer, ComposedChart, CartesianGrid, 
  Tooltip, Legend
} from 'recharts';
import { useIsMobile } from '@/hooks/use-mobile';
import { CustomTooltip } from './dispatch/CustomTooltip';
import { ReferenceAreas } from './dispatch/ReferenceAreas';
import { ChartAxes } from './dispatch/ChartAxes';
import { ChartAreas } from './dispatch/ChartAreas';
import { useChartColors } from './dispatch/useChartColors';
import { useProcessedDispatchData } from './dispatch/useProcessedDispatchData';
import { EnergyDispatchChartProps } from './EnergyDispatchChartTypes';

export { type DispatchPoint } from './EnergyDispatchChartTypes';

export function EnergyDispatchChart({ 
  data, 
  highlightPeakHours = true,
  peakStartHour = 18,
  peakEndHour = 21,
  title = "Despacho de Energia (24h)" 
}: EnergyDispatchChartProps) {
  const isMobile = useIsMobile();
  const chartColors = useChartColors();
  const processedData = useProcessedDispatchData(data);

  return (
    <div className="w-full">
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <div className="h-[420px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={processedData} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" />
            
            <ChartAxes isMobile={isMobile} />
            
            <ReferenceAreas 
              highlightPeakHours={highlightPeakHours}
              peakStartHour={peakStartHour}
              peakEndHour={peakEndHour}
              chartColors={chartColors}
            />
            
            <ChartAreas chartColors={chartColors} />
            
            <Legend verticalAlign="top" />
            <Tooltip content={<CustomTooltip chartColors={chartColors} />} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
