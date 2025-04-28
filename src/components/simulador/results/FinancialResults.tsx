
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Check, AlertCircle } from 'lucide-react';
import { SimuladorFormValues } from "@/schemas/simuladorSchema";

interface FinancialResultsProps {
  results: {
    calculatedEnergyKwh: number;
    paybackYears?: number;
    annualSavings?: number;
    roi?: number;
    isViable?: boolean;
  };
  formValues: SimuladorFormValues;
}

export function FinancialResults({ results, formValues }: FinancialResultsProps) {
  const costPerKwh = formValues.bessInstallationCost || 1500;
  const totalInvestment = results.calculatedEnergyKwh * costPerKwh;
  const estimatedAnnualSavings = results.annualSavings || 0;
  const paybackYears = results.paybackYears || 0;
  const isViable = results.isViable !== undefined 
    ? results.isViable 
    : (paybackYears > 0 && paybackYears < formValues.horizonYears);

  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-lg font-semibold mb-4">Análise Financeira</h3>
        <div className="flex items-center justify-between mb-4">
          <span className="text-lg">Viabilidade:</span>
          <div className="flex items-center">
            {isViable ? (
              <Check className="h-6 w-6 text-green-500 mr-2" />
            ) : (
              <AlertCircle className="h-6 w-6 text-yellow-500 mr-2" />
            )}
            <span className={isViable ? "text-green-500 font-semibold" : "text-yellow-500 font-semibold"}>
              {isViable ? 'Viável' : 'Revisar Parâmetros'}
            </span>
          </div>
        </div>
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Métrica</TableHead>
              <TableHead>Valor</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Investimento Total</TableCell>
              <TableCell>R$ {totalInvestment.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}</TableCell>
            </TableRow>
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
              <TableCell>
                {(results.roi || ((estimatedAnnualSavings * formValues.horizonYears) / totalInvestment * 100)).toFixed(1)}%
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
