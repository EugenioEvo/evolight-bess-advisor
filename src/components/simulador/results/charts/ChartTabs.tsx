
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

interface ChartTabsProps {
  results: {
    calculatedPowerKw: number;
    calculatedEnergyKwh: number;
    paybackYears?: number;
    annualSavings?: number;
  };
  formValues: SimuladorFormValues;
}

export function ChartTabs({ results, formValues }: ChartTabsProps) {
  // Ensure we have valid values from form or results
  const bessPower = typeof formValues.bessPowerKw === 'number' && formValues.bessPowerKw > 0 
    ? formValues.bessPowerKw 
    : typeof results.calculatedPowerKw === 'number' && results.calculatedPowerKw > 0
      ? results.calculatedPowerKw
      : 108; // Default fallback value if both sources are invalid
      
  const bessCapacity = typeof formValues.bessCapacityKwh === 'number' && formValues.bessCapacityKwh > 0
    ? formValues.bessCapacityKwh
    : typeof results.calculatedEnergyKwh === 'number' && results.calculatedEnergyKwh > 0
      ? results.calculatedEnergyKwh
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
  
  const dispatchData = useMemo(() => {
    return generateEnergyDispatchData(powerData, socData);
  }, [powerData, socData]);
  
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
