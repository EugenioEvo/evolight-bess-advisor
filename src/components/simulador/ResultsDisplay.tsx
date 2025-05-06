
import React from 'react';
import { SimuladorFormValues } from "@/schemas/simuladorSchema";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { SummaryDashboard } from './results/dashboard/SummaryDashboard';
import { InteractiveCharts } from './results/charts/InteractiveCharts';
import { DetailedReport } from './results/reports/DetailedReport';
import { ExportButtons } from './results/export/ExportButtons';
import { SensitivityAnalysis } from './results/sensitivity/SensitivityAnalysis';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

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
  // Ensure we have valid numerical values for power and energy
  const validPower = typeof results.calculatedPowerKw === 'number' && 
    !isNaN(results.calculatedPowerKw) && results.calculatedPowerKw > 0;
    
  const validEnergy = typeof results.calculatedEnergyKwh === 'number' && 
    !isNaN(results.calculatedEnergyKwh) && results.calculatedEnergyKwh > 0;
    
  const hasValidResults = results && (validPower || validEnergy);
  
  // Create a safer version of results with defaults for null/undefined values
  const safeResults = {
    calculatedPowerKw: validPower ? results.calculatedPowerKw : 0,
    calculatedEnergyKwh: validEnergy ? results.calculatedEnergyKwh : 0,
    paybackYears: typeof results.paybackYears === 'number' ? results.paybackYears : 0,
    annualSavings: typeof results.annualSavings === 'number' ? results.annualSavings : 0,
    roi: typeof results.roi === 'number' ? results.roi : 0,
    npv: typeof results.npv === 'number' ? results.npv : 0,
    isViable: typeof results.isViable === 'boolean' ? results.isViable : false,
  };
  
  if (!hasValidResults) {
    return (
      <Alert>
        <AlertTitle>Resultados não disponíveis</AlertTitle>
        <AlertDescription>
          Não há resultados de simulação disponíveis. Por favor, execute uma simulação primeiro.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <SummaryDashboard results={safeResults} formValues={formValues} />
      
      <Tabs defaultValue="charts" className="mt-8">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="charts">Gráficos Interativos</TabsTrigger>
          <TabsTrigger value="report">Relatório Detalhado</TabsTrigger>
          <TabsTrigger value="sensitivity">Análise de Sensibilidade</TabsTrigger>
        </TabsList>
        
        <TabsContent value="charts" className="space-y-6">
          <InteractiveCharts results={safeResults} formValues={formValues} />
        </TabsContent>
        
        <TabsContent value="report" className="space-y-6">
          <DetailedReport results={safeResults} formValues={formValues} />
          
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Exportação</h3>
            <ExportButtons results={safeResults} formValues={formValues} />
          </div>
        </TabsContent>
        
        <TabsContent value="sensitivity" className="space-y-6">
          <SensitivityAnalysis results={safeResults} formValues={formValues} />
        </TabsContent>
      </Tabs>
      
      <div className="text-center text-gray-500 text-sm mt-8">
        <p>Nota: Esta análise é uma estimativa baseada nos parâmetros informados. Resultados reais podem variar.</p>
      </div>
    </div>
  );
}
