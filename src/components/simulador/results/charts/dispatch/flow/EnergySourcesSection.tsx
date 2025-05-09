
import React from 'react';
import { ArrowRight, Sun, Grid, Fuel } from 'lucide-react';

interface EnergySourcesSectionProps {
  currentData: any;
  chartColors: Record<string, string>;
  formatNumber: (num: number) => string;
}

export function EnergySourcesSection({ 
  currentData, 
  chartColors, 
  formatNumber 
}: EnergySourcesSectionProps) {
  return (
    <div className="flex justify-between gap-4 h-1/3">
      {/* PV Source */}
      {currentData.pv > 0 && (
        <div className="flex-1 flex flex-col items-center">
          <div 
            className="w-full h-16 rounded-lg flex items-center justify-between text-white mb-2 px-3"
            style={{ backgroundColor: chartColors.pv }}
          >
            <div className="flex items-center gap-2">
              <Sun size={24} className="animate-pulse" />
            </div>
            <div className="text-center">
              <div className="font-bold">Fotovoltaico</div>
              <div>{formatNumber(currentData.pv)} kW</div>
            </div>
          </div>
          <div className="flex items-center h-8">
            <ArrowRight className="text-muted-foreground animate-pulse" />
          </div>
        </div>
      )}
      
      {/* Grid Source */}
      {currentData.grid > 0 && (
        <div className="flex-1 flex flex-col items-center">
          <div 
            className="w-full h-16 rounded-lg flex items-center justify-between text-white mb-2 px-3"
            style={{ backgroundColor: chartColors.grid }}
          >
            <div className="flex items-center gap-2">
              <Grid size={24} />
            </div>
            <div className="text-center">
              <div className="font-bold">Rede</div>
              <div>{formatNumber(currentData.grid)} kW</div>
            </div>
          </div>
          <div className="flex items-center h-8">
            <ArrowRight className="text-muted-foreground animate-pulse" />
          </div>
        </div>
      )}
      
      {/* Diesel Source */}
      {currentData.diesel > 0 && (
        <div className="flex-1 flex flex-col items-center">
          <div 
            className="w-full h-16 rounded-lg flex items-center justify-between text-white mb-2 px-3"
            style={{ backgroundColor: chartColors.diesel }}
          >
            <div className="flex items-center gap-2">
              <Fuel size={24} />
            </div>
            <div className="text-center">
              <div className="font-bold">Diesel</div>
              <div>{formatNumber(currentData.diesel)} kW</div>
            </div>
          </div>
          <div className="flex items-center h-8">
            <ArrowRight className="text-muted-foreground animate-pulse" />
          </div>
        </div>
      )}
    </div>
  );
}
