
import React from 'react';
import { SimuladorFormValues } from "@/schemas/simuladorSchema";
import { ViabilityIndicator } from '../financial/ViabilityIndicator';
import { DimensioningCard } from './DimensioningCard';
import { PaybackCard } from './PaybackCard';
import { SavingsCard } from './SavingsCard';

interface SummaryDashboardProps {
  results: {
    calculatedPowerKw: number;
    calculatedEnergyKwh: number;
    paybackYears?: number;
    annualSavings?: number;
    roi?: number;
    npv?: number;
    isViable?: boolean;
  };
  formValues: SimuladorFormValues;
}

export function SummaryDashboard({ results, formValues }: SummaryDashboardProps) {
  const costPerKwh = formValues.bessInstallationCost || 1500;
  const totalInvestment = results.calculatedEnergyKwh * costPerKwh;
  const estimatedAnnualSavings = results.annualSavings || 0;
  const paybackYears = results.paybackYears || 0;
  const isViable = results.isViable !== undefined 
    ? results.isViable 
    : (paybackYears > 0 && paybackYears < formValues.horizonYears);

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Dashboard de Resultados</h3>
      
      <ViabilityIndicator isViable={isViable} />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {/* Dimensionamento KPIs */}
        <DimensioningCard 
          powerKw={results.calculatedPowerKw} 
          energyKwh={results.calculatedEnergyKwh}
        />

        {/* Financeiro KPIs */}
        <PaybackCard 
          paybackYears={paybackYears}
          annualSavings={estimatedAnnualSavings}
          totalInvestment={totalInvestment}
          horizonYears={formValues.horizonYears}
        />

        {/* Economia KPIs */}
        <SavingsCard
          annualSavings={estimatedAnnualSavings}
          businessModel={formValues.businessModel}
        />
      </div>
    </div>
  );
}
