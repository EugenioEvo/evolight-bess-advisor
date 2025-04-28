
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
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
  const costPerKwh = formValues.bessInstallationCost || 1500;
  const totalInvestment = results.calculatedEnergyKwh * costPerKwh;
  const estimatedAnnualSavings = results.annualSavings || 0;
  const paybackYears = results.paybackYears || 0;
  
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Relatório Detalhado</h3>
      
      <Accordion type="single" collapsible className="w-full">
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
        
        <AccordionItem value="premises">
          <AccordionTrigger className="font-medium">Premissas Utilizadas</AccordionTrigger>
          <AccordionContent>
            <div className="py-2">
              <h4 className="font-medium mb-2">Parâmetros do Projeto</h4>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Parâmetro</TableHead>
                    <TableHead>Valor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Tipo de Instalação</TableCell>
                    <TableCell>{formValues.installationType === 'industrial' ? 'Industrial' : 'Comercial'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Demanda Média (kW)</TableCell>
                    <TableCell>{formValues.avgPeakDemandKw}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Demanda Máxima (kW)</TableCell>
                    <TableCell>{formValues.maxPeakDemandKw}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Grupo Tarifário</TableCell>
                    <TableCell>{formValues.tarifaryGroup === 'groupA' ? 'Grupo A' : 'Grupo B'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Horizonte de Análise (anos)</TableCell>
                    <TableCell>{formValues.horizonYears}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              
              <h4 className="font-medium mt-4 mb-2">Estratégias de Controle</h4>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-2 ${formValues.usePeakShaving ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <span>Peak Shaving</span>
                </div>
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-2 ${formValues.useArbitrage ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <span>Arbitragem</span>
                </div>
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-2 ${formValues.useBackup ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <span>Backup</span>
                </div>
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-2 ${formValues.usePvOptim ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <span>Integração PV</span>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="technical">
          <AccordionTrigger className="font-medium">Detalhes Técnicos</AccordionTrigger>
          <AccordionContent>
            <div className="py-2">
              <h4 className="font-medium mb-2">Especificações do BESS</h4>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Parâmetro</TableHead>
                    <TableHead>Valor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Potência (kW)</TableCell>
                    <TableCell>{results.calculatedPowerKw.toFixed(1)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Capacidade (kWh)</TableCell>
                    <TableCell>{results.calculatedEnergyKwh.toFixed(1)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Razão E/P</TableCell>
                    <TableCell>{(results.calculatedEnergyKwh / results.calculatedPowerKw).toFixed(2)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Eficiência Round-Trip</TableCell>
                    <TableCell>{formValues.bessEfficiency}%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Profundidade de Descarga Máxima</TableCell>
                    <TableCell>{formValues.bessMaxDod}%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Tecnologia</TableCell>
                    <TableCell>{formValues.bessTechnology === 'lfp' ? 'LFP (Lítio Ferro Fosfato)' : 'NMC'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Degradação Anual</TableCell>
                    <TableCell>{formValues.bessAnnualDegradation}%</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              
              {/* Ciclos de vida e detalhes de operação estimados */}
              <div className="mt-4">
                <h4 className="font-medium mb-2">Operação Estimada</h4>
                <p>Ciclos diários: {formValues.usePeakShaving ? '1' : '0.5'}</p>
                <p>Ciclos anuais: ~{formValues.usePeakShaving ? '365' : '180'}</p>
                <p>Vida útil estimada: ~{formValues.bessLifetime} anos</p>
                <p>Degradação ao final da vida útil: ~{(formValues.bessAnnualDegradation * formValues.bessLifetime).toFixed(1)}%</p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
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
      </Accordion>
    </div>
  );
}
