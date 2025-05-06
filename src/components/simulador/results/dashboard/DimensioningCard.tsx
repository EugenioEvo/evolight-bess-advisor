
import React from 'react';
import { DashboardCard } from './DashboardCard';

interface DimensioningCardProps {
  powerKw: number;
  energyKwh: number;
  bessUnits?: number;
}

export function DimensioningCard({ powerKw, energyKwh, bessUnits }: DimensioningCardProps) {
  // Calculate the actual power and energy based on indivisible module units if bessUnits is provided
  const MODULE_POWER_KW = 108;
  const MODULE_ENERGY_KWH = 215;
  
  const displayPower = bessUnits ? bessUnits * MODULE_POWER_KW : powerKw;
  const displayEnergy = bessUnits ? bessUnits * MODULE_ENERGY_KWH : energyKwh;
  
  return (
    <DashboardCard
      title="Dimensionamento BESS"
      value={`${displayEnergy.toFixed(0)} kWh`}
      subtitle={`${displayPower.toFixed(0)} kW${bessUnits ? ` | ${bessUnits} unidade${bessUnits > 1 ? 's' : ''}` : ''}`}
    />
  );
}
