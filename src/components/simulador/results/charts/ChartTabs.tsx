
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
  // Ajuste aqui: usar os valores fixos dos módulos quando os resultados são acima do esperado
  const bessPower = formValues.bessPowerKw || 108;
  const bessCapacity = formValues.bessCapacityKwh || 215;
  
  // Garantir que não exceda os valores do módulo padrão
  const usedPower = Math.min(results.calculatedPowerKw, bessPower);
  const usedCapacity = Math.min(results.calculatedEnergyKwh, bessCapacity);
  
  const powerData = generatePowerData(
    formValues, 
    usedCapacity, 
    usedPower
  );
  
  const socData = generateSoCData(formValues);
  
  const cashFlowData = generateCashFlowData(
    formValues, 
    usedCapacity, 
    results.annualSavings
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
