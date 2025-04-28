
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { PowerChart } from './PowerChart';
import { SocChart } from './SocChart';
import { CashFlowChart } from './CashFlowChart';
import { generatePowerData } from './data-generators/powerDataGenerator';
import { generateSoCData } from './data-generators/socDataGenerator';
import { generateCashFlowData } from './data-generators/cashFlowDataGenerator';
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
  const powerData = generatePowerData(
    formValues, 
    results.calculatedEnergyKwh, 
    results.calculatedPowerKw
  );
  
  const socData = generateSoCData(formValues);
  
  const cashFlowData = generateCashFlowData(
    formValues, 
    results.calculatedEnergyKwh, 
    results.annualSavings
  );
  
  return (
    <Tabs defaultValue="power">
      <TabsList className="grid grid-cols-3 mb-4">
        <TabsTrigger value="power">Perfil de Potência</TabsTrigger>
        <TabsTrigger value="soc">Estado de Carga</TabsTrigger>
        <TabsTrigger value="cashflow">Fluxo de Caixa</TabsTrigger>
      </TabsList>
      
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
            <SocChart data={socData} />
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
