
import React from 'react';
import { ArrowRight } from 'lucide-react';

interface BessSectionProps {
  currentData: any;
  chartColors: Record<string, string>;
  formatNumber: (num: number) => string;
}

export function BessSection({
  currentData,
  chartColors,
  formatNumber
}: BessSectionProps) {
  return (
    <div className="flex justify-center items-center h-1/3">
      <div className="relative">
        <div 
          className="w-64 h-32 rounded-lg border-2 flex flex-col items-center justify-center"
          style={{ borderColor: chartColors.soc }}
        >
          <div className="text-center">
            <div className="font-bold">BESS</div>
            <div className="text-sm">Estado de Carga: {formatNumber(currentData.soc)}%</div>
            
            {currentData.charge > 0 && (
              <div className="mt-1 text-sm py-1 px-2 rounded" style={{ backgroundColor: chartColors.charge + '40' }}>
                Carregando: +{formatNumber(currentData.charge)} kW
              </div>
            )}
            
            {currentData.discharge > 0 && (
              <div className="mt-1 text-sm py-1 px-2 rounded" style={{ backgroundColor: chartColors.discharge + '40' }}>
                Descarregando: -{formatNumber(currentData.discharge)} kW
              </div>
            )}
          </div>
          
          {/* Battery level indicator */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
            <div 
              className="h-full transition-all duration-500"
              style={{ 
                width: `${currentData.soc}%`, 
                backgroundColor: chartColors.soc 
              }}
            />
          </div>
        </div>
        
        {/* Arrows from BESS */}
        {currentData.discharge > 0 && (
          <div className="absolute -right-8 top-1/2 transform -translate-y-1/2">
            <ArrowRight className="text-muted-foreground animate-pulse" />
          </div>
        )}
        
        {/* Arrows to BESS */}
        {currentData.charge > 0 && (
          <div className="absolute -left-8 top-1/2 transform -translate-y-1/2">
            <ArrowRight className="text-muted-foreground animate-pulse" />
          </div>
        )}
      </div>
    </div>
  );
}
