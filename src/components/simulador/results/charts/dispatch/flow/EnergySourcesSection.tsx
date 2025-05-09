
import React from 'react';
import { Sun, Grid as GridIcon, Fuel } from 'lucide-react';

interface EnergySourcesSectionProps {
  type: 'pv' | 'grid' | 'diesel';
  currentData: any;
  chartColors: Record<string, string>;
  formatNumber: (num: number) => string;
}

export function EnergySourcesSection({ 
  type,
  currentData, 
  chartColors, 
  formatNumber 
}: EnergySourcesSectionProps) {
  // Define source-specific props
  const sourceConfig = {
    pv: {
      value: currentData.pv,
      color: chartColors.pv,
      icon: <Sun size={28} className="animate-pulse" />,
      label: "Fotovoltaico"
    },
    grid: {
      value: currentData.grid,
      color: chartColors.grid,
      icon: <GridIcon size={28} />,
      label: "Rede"
    },
    diesel: {
      value: currentData.diesel,
      color: chartColors.diesel,
      icon: <Fuel size={28} />,
      label: "Diesel"
    }
  };
  
  const { value, color, icon, label } = sourceConfig[type];
  
  if (value <= 0) {
    return null;
  }
  
  return (
    <div className="w-40 h-40 relative">
      <div 
        className="w-full h-full rounded-lg flex flex-col items-center justify-center p-3 text-white shadow-lg border-2 transform transition-transform hover:scale-105"
        style={{ backgroundColor: color, borderColor: `${color}40` }}
      >
        <div className="mb-2">
          {icon}
        </div>
        <div className="text-center">
          <div className="font-bold text-lg">{label}</div>
          <div className="mt-1 text-xl font-semibold">{formatNumber(value)} kW</div>
        </div>
      </div>
    </div>
  );
}
