
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { SimuladorFormValues } from "@/schemas/simuladorSchema";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";

interface SensitivityAnalysisProps {
  results: {
    calculatedPowerKw: number;
    calculatedEnergyKwh: number;
    paybackYears?: number;
    annualSavings?: number;
  };
  formValues: SimuladorFormValues;
}

export function SensitivityAnalysis({ results, formValues }: SensitivityAnalysisProps) {
  const [costVariation, setCostVariation] = useState(0);
  const [tariffVariation, setTariffVariation] = useState(0);
  const [discountRate, setDiscountRate] = useState(formValues.discountRate);
  
  // Base calculations
  const costPerKwh = formValues.bessInstallationCost || 1500;
  const baseInvestment = results.calculatedEnergyKwh * costPerKwh;
  const baseAnnualSavings = results.annualSavings || 0;
  
  // Adjusted calculations
  const adjustedCost = costPerKwh * (1 + costVariation / 100);
  const adjustedInvestment = results.calculatedEnergyKwh * adjustedCost;
  const adjustedSavings = baseAnnualSavings * (1 + tariffVariation / 100);
  const adjustedPayback = adjustedSavings > 0 ? adjustedInvestment / adjustedSavings : 0;
  
  // Simple NPV calculation
  const calculateNPV = (investment: number, annualCashFlow: number, rate: number, years: number) => {
    let npv = -investment;
    for (let i = 1; i <= years; i++) {
      npv += annualCashFlow / Math.pow(1 + rate / 100, i);
    }
    return npv;
  };
  
  const baseNPV = calculateNPV(baseInvestment, baseAnnualSavings, formValues.discountRate, formValues.horizonYears);
  const adjustedNPV = calculateNPV(adjustedInvestment, adjustedSavings, discountRate, formValues.horizonYears);
  
  // Simple IRR approximation (very simplified)
  const calculateSimpleROI = (investment: number, annualCashFlow: number, years: number) => {
    return ((annualCashFlow * years) / investment) * 100;
  };
  
  const baseROI = calculateSimpleROI(baseInvestment, baseAnnualSavings, formValues.horizonYears);
  const adjustedROI = calculateSimpleROI(adjustedInvestment, adjustedSavings, formValues.horizonYears);
  
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Análise de Sensibilidade</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="pt-6">
            <h4 className="font-medium mb-4">Ajuste de Parâmetros</h4>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Variação do Custo BESS</span>
                  <span className={costVariation > 0 ? "text-destructive" : costVariation < 0 ? "text-green-600" : ""}>
                    {costVariation > 0 ? "+" : ""}{costVariation}%
                  </span>
                </div>
                <Slider
                  value={[costVariation]}
                  min={-30}
                  max={30}
                  step={5}
                  onValueChange={(value) => setCostVariation(value[0])}
                />
                <div className="text-xs text-muted-foreground">
                  Custo ajustado: R$ {adjustedCost.toLocaleString('pt-BR')} / kWh
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Variação das Tarifas</span>
                  <span className={tariffVariation > 0 ? "text-green-600" : tariffVariation < 0 ? "text-destructive" : ""}>
                    {tariffVariation > 0 ? "+" : ""}{tariffVariation}%
                  </span>
                </div>
                <Slider
                  value={[tariffVariation]}
                  min={-30}
                  max={30}
                  step={5}
                  onValueChange={(value) => setTariffVariation(value[0])}
                />
                <div className="text-xs text-muted-foreground">
                  Economia anual ajustada: R$ {adjustedSavings.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Taxa de Desconto</span>
                  <span>{discountRate}%</span>
                </div>
                <Slider
                  value={[discountRate]}
                  min={5}
                  max={20}
                  step={1}
                  onValueChange={(value) => setDiscountRate(value[0])}
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <h4 className="font-medium mb-4">Comparativo de Resultados</h4>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Indicador</TableHead>
                  <TableHead>Base</TableHead>
                  <TableHead>Ajustado</TableHead>
                  <TableHead>Δ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Investimento (R$)</TableCell>
                  <TableCell>{baseInvestment.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}</TableCell>
                  <TableCell>{adjustedInvestment.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}</TableCell>
                  <TableCell className={adjustedInvestment > baseInvestment ? "text-destructive" : "text-green-600"}>
                    {((adjustedInvestment - baseInvestment) / baseInvestment * 100).toFixed(1)}%
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Economia Anual (R$)</TableCell>
                  <TableCell>{baseAnnualSavings.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}</TableCell>
                  <TableCell>{adjustedSavings.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}</TableCell>
                  <TableCell className={adjustedSavings < baseAnnualSavings ? "text-destructive" : "text-green-600"}>
                    {((adjustedSavings - baseAnnualSavings) / baseAnnualSavings * 100).toFixed(1)}%
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Payback (anos)</TableCell>
                  <TableCell>{results.paybackYears?.toFixed(1) || "N/A"}</TableCell>
                  <TableCell>{adjustedPayback.toFixed(1)}</TableCell>
                  <TableCell className={adjustedPayback > (results.paybackYears || 0) ? "text-destructive" : "text-green-600"}>
                    {(((adjustedPayback - (results.paybackYears || 0)) / (results.paybackYears || 1)) * 100).toFixed(1)}%
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>ROI</TableCell>
                  <TableCell>{baseROI.toFixed(1)}%</TableCell>
                  <TableCell>{adjustedROI.toFixed(1)}%</TableCell>
                  <TableCell className={adjustedROI < baseROI ? "text-destructive" : "text-green-600"}>
                    {(adjustedROI - baseROI).toFixed(1)}%
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>VPL (R$)</TableCell>
                  <TableCell>{baseNPV.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}</TableCell>
                  <TableCell>{adjustedNPV.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}</TableCell>
                  <TableCell className={adjustedNPV < baseNPV ? "text-destructive" : "text-green-600"}>
                    {((adjustedNPV - baseNPV) / Math.abs(baseNPV) * 100).toFixed(1)}%
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            
            <div className="mt-4 p-2 bg-muted rounded text-xs text-muted-foreground">
              Nota: Esta análise de sensibilidade simplificada ajuda a visualizar o impacto das variações de parâmetros na viabilidade do projeto.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
