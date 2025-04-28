
import React from 'react';
import { SimuladorFormValues } from "@/schemas/simuladorSchema";
import { TechnicalResults } from './results/TechnicalResults';
import { FinancialResults } from './results/FinancialResults';
import { ControlStrategiesResults } from './results/ControlStrategiesResults';

interface ResultsDisplayProps {
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

export function ResultsDisplay({ results, formValues }: ResultsDisplayProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TechnicalResults results={results} formValues={formValues} />
        <FinancialResults results={results} formValues={formValues} />
      </div>
      
      <ControlStrategiesResults formValues={formValues} />
      
      <div className="text-center text-gray-500 text-sm mt-4">
        <p>Nota: Esta análise é uma estimativa baseada nos parâmetros informados. Resultados reais podem variar.</p>
      </div>
    </div>
  );
}
