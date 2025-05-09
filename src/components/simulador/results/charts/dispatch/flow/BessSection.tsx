
import React from 'react';
import { ArrowRight, Battery, BatteryCharging } from 'lucide-react';

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
  
  // Calculate rotation for arrow animations
  const chargeArrowClass = "animate-pulse text-muted-foreground";
  const dischargeArrowClass = "animate-pulse text-muted-foreground";
  
  return (
    <div className="flex justify-center items-center h-1/3 relative">
      <div className="relative">
        <div 
          className="w-64 h-32 rounded-lg border-2 flex flex-col items-center justify-center relative"
          style={{ borderColor: chartColors.soc }}
        >
          <div className="absolute top-2 left-2">
            <BatteryIcon 
              size={24} 
              className={currentData.charge > 0 ? "animate-pulse" : ""} 
              style={{ color: chartColors.soc }}
            />
          </div>
          
          <div className="text-center">
            <div className="font-bold">BESS</div>
            <div className="text-sm">Estado de Carga: {formatNumber(currentData.soc)}%</div>
            
            {currentData.charge > 0 && (
              <div className="mt-1 text-sm py-1 px-2 rounded flex items-center gap-1" style={{ backgroundColor: chartColors.charge + '40' }}>
                <ArrowRight size={12} className="rotate-180" />
                <span>Carregando: +{formatNumber(currentData.charge)} kW</span>
              </div>
            )}
            
            {currentData.discharge > 0 && (
              <div className="mt-1 text-sm py-1 px-2 rounded flex items-center gap-1" style={{ backgroundColor: chartColors.discharge + '40' }}>
                <ArrowRight size={12} />
                <span>Descarregando: -{formatNumber(currentData.discharge)} kW</span>
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
        
        {/* Arrows connecting to BESS */}
        <div className="absolute -right-12 top-1/2 transform -translate-y-1/2 flex flex-col gap-4">
          {currentData.discharge > 0 && (
            <div className="flex items-center">
              <ArrowRight className={dischargeArrowClass} />
            </div>
          )}
        </div>
        
        <div className="absolute -left-12 top-1/2 transform -translate-y-1/2 flex flex-col gap-4">
          {currentData.charge > 0 && (
            <div className="flex items-center">
              <ArrowRight className={chargeArrowClass} />
            </div>
          )}
        </div>
        
        {/* Connection lines for the spider web effect */}
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 h-12 border-l border-dashed opacity-50" style={{ borderColor: chartColors.soc }}></div>
        <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 h-12 border-l border-dashed opacity-50" style={{ borderColor: chartColors.soc }}></div>
      </div>
    </div>
  );
}
