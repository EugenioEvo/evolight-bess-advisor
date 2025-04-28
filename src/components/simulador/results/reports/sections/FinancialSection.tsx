
import React from 'react';
import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Table, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { SimuladorFormValues } from "@/schemas/simuladorSchema";

interface FinancialSectionProps {
  results: {
    calculatedEnergyKwh: number;
    paybackYears?: number;
    annualSavings?: number;
  };
  formValues: SimuladorFormValues;
}

export function FinancialSection({ results, formValues }: FinancialSectionProps) {
  const costPerKwh = formValues.bessInstallationCost || 1500;
  const totalInvestment = results.calculatedEnergyKwh * costPerKwh;
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
                    <TableCell>Custo BESS (R$/kWh)</TableCell>
                    <TableCell>R$ {costPerKwh.toLocaleString('pt-BR')}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Investimento Total</TableCell>
                    <TableCell>R$ {totalInvestment.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}</TableCell>
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
