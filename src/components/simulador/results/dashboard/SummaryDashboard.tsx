
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
  // BESS module specifications
  const MODULE_POWER_KW = 108; // kW
  const MODULE_ENERGY_KWH = 215; // kWh
  
  // Calculate required number of modules based on both power and energy
  const modulesByPower = Math.ceil(results.calculatedPowerKw / MODULE_POWER_KW);
  const modulesByEnergy = Math.ceil(results.calculatedEnergyKwh / MODULE_ENERGY_KWH);
  const bessUnitsRequired = Math.max(modulesByPower, modulesByEnergy, 1); // At least 1 unit
  
  // Calculate actual power and energy from the number of modules
  const actualPowerKw = bessUnitsRequired * MODULE_POWER_KW;
  const actualEnergyKwh = bessUnitsRequired * MODULE_ENERGY_KWH;
  
  // Cálculo do investimento total considerando unidades BESS indivisíveis
  let totalInvestment = 0;
  
  if (formValues.capexCost > 0) {
    // Se forneceu um custo total manual, use esse valor
    totalInvestment = formValues.capexCost;
  } else if (formValues.bessUnitCost > 0) {
    // Se forneceu custo por unidade BESS, calcule baseado no número de unidades
    totalInvestment = bessUnitsRequired * formValues.bessUnitCost;
  } else {
    // Caso contrário, use o custo por kWh com base na capacidade real
    totalInvestment = actualEnergyKwh * (formValues.bessInstallationCost || 1500);
  }
  
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
          powerKw={actualPowerKw} 
          energyKwh={actualEnergyKwh}
          bessUnits={bessUnitsRequired}
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
