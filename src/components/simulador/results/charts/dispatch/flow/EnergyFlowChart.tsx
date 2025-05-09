
import React, { useMemo } from 'react';
import { EnergySourcesSection } from './EnergySourcesSection';
import { BessSection } from './BessSection';
import { LoadSection } from './LoadSection';
import { EnergyFlowLegend } from './EnergyFlowLegend';
import { HourSelector } from './HourSelector';
import { useChartColors } from '../useChartColors';

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

      <div className="flex-1 bg-muted/20 rounded-lg p-4 relative">
        {/* SVG connection lines for the entire microgrid */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          {/* PV to BESS connection */}
          {currentData.pv > 0 && (
            <>
              <path 
                d="M 25%,25% L 50%,50%" 
                stroke={chartColors.pv} 
                strokeWidth="2"
                fill="none"
                strokeDasharray={currentData.pv < 10 ? "5,5" : "none"}
                markerEnd="url(#arrowheadPv)"
              />
              <defs>
                <marker id="arrowheadPv" markerWidth="10" markerHeight="7" 
                      refX="0" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill={chartColors.pv} />
                </marker>
              </defs>
            </>
          )}
          
          {/* Grid to BESS or Load connection */}
          {currentData.grid > 0 && (
            <>
              <path 
                d="M 75%,25% L 50%,50%" 
                stroke={chartColors.grid} 
                strokeWidth="2"
                fill="none"
                strokeDasharray={currentData.grid < 10 ? "5,5" : "none"}
                markerEnd="url(#arrowheadGrid)"
              />
              <defs>
                <marker id="arrowheadGrid" markerWidth="10" markerHeight="7" 
                      refX="0" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill={chartColors.grid} />
                </marker>
              </defs>
            </>
          )}
          
          {/* Diesel to BESS connection */}
          {currentData.diesel > 0 && (
            <>
              <path 
                d="M 25%,75% L 50%,50%" 
                stroke={chartColors.diesel} 
                strokeWidth="2"
                fill="none"
                markerEnd="url(#arrowheadDiesel)"
              />
              <defs>
                <marker id="arrowheadDiesel" markerWidth="10" markerHeight="7" 
                      refX="0" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill={chartColors.diesel} />
                </marker>
              </defs>
            </>
          )}
          
          {/* BESS to Load connection (discharge) */}
          {currentData.discharge > 0 && (
            <>
              <path 
                d="M 50%,50% L 75%,75%" 
                stroke={chartColors.discharge} 
                strokeWidth="2"
                fill="none"
                markerEnd="url(#arrowheadDischarge)"
              />
              <defs>
                <marker id="arrowheadDischarge" markerWidth="10" markerHeight="7" 
                      refX="0" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill={chartColors.discharge} />
                </marker>
              </defs>
            </>
          )}
        </svg>
        
        <div className="grid grid-cols-2 gap-4 h-full">
          {/* Top Row: PV and Grid */}
          <div className="flex items-center justify-center">
            {currentData.pv > 0 && (
              <EnergySourcesSection 
                type="pv" 
                currentData={currentData} 
                chartColors={chartColors}
                formatNumber={formatNumber}
              />
            )}
          </div>
          
          <div className="flex items-center justify-center">
            {currentData.grid > 0 && (
              <EnergySourcesSection 
                type="grid" 
                currentData={currentData} 
                chartColors={chartColors}
                formatNumber={formatNumber}
              />
            )}
          </div>
          
          {/* Middle Row: BESS */}
          <div className="col-span-2 flex items-center justify-center">
            <BessSection 
              currentData={currentData} 
              chartColors={chartColors} 
              formatNumber={formatNumber} 
            />
          </div>
          
          {/* Bottom Row: Diesel and Load */}
          <div className="flex items-center justify-center">
            {currentData.diesel > 0 && (
              <EnergySourcesSection 
                type="diesel" 
                currentData={currentData} 
                chartColors={chartColors}
                formatNumber={formatNumber}
              />
            )}
          </div>
          
          <div className="flex items-center justify-center">
            <LoadSection 
              currentData={currentData} 
              chartColors={chartColors} 
              formatNumber={formatNumber} 
            />
          </div>
        </div>
      </div>
      
      {/* Legend */}
      <EnergyFlowLegend chartColors={chartColors} />
    </div>
  );
}
