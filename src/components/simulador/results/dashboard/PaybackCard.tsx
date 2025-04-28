
import React from 'react';
import { DashboardCard } from './DashboardCard';

interface PaybackCardProps {
  paybackYears: number;
  annualSavings: number;
  totalInvestment: number;
  horizonYears: number;
}

export function PaybackCard({ paybackYears, annualSavings, totalInvestment, horizonYears }: PaybackCardProps) {
  const roi = ((annualSavings * horizonYears) / totalInvestment * 100);
  
  return (
    <DashboardCard
      title="Payback Simples"
      value={`${paybackYears.toFixed(1)} anos`}
      subtitle={`ROI: ${roi.toFixed(1)}%`}
    />
  );
}
