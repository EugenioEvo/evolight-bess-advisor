
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ChartTabs } from './ChartTabs';
import { SimuladorFormValues } from '@/schemas/simuladorSchema';
import { DieselBessChart } from '../diesel-bess/DieselBessChart';
import { DieselBessKPI } from '../diesel-bess/DieselBessKPI';
import { processSimulationResults } from '../diesel-bess/computeDispatch';

interface InteractiveChartsProps {
  results: {
    calculatedPowerKw: number;
    calculatedEnergyKwh: number;
    paybackYears?: number;
    annualSavings?: number;
    dispatch24h?: any[];
  };
  formValues: SimuladorFormValues;
}

export function InteractiveCharts({ results, formValues }: InteractiveChartsProps) {
  // Check if we have dispatch data from the new simulation
  const hasDispatchData = results.dispatch24h && Array.isArray(results.dispatch24h) && results.dispatch24h.length > 0;
  
  // Process diesel BESS data if we have dispatch data
  const dieselBessData = hasDispatchData ? processSimulationResults(
    {
      dispatch24h: results.dispatch24h,
      kpiAnnual: results.annualSavings || 0
    }, 
    {
      dieselCost: formValues.dieselFuelCost,
      dieselYield: formValues.dieselConsumption
    }
  ) : null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Gráficos Interativos</h2>
        <ChartTabs results={results} formValues={formValues} />
      </div>

      {formValues.hasDiesel && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Análise BESS vs. Diesel</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <Card className="h-[450px]">
                <CardContent className="p-4 h-full">
                  {dieselBessData ? (
                    <DieselBessChart data={dieselBessData.chartData} />
                  ) : (
                    <p className="flex items-center justify-center h-full text-muted-foreground">
                      Dados insuficientes para análise Diesel vs. BESS.
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card className="h-[450px]">
                <CardContent className="p-4 h-full overflow-auto">
                  {dieselBessData ? (
                    <DieselBessKPI kpi={dieselBessData.kpi} />
                  ) : (
                    <p className="flex items-center justify-center h-full text-muted-foreground">
                      KPIs indisponíveis.
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
