
import React from 'react';
import { TooltipProvider, Tooltip as UITooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { DispatchPoint } from '../EnergyDispatchChartTypes';

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  chartColors: {
    pv: string;
    diesel: string;
    discharge: string;
    charge: string;
    grid: string;
    load: string;
    soc: string;
    peakArea: string;
    chargeArea: string;
  };
}

export const CustomTooltip: React.FC<CustomTooltipProps> = ({ 
  active, 
  payload, 
  label,
  chartColors
}) => {
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
