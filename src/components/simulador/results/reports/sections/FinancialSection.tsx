
import React from 'react';
import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Table, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { SimuladorFormValues } from "@/schemas/simuladorSchema";

interface FinancialSectionProps {
  results: {
    calculatedEnergyKwh: number;
    calculatedPowerKw: number;
    paybackYears?: number;
    annualSavings?: number;
  };
  formValues: SimuladorFormValues;
}

export function FinancialSection({ results, formValues }: FinancialSectionProps) {
  // Cálculo de unidades BESS necessárias (sempre pelo menos 1 unidade, ou o valor inteiro imediatamente inferior)
  const rawUnitsRequired = results.calculatedPowerKw / 108;
  const bessUnitsRequired = rawUnitsRequired < 1 ? 1 : Math.floor(rawUnitsRequired);
  
  // Cálculo do investimento total considerando unidades BESS indivisíveis
  let totalInvestment = 0;
  
  if (formValues.capexCost > 0) {
    // Se forneceu um custo total manual, use esse valor
    totalInvestment = formValues.capexCost;
  } else if (formValues.bessUnitCost > 0) {
    // Se forneceu custo por unidade BESS, calcule baseado no número de unidades
    totalInvestment = bessUnitsRequired * formValues.bessUnitCost;
  } else {
    // Caso contrário, use o custo por kWh
    totalInvestment = results.calculatedEnergyKwh * (formValues.bessInstallationCost || 1500);
  }
  
  const estimatedAnnualSavings = results.annualSavings || 0;
  const paybackYears = results.paybackYears || 0;
  
  return (
    <AccordionItem value="financial">
      <AccordionTrigger className="font-medium">Análise Financeira</AccordionTrigger>
      <AccordionContent>
        <div className="py-2 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Investimento</h4>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell>Investimento Total</TableCell>
                    <TableCell>R$ {totalInvestment.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Unidades BESS (108kW)</TableCell>
                    <TableCell>{bessUnitsRequired} unidades</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Modelo de Negócio</TableCell>
                    <TableCell>{formValues.businessModel === 'turnkey' ? 'Compra Direta' : 'EAAS/Locação'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>O&M Anual</TableCell>
                    <TableCell>{formValues.annualOmCost}% do CAPEX</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Resultados Financeiros</h4>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell>Economia Anual</TableCell>
                    <TableCell>R$ {estimatedAnnualSavings.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Payback Simples</TableCell>
                    <TableCell>{paybackYears.toFixed(1)} anos</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>ROI</TableCell>
                    <TableCell>{((estimatedAnnualSavings * formValues.horizonYears) / totalInvestment * 100).toFixed(1)}%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Taxa de Desconto</TableCell>
                    <TableCell>{formValues.discountRate}%</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Disclaimer Tributário</h4>
            <p className="text-sm text-muted-foreground">
              Esta análise financeira é uma simulação para fins informativos. Os resultados reais podem variar dependendo 
              das condições específicas do projeto, mudanças tributárias, variações nas tarifas de energia, entre outros fatores. 
              {formValues.considerTaxes ? ` Os cálculos consideram uma alíquota combinada de ${formValues.taxRate}% para efeito de tributos.` : ' Tributos não foram considerados nesta análise.'}
            </p>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
