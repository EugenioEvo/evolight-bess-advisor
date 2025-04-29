
import React from 'react';
import { 
  ComposedChart, CartesianGrid, 
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
import { ChartContainer } from '@/components/ui/chart/ChartContainer';

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
        <ChartContainer
          config={{
            pv: { theme: { light: "#f97316", dark: "#f97316" } },
            diesel: { theme: { light: "#f59e0b", dark: "#fbbf24" } },
            discharge: { theme: { light: "#22c55e", dark: "#4ade80" } },
            charge: { theme: { light: "#8b5cf6", dark: "#c4b5fd" } },
            grid: { theme: { light: "#ef4444", dark: "#fca5a5" } },
            load: { theme: { light: "#333", dark: "#ccc" } },
            soc: { theme: { light: "#0ea5e9", dark: "#7dd3fc" } },
          }}
        >
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
        </ChartContainer>
      </div>
    </div>
  );
}
