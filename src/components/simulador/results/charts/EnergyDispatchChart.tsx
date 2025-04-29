
import React, { useMemo } from 'react';
import { 
  ResponsiveContainer, ComposedChart, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, Area, Line, ReferenceArea
} from 'recharts';
import { useTheme } from "next-themes";
import { Tooltip as UITooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { useIsMobile } from '@/hooks/use-mobile';

export interface DispatchPoint {
  hour: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23;
  load: number;        // kW
  pv: number;          // kW gerados (>=0)
  diesel: number;      // kW gerados (>=0)
  charge: number;      // kW carregando BESS (>=0)
  discharge: number;   // kW descarregando BESS (>=0)
  grid?: number;       // kW comprados (>=0) - opcional
  soc: number;         // 0-100 %
}

interface EnergyDispatchChartProps {
  data: DispatchPoint[];
  highlightPeakHours?: boolean;
  peakStartHour?: number;
  peakEndHour?: number;
  title?: string;
}

export function EnergyDispatchChart({ 
  data, 
  highlightPeakHours = true,
  peakStartHour = 18,
  peakEndHour = 21,
  title = "Despacho de Energia (24h)" 
}: EnergyDispatchChartProps) {
  const { resolvedTheme } = useTheme();
  const isMobile = useIsMobile();
  
  const chartColors = useMemo(() => {
    return {
      pv: resolvedTheme === 'dark' ? '#fff4af' : '#ffe58a',
      diesel: resolvedTheme === 'dark' ? '#e0b68a' : '#cfa67d',
      discharge: resolvedTheme === 'dark' ? '#b3edb9' : '#98e3a1',
      charge: resolvedTheme === 'dark' ? '#b8d1ff' : '#a1c4ff',
      grid: resolvedTheme === 'dark' ? '#ffc6b3' : '#ffb39a',
      load: '#000000',
      soc: resolvedTheme === 'dark' ? '#b280e3' : '#7423c6',
      peakArea: resolvedTheme === 'dark' ? 'rgba(255,100,100,0.05)' : 'rgba(255,100,100,0.1)',
      chargeArea: resolvedTheme === 'dark' ? 'rgba(100,100,255,0.05)' : 'rgba(100,100,255,0.1)'
    };
  }, [resolvedTheme]);
  
  // Ensure we have 24 data points, filling with zeros if needed
  const processedData = useMemo(() => {
    // Create an array with 24 zero-filled points
    const fullData = Array.from({ length: 24 }, (_, i) => ({
      hour: i as DispatchPoint['hour'],
      load: 0,
      pv: 0,
      diesel: 0,
      charge: 0,
      discharge: 0,
      grid: 0,
      soc: 0
    }));
    
    // Fill in with actual data where available
    data.forEach(point => {
      fullData[point.hour] = {
        ...point,
        // Calculate grid if not provided
        grid: point.grid !== undefined ? 
          point.grid : 
          Math.max(0, point.load - point.pv - point.diesel - point.discharge + point.charge)
      };
    });
    
    // Add negDis property and other calculated fields to all points for visualization
    return fullData.map(point => ({
      ...point,
      hourLabel: `${point.hour}:00`,
      negDis: -point.discharge, // Negative discharge for proper stacking
      
      // The total load line should always show the original load
      // (We're not modifying the load value itself)
      totalLoad: point.load
    }));
  }, [data]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;
    
    const hourData = payload[0].payload;
    
    return (
      <div className="bg-background border border-border rounded-md p-3 shadow-md">
        <p className="font-medium text-sm">{`Hora: ${label}`}</p>
        <div className="grid gap-2 mt-2">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 bg-black rounded-sm" />
              <span className="text-xs">Carga:</span>
            </div>
            <span className="text-xs font-medium">{`${hourData.load.toFixed(1)} kW`}</span>
          </div>
          
          {hourData.pv > 0 && (
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-sm" style={{ backgroundColor: chartColors.pv }} />
                <span className="text-xs">Fotovoltaico:</span>
              </div>
              <span className="text-xs font-medium">{`${hourData.pv.toFixed(1)} kW`}</span>
            </div>
          )}
          
          {hourData.diesel > 0 && (
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-sm" style={{ backgroundColor: chartColors.diesel }} />
                <span className="text-xs">Diesel:</span>
              </div>
              <span className="text-xs font-medium">{`${hourData.diesel.toFixed(1)} kW`}</span>
            </div>
          )}
          
          {hourData.discharge > 0 && (
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-sm" style={{ backgroundColor: chartColors.discharge }} />
                <span className="text-xs">BESS (descarga):</span>
              </div>
              <span className="text-xs font-medium">{`${hourData.discharge.toFixed(1)} kW`}</span>
            </div>
          )}
          
          {hourData.charge > 0 && (
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-sm" style={{ backgroundColor: chartColors.charge }} />
                <span className="text-xs">
                  <TooltipProvider>
                    <UITooltip>
                      <TooltipTrigger asChild>
                        <span>BESS (carga):</span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">{`${(hourData.charge * 1).toFixed(1)} kWh carregados`}</p>
                      </TooltipContent>
                    </UITooltip>
                  </TooltipProvider>
                </span>
              </div>
              <span className="text-xs font-medium">{`${hourData.charge.toFixed(1)} kW`}</span>
            </div>
          )}
          
          {hourData.grid > 0 && (
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-sm" style={{ backgroundColor: chartColors.grid }} />
                <span className="text-xs">Rede:</span>
              </div>
              <span className="text-xs font-medium">{`${hourData.grid.toFixed(1)} kW`}</span>
            </div>
          )}
          
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-sm" style={{ backgroundColor: chartColors.soc }} />
              <span className="text-xs">SoC:</span>
            </div>
            <span className="text-xs font-medium">{`${hourData.soc.toFixed(1)} %`}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full">
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <div className="h-[420px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={processedData} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" />
            
            <XAxis 
              dataKey="hourLabel" 
              interval={isMobile ? 3 : 1}
              tick={{ fill: 'var(--foreground)' }}
              tickLine={{ stroke: 'var(--foreground)' }}
            />
            
            <YAxis 
              yAxisId="left" 
              label={{ 
                value: "Potência (kW)", 
                angle: -90, 
                position: "insideLeft",
                fill: 'var(--foreground)'
              }}
              tick={{ fill: 'var(--foreground)' }}
              tickLine={{ stroke: 'var(--foreground)' }}
            />
            
            <YAxis 
              yAxisId="right" 
              orientation="right"
              domain={[0, 100]} 
              label={{ 
                value: "SoC (%)", 
                angle: 90, 
                position: "insideRight",
                fill: 'var(--foreground)'
              }}
              tick={{ fill: 'var(--foreground)' }}
              tickLine={{ stroke: 'var(--foreground)' }}
            />
            
            {highlightPeakHours && (
              <>
                {/* Highlight peak hours */}
                <ReferenceArea 
                  x1={`${peakStartHour}:00`} 
                  x2={`${peakEndHour}:00`} 
                  yAxisId="left"
                  fill={chartColors.peakArea} 
                  fillOpacity={0.8}
                  stroke="none"
                  isFront={false}
                />
                
                {/* Highlight charging window (typically night) */}
                <ReferenceArea 
                  x1="0:00" 
                  x2="6:00" 
                  yAxisId="left"
                  fill={chartColors.chargeArea} 
                  fillOpacity={0.8}
                  stroke="none"
                  isFront={false}
                />
              </>
            )}
            
            {/* Stacked areas (sources) */}
            <Area 
              yAxisId="left" 
              dataKey="pv" 
              stackId="src" 
              fill={chartColors.pv} 
              stroke="none"
              name="Fotovoltaico"
            />
            
            <Area 
              yAxisId="left" 
              dataKey="diesel" 
              stackId="src" 
              fill={chartColors.diesel} 
              stroke="none"
              name="Diesel"
            />
            
            <Area 
              yAxisId="left" 
              dataKey="negDis" 
              stackId="src" 
              fill={chartColors.discharge} 
              stroke="none"
              name="BESS (descarga)"
            />
            
            <Area 
              yAxisId="left" 
              dataKey="grid" 
              stackId="src" 
              fill={chartColors.grid} 
              stroke="none"
              name="Rede"
            />
            
            {/* Non-stacked BESS charging */}
            <Area 
              yAxisId="left" 
              dataKey="charge" 
              fill={chartColors.charge} 
              stroke="none"
              name="BESS (carga)"
            />
            
            {/* Load line - always showing the original load */}
            <Line 
              yAxisId="left" 
              dataKey="load" 
              stroke={chartColors.load} 
              strokeDasharray="6 4" 
              dot={false}
              name="Carga Cliente"
            />
            
            <Line 
              yAxisId="right" 
              dataKey="soc" 
              stroke={chartColors.soc} 
              dot={false}
              name="SoC BESS"
            />
            
            <Legend verticalAlign="top" />
            <Tooltip content={<CustomTooltip />} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
