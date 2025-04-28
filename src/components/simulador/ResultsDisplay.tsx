
import React from 'react';
import { SimuladorFormValues } from "@/schemas/simuladorSchema";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { SummaryDashboard } from './results/dashboard/SummaryDashboard';
import { InteractiveCharts } from './results/charts/InteractiveCharts';
import { DetailedReport } from './results/reports/DetailedReport';
import { ExportButtons } from './results/export/ExportButtons';
import { SensitivityAnalysis } from './results/sensitivity/SensitivityAnalysis';

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
  return (
    <div className="space-y-6">
      <SummaryDashboard results={results} formValues={formValues} />
      
      <Tabs defaultValue="charts" className="mt-8">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="charts">Gráficos Interativos</TabsTrigger>
          <TabsTrigger value="report">Relatório Detalhado</TabsTrigger>
          <TabsTrigger value="sensitivity">Análise de Sensibilidade</TabsTrigger>
        </TabsList>
        
        <TabsContent value="charts" className="space-y-6">
          <InteractiveCharts results={results} formValues={formValues} />
        </TabsContent>
        
        <TabsContent value="report" className="space-y-6">
          <DetailedReport results={results} formValues={formValues} />
          
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Exportação</h3>
            <ExportButtons results={results} formValues={formValues} />
          </div>
        </TabsContent>
        
        <TabsContent value="sensitivity" className="space-y-6">
          <SensitivityAnalysis results={results} formValues={formValues} />
        </TabsContent>
      </Tabs>
      
      <div className="text-center text-gray-500 text-sm mt-8">
        <p>Nota: Esta análise é uma estimativa baseada nos parâmetros informados. Resultados reais podem variar.</p>
      </div>
    </div>
  );
}
