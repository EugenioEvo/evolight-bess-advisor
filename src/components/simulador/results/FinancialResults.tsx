
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { SimuladorFormValues } from "@/schemas/simuladorSchema";
import { ViabilityIndicator } from './financial/ViabilityIndicator';
import { MetricsTable } from './financial/MetricsTable';

interface FinancialResultsProps {
  results: {
    calculatedEnergyKwh: number;
    paybackYears?: number;
    annualSavings?: number;
    roi?: number;
    isViable?: boolean;
  };
  formValues: SimuladorFormValues;
}

export function FinancialResults({ results, formValues }: FinancialResultsProps) {
  const totalInvestment = results.calculatedEnergyKwh * (formValues.bessInstallationCost || 1500);
  const estimatedAnnualSavings = results.annualSavings || 0;
  const paybackYears = results.paybackYears || 0;
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
