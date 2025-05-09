
import React from 'react';

interface EnergyFlowLegendProps {
  chartColors: Record<string, string>;
}

export function EnergyFlowLegend({ chartColors }: EnergyFlowLegendProps) {
  return (
    <div className="mt-4 flex flex-wrap gap-4 justify-center">
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded" style={{ backgroundColor: chartColors.pv }}></div>
        <span className="text-sm">Fotovoltaico</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded" style={{ backgroundColor: chartColors.grid }}></div>
        <span className="text-sm">Rede</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded" style={{ backgroundColor: chartColors.diesel }}></div>
        <span className="text-sm">Diesel</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded" style={{ backgroundColor: chartColors.discharge }}></div>
        <span className="text-sm">BESS (descarga)</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded" style={{ backgroundColor: chartColors.charge }}></div>
        <span className="text-sm">BESS (carga)</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded" style={{ backgroundColor: chartColors.load }}></div>
        <span className="text-sm">Carga</span>
      </div>
    </div>
  );
}
