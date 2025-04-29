
import React from 'react';
import { DashboardCard } from './DashboardCard';

interface DimensioningCardProps {
  powerKw: number;
  energyKwh: number;
  bessUnits?: number;
}

export function DimensioningCard({ powerKw, energyKwh, bessUnits }: DimensioningCardProps) {
  return (
    <DashboardCard
      title="Dimensionamento BESS"
      value={`${energyKwh.toFixed(1)} kWh`}
      subtitle={`${powerKw.toFixed(1)} kW${bessUnits ? ` | ${bessUnits} unidades` : ''}`}
    />
  );
}
