
import React from 'react';
import { AnalysisSection } from '../AnalysisSection';
import { SimuladorFormValues } from '@/schemas/simuladorSchema';

interface AnaliseTabProps {
  simulationResults: {
    calculatedPowerKw: number;
    calculatedEnergyKwh: number;
    paybackYears?: number;
    annualSavings?: number;
    roi?: number;
    npv?: number;
    isViable?: boolean;
  } | null;
  formValues: SimuladorFormValues;
  onChangeTab: (tab: string) => void;
}

export function AnaliseTab({ simulationResults, formValues, onChangeTab }: AnaliseTabProps) {
  return (
    <AnalysisSection 
      simulationResults={simulationResults} 
      formValues={formValues}
      onChangeTab={onChangeTab}
    />
  );
}
