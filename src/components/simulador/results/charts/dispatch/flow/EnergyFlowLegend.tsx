
import React from 'react';
import { Sun, Grid as GridIcon, Fuel, Battery, Home, ArrowRight } from 'lucide-react';

interface EnergyFlowLegendProps {
  chartColors: Record<string, string>;
}

export function EnergyFlowLegend({ chartColors }: EnergyFlowLegendProps) {
  const legendItems = [
    { label: 'Fotovoltaico', color: chartColors.pv, icon: <Sun size={16} /> },
    { label: 'Rede', color: chartColors.grid, icon: <GridIcon size={16} /> },
    { label: 'Diesel', color: chartColors.diesel, icon: <Fuel size={16} /> },
    { label: 'BESS', color: chartColors.soc, icon: <Battery size={16} /> },
    { label: 'Carga', color: chartColors.load, icon: <Home size={16} /> },
    { label: 'Fluxo de Energia', color: '#666', icon: <ArrowRight size={16} /> },
  ];
  
  return (
    <div className="mt-4 flex flex-wrap items-center justify-center gap-4">
      {legendItems.map((item, index) => (
        <div key={index} className="flex items-center gap-1.5">
          <div className="flex items-center justify-center w-6 h-6" style={{ color: item.color }}>
            {item.icon}
          </div>
          <span className="text-xs text-muted-foreground">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
