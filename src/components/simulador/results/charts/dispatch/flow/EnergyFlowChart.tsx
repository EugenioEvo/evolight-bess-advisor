
import React, { useMemo } from 'react';
import { EnergySourcesSection } from './EnergySourcesSection';
import { BessSection } from './BessSection';
import { LoadSection } from './LoadSection';
import { EnergyFlowLegend } from './EnergyFlowLegend';
import { HourSelector } from './HourSelector';
import { useChartColors } from '../useChartColors';
import { ChartLine } from 'lucide-react';

interface EnergyFlowProps {
  data: any[];
  hour: number;
  onHourChange: (hour: number) => void;
}

export function EnergyFlowChart({ data, hour = 12, onHourChange }: EnergyFlowProps) {
  const chartColors = useChartColors();
  
  // Find data for the selected hour
  const currentData = useMemo(() => {
    return data.find(d => d.hour === hour) || data[0];
  }, [data, hour]);

  // Format number for display
  const formatNumber = (num: number) => {
    return Number(num.toFixed(1)).toLocaleString();
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Fluxo de Energia: {hour}:00h</h3>
        <HourSelector hour={hour} onHourChange={onHourChange} />
      </div>

      <div className="flex-1 bg-muted/20 rounded-lg p-4 overflow-auto">
        <div className="flex flex-col gap-6 h-full relative">
          {/* Connection lines to create the spider web effect */}
          <div className="absolute inset-0 pointer-events-none">
            <svg className="w-full h-full">
              {/* These SVG paths will be dynamically drawn based on the energy flow */}
              {currentData.pv > 0 && (
                <path 
                  d="M 100,100 L 50%,50%" 
                  stroke={chartColors.pv} 
                  strokeWidth="2"
                  strokeDasharray={currentData.pv > 10 ? "none" : "5,5"}
                  fill="none"
                  className="animate-pulse"
                />
              )}
              {/* More dynamic paths will be added */}
            </svg>
          </div>
          
          {/* Energy sources */}
          <EnergySourcesSection 
            currentData={currentData} 
            chartColors={chartColors} 
            formatNumber={formatNumber} 
          />
          
          {/* BESS in the middle */}
          <BessSection 
            currentData={currentData} 
            chartColors={chartColors} 
            formatNumber={formatNumber} 
          />
          
          {/* Load (consumption) */}
          <LoadSection 
            currentData={currentData} 
            chartColors={chartColors} 
            formatNumber={formatNumber} 
          />
        </div>
      </div>
      
      {/* Legend */}
      <EnergyFlowLegend chartColors={chartColors} />
      
      {/* Daily profile chart button */}
      <div className="mt-4 flex justify-center">
        <button 
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ChartLine size={16} />
          <span>Ver perfil completo de 24h</span>
        </button>
      </div>
    </div>
  );
}
