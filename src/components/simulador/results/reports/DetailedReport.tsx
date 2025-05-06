
import React from 'react';
import { Accordion } from "@/components/ui/accordion";
import { SummarySection } from './sections/SummarySection';
import { PremisesSection } from './sections/PremisesSection';
import { TechnicalSection } from './sections/TechnicalSection';
import { FinancialSection } from './sections/FinancialSection';
import { SimuladorFormValues } from "@/schemas/simuladorSchema";

interface DetailedReportProps {
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

export function DetailedReport({ results, formValues }: DetailedReportProps) {
  // Ensure we have valid results with default values if needed
  const safeResults = {
    calculatedPowerKw: typeof results.calculatedPowerKw === 'number' ? results.calculatedPowerKw : 0,
    calculatedEnergyKwh: typeof results.calculatedEnergyKwh === 'number' ? results.calculatedEnergyKwh : 0,
    paybackYears: typeof results.paybackYears === 'number' ? results.paybackYears : 0,
    annualSavings: typeof results.annualSavings === 'number' ? results.annualSavings : 0,
    roi: typeof results.roi === 'number' ? results.roi : 0,
    npv: typeof results.npv === 'number' ? results.npv : 0,
    isViable: typeof results.isViable === 'boolean' ? results.isViable : false,
  };

  // If no results are provided, show a friendly message
  if (!results || (results.calculatedPowerKw === null && results.calculatedEnergyKwh === null)) {
    return (
      <div className="p-4 text-center">
        <p className="text-gray-500">
          Não há resultados disponíveis. Por favor, execute uma simulação primeiro.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Relatório Detalhado</h3>
      
      <Accordion type="single" collapsible className="w-full">
        <SummarySection results={safeResults} formValues={formValues} />
        <PremisesSection formValues={formValues} />
        <TechnicalSection results={safeResults} formValues={formValues} />
        <FinancialSection results={safeResults} formValues={formValues} />
      </Accordion>
    </div>
  );
}
