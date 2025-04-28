
import React from 'react';
import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { SimuladorFormValues } from "@/schemas/simuladorSchema";

interface SummarySectionProps {
  results: {
    calculatedEnergyKwh: number;
    calculatedPowerKw: number;
    paybackYears?: number;
    annualSavings?: number;
  };
  formValues: SimuladorFormValues;
}

export function SummarySection({ results, formValues }: SummarySectionProps) {
  const estimatedAnnualSavings = results.annualSavings || 0;
  const costPerKwh = formValues.bessInstallationCost || 1500;
  const totalInvestment = results.calculatedEnergyKwh * costPerKwh;
  const paybackYears = results.paybackYears || 0;
  
  return (
    <AccordionItem value="summary">
      <AccordionTrigger className="font-medium">Sumário Executivo</AccordionTrigger>
      <AccordionContent>
        <div className="py-2 space-y-4">
          <p>
            O sistema de armazenamento de energia (BESS) dimensionado para {formValues.projectName || "este projeto"} 
            possui capacidade de {results.calculatedEnergyKwh.toFixed(1)} kWh e potência de {results.calculatedPowerKw.toFixed(1)} kW, 
            composto por baterias de tecnologia {formValues.bessTechnology === 'lfp' ? 'Lítio Ferro Fosfato (LFP)' : 'Lítio NMC'}.
          </p>
          <p>
            A análise financeira indica um payback simples de {paybackYears.toFixed(1)} anos, com economia anual estimada 
            em R$ {estimatedAnnualSavings.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}. O investimento estimado 
            é de R$ {totalInvestment.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}, com retorno sobre investimento 
            de {((estimatedAnnualSavings * formValues.horizonYears) / totalInvestment * 100).toFixed(1)}% ao longo do período de {formValues.horizonYears} anos.
          </p>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
