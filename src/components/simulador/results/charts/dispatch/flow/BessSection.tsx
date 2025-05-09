
import React from 'react';
import { Battery, BatteryCharging, Zap } from 'lucide-react';

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
  // Determine which battery icon to use
  const BatteryIcon = currentData.charge > 0 ? BatteryCharging : Battery;
  
  return (
    <div className="w-48 h-48 relative">
      <div 
        className="w-full h-full rounded-lg border-2 flex flex-col items-center justify-center shadow-lg transform transition-transform hover:scale-105"
        style={{ 
          borderColor: chartColors.soc,
          background: `linear-gradient(to top, ${chartColors.soc}40 ${currentData.soc}%, transparent ${currentData.soc}%)`
        }}
      >
        <div className="absolute top-2 right-2">
          <BatteryIcon 
            size={24} 
            className={currentData.charge > 0 ? "animate-pulse" : ""} 
            style={{ color: chartColors.soc }}
          />
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <Zap size={28} className="text-yellow-500" />
          </div>
          <div className="font-bold text-lg">BESS</div>
          <div className="mt-1">Estado de Carga: {formatNumber(currentData.soc)}%</div>
          
          <div className="flex flex-col gap-2 mt-3">
            {currentData.charge > 0 && (
              <div className="text-sm py-1 px-2 rounded flex items-center justify-center gap-1" 
                  style={{ backgroundColor: chartColors.charge + '40' }}>
                <span>Carregando: +{formatNumber(currentData.charge)} kW</span>
              </div>
            )}
            
            {currentData.discharge > 0 && (
              <div className="text-sm py-1 px-2 rounded flex items-center justify-center gap-1" 
                  style={{ backgroundColor: chartColors.discharge + '40' }}>
                <span>Descarregando: -{formatNumber(currentData.discharge)} kW</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
