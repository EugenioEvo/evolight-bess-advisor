
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SimuladorFormValues } from "@/schemas/simuladorSchema";
import { DadosTab } from './DadosTab';
import { AnaliseTab } from './AnaliseTab';
import { ResultadosTab } from './ResultadosTab';

interface SimuladorTabContentProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  form: any; // Using any here for simplicity, should be typed properly in a real app
  onSubmit: (values: SimuladorFormValues) => Promise<void>;
  simulationResults: {
    calculatedPowerKw: number;
    calculatedEnergyKwh: number;
    paybackYears?: number;
    annualSavings?: number;
    roi?: number;
    npv?: number;
    isViable?: boolean;
  } | null;
  isSimulating?: boolean;
}

export function SimuladorTabContent({
  activeTab,
  setActiveTab,
  form,
  onSubmit,
  simulationResults,
  isSimulating = false
}: SimuladorTabContentProps) {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-8">
        <TabsTrigger value="dados">Entrada de Dados</TabsTrigger>
        <TabsTrigger value="analise">Análise & Dimensionamento</TabsTrigger>
        <TabsTrigger value="resultados">Resultados & Relatórios</TabsTrigger>
      </TabsList>
      
      <TabsContent value="dados">
        <DadosTab form={form} onSubmit={onSubmit} />
      </TabsContent>
      
      <TabsContent value="analise">
        <AnaliseTab 
          simulationResults={simulationResults} 
          formValues={form.getValues()}
          onChangeTab={setActiveTab}
          isSimulating={isSimulating}
        />
      </TabsContent>
      
      <TabsContent value="resultados">
        <ResultadosTab 
          simulationResults={simulationResults} 
          formValues={form.getValues()} 
          onChangeTab={setActiveTab}
          isSimulating={isSimulating}
        />
      </TabsContent>
    </Tabs>
  );
}
