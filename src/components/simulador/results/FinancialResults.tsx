
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { SimuladorFormValues } from "@/schemas/simuladorSchema";
import { ViabilityIndicator } from './financial/ViabilityIndicator';
import { MetricsTable } from './financial/MetricsTable';
import { MODULE_POWER_KW, MODULE_ENERGY_KWH, calculateRequiredModules } from "@/config/bessModuleConfig";

interface FinancialResultsProps {
  results: {
    calculatedEnergyKwh: number;
    calculatedPowerKw: number;
    paybackYears?: number;
    annualSavings?: number;
    roi?: number;
    isViable?: boolean;
  };
  formValues: SimuladorFormValues;
}

export function FinancialResults({ results, formValues }: FinancialResultsProps) {
  // Calculate required number of modules based on both power and energy requirements
  const bessUnitsRequired = calculateRequiredModules(
    results.calculatedPowerKw,
    results.calculatedEnergyKwh
  );
  
  // Calculate actual power and energy based on indivisible modules
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
    // Se nenhum dos valores acima foi fornecido, use o custo por kWh
    // Considerando a energia real baseada nos módulos indivisíveis
    totalInvestment = actualEnergyKwh * (formValues.bessInstallationCost || 1500);
  }
  
  const estimatedAnnualSavings = results.annualSavings || 0;
  const paybackYears = results.paybackYears || (estimatedAnnualSavings > 0 ? totalInvestment / estimatedAnnualSavings : 0);
  const isViable = results.isViable !== undefined 
    ? results.isViable 
    : (paybackYears > 0 && paybackYears < formValues.horizonYears);

  const metrics = [
    {
      label: "Investimento Total",
      value: `R$ ${totalInvestment.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}`,
      highlight: true
    },
    {
      label: `Unidades BESS (${MODULE_POWER_KW}kW/${MODULE_ENERGY_KWH}kWh)`,
      value: `${bessUnitsRequired} un`,
      highlight: true
    },
    {
      label: "Potência Total",
      value: `${actualPowerKw.toFixed(0)} kW`,
      highlight: true
    },
    {
      label: "Capacidade Total",
      value: `${actualEnergyKwh.toFixed(0)} kWh`,
      highlight: true
    },
    {
      label: "Economia Anual",
      value: `R$ ${estimatedAnnualSavings.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}`,
      highlight: true
    },
    {
      label: "Payback Simples",
      value: `${paybackYears.toFixed(1)} anos`
    },
    {
      label: "ROI",
      value: `${(results.roi || ((estimatedAnnualSavings * formValues.horizonYears) / totalInvestment * 100)).toFixed(1)}%`
    }
  ];

  return (
    <Card className="transition-all duration-200 hover:shadow-md">
      <CardContent className="pt-6 space-y-4">
        <h3 className="text-lg font-semibold mb-4">Análise Financeira</h3>
        <ViabilityIndicator isViable={isViable} />
        <MetricsTable metrics={metrics} />
        <p className="text-xs text-muted-foreground mt-4 italic text-center">
          *Valores estimados com base nos parâmetros fornecidos
        </p>
      </CardContent>
    </Card>
  );
}
