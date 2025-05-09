
import React from 'react';
import { ArrowRight } from 'lucide-react';

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
            className="w-full h-16 rounded-lg flex items-center justify-center text-white mb-2"
            style={{ backgroundColor: chartColors.pv }}
          >
            <div className="text-center">
              <div className="font-bold">Fotovoltaico</div>
              <div>{formatNumber(currentData.pv)} kW</div>
            </div>
          </div>
          <div className="flex items-center">
            <ArrowRight className="text-muted-foreground animate-pulse" />
          </div>
        </div>
      )}
      
      {/* Grid Source */}
      {currentData.grid > 0 && (
        <div className="flex-1 flex flex-col items-center">
          <div 
            className="w-full h-16 rounded-lg flex items-center justify-center text-white mb-2"
            style={{ backgroundColor: chartColors.grid }}
          >
            <div className="text-center">
              <div className="font-bold">Rede</div>
              <div>{formatNumber(currentData.grid)} kW</div>
            </div>
          </div>
          <div className="flex items-center">
            <ArrowRight className="text-muted-foreground animate-pulse" />
          </div>
        </div>
      )}
      
      {/* Diesel Source */}
      {currentData.diesel > 0 && (
        <div className="flex-1 flex flex-col items-center">
          <div 
            className="w-full h-16 rounded-lg flex items-center justify-center text-white mb-2"
            style={{ backgroundColor: chartColors.diesel }}
          >
            <div className="text-center">
              <div className="font-bold">Diesel</div>
              <div>{formatNumber(currentData.diesel)} kW</div>
            </div>
          </div>
          <div className="flex items-center">
            <ArrowRight className="text-muted-foreground animate-pulse" />
          </div>
        </div>
      )}
    </div>
  );
}
