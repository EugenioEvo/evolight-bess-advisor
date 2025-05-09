
import React, { useMemo } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { PowerChart } from './PowerChart';
import { SocChart } from './SocChart';
import { CashFlowChart } from './CashFlowChart';
import { EnergyDispatchChart } from './EnergyDispatchChart';
import { generatePowerData } from './data-generators/powerDataGenerator';
import { generateSoCData } from './data-generators/socDataGenerator';
import { generateCashFlowData } from './data-generators/cashFlowDataGenerator';
import { generateEnergyDispatchData } from './data-generators/energyDispatchDataGenerator';
import { SimuladorFormValues } from "@/schemas/simuladorSchema";
import { BessDispatchPoint } from '@/hooks/bessSimulation/types';

interface ChartTabsProps {
  results: {
    calculatedPowerKw: number;
    calculatedEnergyKwh: number;
    paybackYears?: number;
    annualSavings?: number;
    dispatch24h?: BessDispatchPoint[];
  };
  formValues: SimuladorFormValues;
}

export function ChartTabs({ results, formValues }: ChartTabsProps) {
  console.log("Chart Tabs Results:", results);
  // Check if we have real dispatch data
  const hasRealDispatchData = results.dispatch24h && 
                              Array.isArray(results.dispatch24h) && 
                              results.dispatch24h.length > 0;
  
  // Ensure we have valid values from form or results - no longer limiting to max values
  const bessPower = typeof formValues.bessPowerKw === 'number' && formValues.bessPowerKw > 0 
    ? formValues.bessPowerKw 
    : typeof results.calculatedPowerKw === 'number' && results.calculatedPowerKw > 0
      ? results.calculatedPowerKw
      : 108; // Default fallback value if both sources are invalid
      
  const bessCapacity = typeof formValues.bessCapacityKwh === 'number' && formValues.bessCapacityKwh > 0
    ? formValues.bessCapacityKwh
    : typeof results.calculatedEnergyKwh === 'number' && results.calculatedEnergyKwh > 0
      ? results.calculateEnergyKwh
      : 215; // Default fallback value if both sources are invalid
  
  // Generate power data with validated values
  const powerData = generatePowerData(
    formValues, 
    bessCapacity, 
    bessPower
  );
  
  const socData = generateSoCData(formValues);
  
  const annualSavings = typeof results.annualSavings === 'number' && results.annualSavings > 0
    ? results.annualSavings
    : 50000; // Default fallback value if invalid
  
  const cashFlowData = generateCashFlowData(
    formValues, 
    bessCapacity, 
    annualSavings
  );
  
  // Use real dispatch data if available, or generate synthetic data
  const dispatchData = useMemo(() => {
    if (hasRealDispatchData) {
      console.log("Using real dispatch data:", results.dispatch24h);
      return results.dispatch24h.map(point => ({
        hour: point.hour as 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23,
        load: point.load,
        pv: point.pv,
        diesel: point.diesel,
        charge: point.charge,
        discharge: point.discharge,
        grid: point.grid,
        soc: point.soc,
        dieselRef: point.dieselRef,
      }));
    } else {
      console.log("Generating synthetic dispatch data");
      return generateEnergyDispatchData(powerData, socData);
    }
  }, [hasRealDispatchData, results.dispatch24h, powerData, socData]);
  
  return (
    <Tabs defaultValue="dispatch">
      <TabsList className="grid grid-cols-4 mb-4">
        <TabsTrigger value="dispatch">Despacho</TabsTrigger>
        <TabsTrigger value="power">Perfil de Potência</TabsTrigger>
        <TabsTrigger value="soc">Estado de Carga</TabsTrigger>
        <TabsTrigger value="cashflow">Fluxo de Caixa</TabsTrigger>
      </TabsList>
      
      <TabsContent value="dispatch">
        <Card className="h-[450px]">
          <CardContent className="p-4 h-full">
            <EnergyDispatchChart 
              data={dispatchData} 
              highlightPeakHours={true}
              peakStartHour={formValues.peakStartHour}
              peakEndHour={formValues.peakEndHour}
            />
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="power">
        <Card className="h-[400px]">
          <CardContent className="p-4 h-full">
            <PowerChart data={powerData} formValues={formValues} />
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="soc">
        <Card className="h-[400px]">
          <CardContent className="p-4 h-full">
            <SocChart data={socData} formValues={formValues} />
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="cashflow">
        <Card className="h-[400px]">
          <CardContent className="p-4 h-full">
            <CashFlowChart data={cashFlowData} />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
