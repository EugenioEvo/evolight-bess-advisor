
import React from 'react';
import { DashboardCard } from './DashboardCard';
import { MODULE_POWER_KW, MODULE_ENERGY_KWH, calculateActualCapacity } from "@/config/bessModuleConfig";

interface DimensioningCardProps {
  powerKw: number;
  energyKwh: number;
  bessUnits?: number;
}

export function DimensioningCard({ powerKw, energyKwh, bessUnits }: DimensioningCardProps) {
  // Calculate the actual power and energy based on indivisible module units if bessUnits is provided
  const displayValues = bessUnits 
    ? calculateActualCapacity(bessUnits)
    : { powerKw, energyKwh };
  
  return (
    <DashboardCard
      title="Dimensionamento BESS"
      value={`${displayValues.energyKwh.toFixed(0)} kWh`}
      subtitle={`${displayValues.powerKw.toFixed(0)} kW${bessUnits ? ` | ${bessUnits} unidade${bessUnits > 1 ? 's' : ''}` : ''}`}
    />
  );
}
