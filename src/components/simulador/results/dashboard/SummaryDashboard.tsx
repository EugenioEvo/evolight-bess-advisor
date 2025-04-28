
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { SimuladorFormValues } from "@/schemas/simuladorSchema";
import { ViabilityIndicator } from '../financial/ViabilityIndicator';

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
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="text-sm font-medium text-muted-foreground mb-1">Dimensionamento</div>
            <div className="text-2xl font-bold">{results.calculatedPowerKw.toFixed(1)} kW / {results.calculatedEnergyKwh.toFixed(1)} kWh</div>
            <div className="text-xs text-muted-foreground mt-1">Razão E/P: {(results.calculatedEnergyKwh / results.calculatedPowerKw).toFixed(2)}</div>
          </CardContent>
        </Card>

        {/* Financeiro KPIs */}
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="text-sm font-medium text-muted-foreground mb-1">Payback Simples</div>
            <div className="text-2xl font-bold">{paybackYears.toFixed(1)} anos</div>
            <div className="text-xs text-muted-foreground mt-1">ROI: {((estimatedAnnualSavings * formValues.horizonYears) / totalInvestment * 100).toFixed(1)}%</div>
          </CardContent>
        </Card>

        {/* Economia KPIs */}
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="text-sm font-medium text-muted-foreground mb-1">Economia Anual</div>
            <div className="text-2xl font-bold">R$ {estimatedAnnualSavings.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}</div>
            <div className="text-xs text-muted-foreground mt-1">Modelo: {formValues.businessModel === 'turnkey' ? 'Compra Direta' : 'Locação/EAAS'}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
