
import React from 'react';
import { UseFormReturn } from "react-hook-form";
import { SimuladorFormValues } from "@/schemas/simuladorSchema";
import { CommonFields } from './financial/CommonFields';
import { TurnkeyFields } from './financial/TurnkeyFields';
import { EaasFields } from './financial/EaasFields';
import { IncentivesFields } from './financial/IncentivesFields';
import { GridUpgradeSection } from './financial/GridUpgradeSection';
import { TaxSection } from './financial/TaxSection';

interface FinancialSectionProps {
  form: UseFormReturn<SimuladorFormValues>;
}

export function FinancialSection({ form }: FinancialSectionProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Parâmetros Financeiros</h3>
      
      <CommonFields form={form} />
      
      {form.watch("businessModel") === "turnkey" ? (
        <TurnkeyFields form={form} />
      ) : (
        <EaasFields form={form} />
      )}
      
      <IncentivesFields form={form} />
      
      <GridUpgradeSection form={form} />
      
      <TaxSection form={form} />
    </div>
  );
}
