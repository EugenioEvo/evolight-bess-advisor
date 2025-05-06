
import React from 'react';
import { UseFormReturn } from "react-hook-form";
import { SimuladorFormValues } from "@/schemas/simuladorSchema";
import { LoadEntrySection } from './tariff/LoadEntrySection';
import { TariffGroupSection } from './tariff/TariffGroupSection';
import { ContractedDemandSection } from './tariff/ContractedDemandSection';
import { TariffRatesSection } from './tariff/TariffRatesSection';

interface TariffSectionProps {
  form: UseFormReturn<SimuladorFormValues>;
}

export function TariffSection({ form }: TariffSectionProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Estrutura Tarifária e Consumo</h3>
      
      <LoadEntrySection form={form} />
      <TariffGroupSection form={form} />
      <ContractedDemandSection form={form} />
      <TariffRatesSection form={form} />
    </div>
  );
}
