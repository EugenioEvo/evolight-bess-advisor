
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
  const roiPercentage = ((estimatedAnnualSavings * formValues.horizonYears) / totalInvestment * 100);
  
  return (
    <AccordionItem value="summary">
      <AccordionTrigger className="font-medium">Sumário Executivo</AccordionTrigger>
      <AccordionContent>
        <div className="py-2 space-y-4">
          <p>
            O sistema de armazenamento de energia (BESS) dimensionado para{' '}
            <span className="font-medium">{formValues.projectName || "este projeto"}</span>{' '}
            possui capacidade de <span className="font-medium">{results.calculatedEnergyKwh.toFixed(1)} kWh</span> e potência de{' '}
            <span className="font-medium">{results.calculatedPowerKw.toFixed(1)} kW</span>, 
            composto por baterias de tecnologia{' '}
            <span className="font-medium">
              {formValues.bessTechnology === 'lfp' ? 'Lítio Ferro Fosfato (LFP)' : 'Lítio NMC'}
            </span>.
          </p>
          
          <p>
            A análise financeira indica um <span className="font-medium">payback simples de {paybackYears.toFixed(1)} anos</span>, 
            com economia anual estimada em{' '}
            <span className="font-medium">
              R$ {estimatedAnnualSavings.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}
            </span>. 
            O investimento estimado é de{' '}
            <span className="font-medium">
              R$ {totalInvestment.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}
            </span>, 
            com retorno sobre investimento de <span className="font-medium">{roiPercentage.toFixed(1)}%</span>{' '}
            ao longo do período de {formValues.horizonYears} anos.
          </p>
          
          {formValues.usePeakShaving && (
            <p>
              O sistema foi dimensionado principalmente para{' '}
              <span className="font-medium">redução de demanda na ponta</span>{' '}
              {formValues.useArbitrage && 'e arbitragem de energia'}, proporcionando alívio significativo 
              nos custos de demanda contratada.
            </p>
          )}
          
          {formValues.useBackup && (
            <p>
              Adicionalmente, o sistema fornece{' '}
              <span className="font-medium">
                backup de energia de {formValues.backupDurationHours} horas
              </span>{' '}
              para cargas críticas de {formValues.criticalLoadKw} kW.
            </p>
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
