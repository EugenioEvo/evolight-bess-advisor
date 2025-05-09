
import React from 'react';
import { Sun, Grid, Fuel, Battery, BatteryCharging, Home, ArrowRight } from 'lucide-react';

interface EnergyFlowLegendProps {
  chartColors: Record<string, string>;
}

export function EnergyFlowLegend({ chartColors }: EnergyFlowLegendProps) {
  return (
    <div className="mt-4 flex flex-wrap gap-4 justify-center">
      <div className="flex items-center gap-2">
        <Sun size={16} style={{ color: chartColors.pv }} />
        <span className="text-sm">Fotovoltaico</span>
      </div>
      <div className="flex items-center gap-2">
        <Grid size={16} style={{ color: chartColors.grid }} />
        <span className="text-sm">Rede</span>
      </div>
      <div className="flex items-center gap-2">
        <Fuel size={16} style={{ color: chartColors.diesel }} />
        <span className="text-sm">Diesel</span>
      </div>
      <div className="flex items-center gap-2">
        <BatteryCharging size={16} style={{ color: chartColors.charge }} />
        <span className="text-sm">BESS (carga)</span>
      </div>
      <div className="flex items-center gap-2">
        <Battery size={16} style={{ color: chartColors.discharge }} />
        <span className="text-sm">BESS (descarga)</span>
      </div>
      <div className="flex items-center gap-2">
        <Home size={16} style={{ color: chartColors.load }} />
        <span className="text-sm">Carga</span>
      </div>
      <div className="flex items-center gap-2">
        <ArrowRight size={16} className="text-muted-foreground" />
        <span className="text-sm">Fluxo de energia</span>
      </div>
    </div>
  );
}
