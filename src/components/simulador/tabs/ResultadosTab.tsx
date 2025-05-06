
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from "@/components/ui/button";
import { ResultsDisplay } from '../ResultsDisplay';
import { SimuladorFormValues } from '@/schemas/simuladorSchema';
import { Skeleton } from "@/components/ui/skeleton";

interface ResultadosTabProps {
  simulationResults: {
    calculatedPowerKw: number;
    calculatedEnergyKwh: number;
    paybackYears?: number;
    annualSavings?: number;
    roi?: number;
    npv?: number;
    isViable?: boolean;
  } | null;
  formValues: SimuladorFormValues;
  onChangeTab: (tab: string) => void;
  isSimulating?: boolean;
}

export function ResultadosTab({ 
  simulationResults, 
  formValues, 
  onChangeTab,
  isSimulating = false
}: ResultadosTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Resultados & Relatórios</CardTitle>
        <CardDescription>
          Visualize os resultados detalhados da simulação e gere relatórios.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {isSimulating ? (
          <div className="space-y-4 py-8">
            <div className="flex items-center justify-center mb-6">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
            <p className="text-center text-muted-foreground">Processando resultados...</p>
            <div className="space-y-3">
              <Skeleton className="h-[30px] w-full" />
              <Skeleton className="h-[100px] w-full" />
              <Skeleton className="h-[200px] w-full" />
            </div>
          </div>
        ) : simulationResults ? (
          <div className="py-4">
            <ResultsDisplay 
              results={simulationResults} 
              formValues={formValues} 
            />
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">
              Nenhum dimensionamento realizado. Por favor, preencha os dados na aba "Entrada de Dados" e clique em "Dimensionar e Simular".
            </p>
            <Button onClick={() => onChangeTab("dados")}>
              Ir para Entrada de Dados
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
