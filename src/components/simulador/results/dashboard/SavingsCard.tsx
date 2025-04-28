
import React from 'react';
import { DashboardCard } from './DashboardCard';

interface SavingsCardProps {
  annualSavings: number;
  businessModel: string;
}

export function SavingsCard({ annualSavings, businessModel }: SavingsCardProps) {
  const formattedSavings = annualSavings.toLocaleString('pt-BR', { maximumFractionDigits: 2 });
  const modelLabel = businessModel === 'turnkey' ? 'Compra Direta' : 'Locação/EAAS';
  
  return (
    <DashboardCard
      title="Economia Anual"
      value={`R$ ${formattedSavings}`}
      subtitle={`Modelo: ${modelLabel}`}
    />
  );
}
