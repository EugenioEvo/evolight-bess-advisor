
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
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Relatório Detalhado</h3>
      
      <Accordion type="single" collapsible className="w-full">
        <SummarySection results={results} formValues={formValues} />
        <PremisesSection formValues={formValues} />
        <TechnicalSection results={results} formValues={formValues} />
        <FinancialSection results={results} formValues={formValues} />
      </Accordion>
    </div>
  );
}
