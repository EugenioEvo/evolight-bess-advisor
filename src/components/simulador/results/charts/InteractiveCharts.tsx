
import React from 'react';
import { ChartTabs } from './ChartTabs';
import { SimuladorFormValues } from "@/schemas/simuladorSchema";

interface InteractiveChartsProps {
  results: {
    calculatedPowerKw: number;
    calculatedEnergyKwh: number;
    paybackYears?: number;
    annualSavings?: number;
  };
  formValues: SimuladorFormValues;
}

export function InteractiveCharts({ results, formValues }: InteractiveChartsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Gráficos Interativos</h3>
      <ChartTabs results={results} formValues={formValues} />
    </div>
  );
}
