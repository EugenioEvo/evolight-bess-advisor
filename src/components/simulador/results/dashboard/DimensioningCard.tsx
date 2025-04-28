
import React from 'react';
import { DashboardCard } from './DashboardCard';

interface DimensioningCardProps {
  powerKw: number;
  energyKwh: number;
}

export function DimensioningCard({ powerKw, energyKwh }: DimensioningCardProps) {
  const ratio = energyKwh / powerKw;
  
  return (
    <DashboardCard
      title="Dimensionamento"
      value={`${powerKw.toFixed(1)} kW / ${energyKwh.toFixed(1)} kWh`}
      subtitle={`Razão Energia/Potência: ${ratio.toFixed(2)}`}
    />
  );
}
