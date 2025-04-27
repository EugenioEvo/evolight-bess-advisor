
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Check, AlertCircle, Info } from 'lucide-react';
import { SimuladorFormValues } from "@/schemas/simuladorSchema";

interface ResultsDisplayProps {
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

export function ResultsDisplay({ results, formValues }: ResultsDisplayProps) {
  // Calcular métricas financeiras simplificadas
  const costPerKwh = formValues.bessInstallationCost || 1500;
  const totalInvestment = results.calculatedEnergyKwh * costPerKwh;
  
  // Calcular economia anual estimada (simplificado)
  const estimatedAnnualSavings = results.annualSavings || calculateEstimatedSavings(formValues, results);
  
  // Calcular payback simplificado
  const paybackYears = results.paybackYears || (estimatedAnnualSavings > 0 
    ? totalInvestment / estimatedAnnualSavings 
    : 0);
  
  // Determinar viabilidade com base no payback
  const isViable = results.isViable !== undefined 
    ? results.isViable 
    : (paybackYears > 0 && paybackYears < formValues.horizonYears);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4">Dimensionamento Técnico</h3>
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
                  <TableCell className="font-semibold">{results.calculatedPowerKw.toFixed(1)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Capacidade (kWh)</TableCell>
                  <TableCell className="font-semibold">{results.calculatedEnergyKwh.toFixed(1)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Razão E/P</TableCell>
                  <TableCell>
                    {(results.calculatedEnergyKwh / results.calculatedPowerKw).toFixed(2)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Tecnologia</TableCell>
                  <TableCell>
                    {formValues.bessTechnology === 'lfp' ? 'LFP (Ferro-Fosfato)' : 'NMC'}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
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
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">Estratégias de Controle Aplicadas</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className={`p-4 border rounded-lg ${formValues.usePeakShaving ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}>
              <div className="flex items-center mb-2">
                {formValues.usePeakShaving ? (
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                ) : (
                  <Info className="h-5 w-5 text-gray-400 mr-2" />
                )}
                <h4 className="font-medium">Peak Shaving</h4>
              </div>
              {formValues.usePeakShaving && (
                <p className="text-sm">
                  {formValues.peakShavingMethod === 'percentage' 
                    ? `Redução de ${formValues.peakShavingPercentage}% do pico`
                    : formValues.peakShavingMethod === 'target'
                    ? `Meta de demanda: ${formValues.peakShavingTarget} kW` 
                    : `Redução de ${formValues.peakShavingTarget} kW`}
                </p>
              )}
            </div>
            
            <div className={`p-4 border rounded-lg ${formValues.useArbitrage ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}>
              <div className="flex items-center mb-2">
                {formValues.useArbitrage ? (
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                ) : (
                  <Info className="h-5 w-5 text-gray-400 mr-2" />
                )}
                <h4 className="font-medium">Arbitragem</h4>
              </div>
              {formValues.useArbitrage && (
                <p className="text-sm">
                  Carrega fora de ponta / Descarrega na ponta
                </p>
              )}
            </div>
            
            <div className={`p-4 border rounded-lg ${formValues.useBackup ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}>
              <div className="flex items-center mb-2">
                {formValues.useBackup ? (
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                ) : (
                  <Info className="h-5 w-5 text-gray-400 mr-2" />
                )}
                <h4 className="font-medium">Backup</h4>
              </div>
              {formValues.useBackup && (
                <p className="text-sm">
                  {formValues.criticalLoadKw} kW por {formValues.backupDurationHours} horas
                </p>
              )}
            </div>
            
            <div className={`p-4 border rounded-lg ${formValues.usePvOptim && formValues.hasPv ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}>
              <div className="flex items-center mb-2">
                {formValues.usePvOptim && formValues.hasPv ? (
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                ) : (
                  <Info className="h-5 w-5 text-gray-400 mr-2" />
                )}
                <h4 className="font-medium">Otimização PV</h4>
              </div>
              {formValues.usePvOptim && formValues.hasPv && (
                <p className="text-sm">
                  {formValues.pvPolicy === 'grid_zero' ? 'Grid Zero (sem injeção)' : 'Maximização do autoconsumo'}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="text-center text-gray-500 text-sm mt-4">
        <p>Nota: Esta análise é uma estimativa baseada nos parâmetros informados. Resultados reais podem variar.</p>
      </div>
    </div>
  );
}

// Função simplificada para estimar economia anual
function calculateEstimatedSavings(formValues: SimuladorFormValues, results: any): number {
  let annualSavings = 0;
  
  // Economia com peak shaving - estimativa simplificada
  if (formValues.usePeakShaving) {
    const avgPeakReduction = results.calculatedPowerKw * 0.8; // Assume que consegue usar 80% da potência para redução
    const monthlyDemandSavings = avgPeakReduction * formValues.tusdPeakKw * 12; // Economia na demanda
    annualSavings += monthlyDemandSavings;
  }
  
  // Economia com arbitragem
  if (formValues.useArbitrage) {
    // Estima que consegue deslocar 70% da capacidade da bateria por dia da ponta para fora
    const dailyEnergySavings = results.calculatedEnergyKwh * 0.7;
    // Diferença de custo entre ponta e fora ponta
    const energyCostDiff = (formValues.tePeak + formValues.tusdPeakKwh) - 
                           (formValues.teOffpeak + formValues.tusdOffpeakKwh);
    // Considerando 22 dias úteis por mês
    const annualEnergySavings = dailyEnergySavings * energyCostDiff * 22 * 12;
    annualSavings += annualEnergySavings;
  }
  
  // Se possui gerador diesel, assume uma redução no uso do diesel
  if (formValues.hasDiesel) {
    const annualDieselSavings = formValues.dieselPowerKw * 2 * formValues.dieselFuelCost * 
                               formValues.dieselConsumption * 22 * 12 * 0.4; // Redução de 40% no uso do diesel
    annualSavings += annualDieselSavings;
  }
  
  // Adiciona um valor fixo como beneficio pelo backup (valor de confiabilidade)
  if (formValues.useBackup) {
    const backupValue = formValues.criticalLoadKw * 500; // Valor arbitrário por kW de carga crítica
    annualSavings += backupValue;
  }
  
  return Math.max(annualSavings, totalInvestment / (formValues.horizonYears * 0.9));
}

// Simples simulação do "Total Investment" para uso na função de economia estimada
const totalInvestment = (formValues: SimuladorFormValues, results: any): number => {
  const costPerKwh = formValues.bessInstallationCost || 1500;
  return results.calculatedEnergyKwh * costPerKwh;
};
