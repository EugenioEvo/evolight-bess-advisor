
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SimuladorFormValues } from "@/schemas/simuladorSchema";
import { ResultsDisplay } from './ResultsDisplay';
import { Skeleton } from "@/components/ui/skeleton";

interface AnalysisSectionProps {
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

export function AnalysisSection({ simulationResults, formValues, onChangeTab, isSimulating = false }: AnalysisSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Análise & Dimensionamento</CardTitle>
        <CardDescription>
          Processamento e análise técnico-financeira baseada nos dados fornecidos.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {isSimulating ? (
          <div className="space-y-4 py-8">
            <div className="flex items-center justify-center mb-6">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
            <p className="text-center text-muted-foreground">Processando dimensionamento...</p>
            <div className="space-y-3">
              <Skeleton className="h-[30px] w-full" />
              <Skeleton className="h-[100px] w-full" />
              <Skeleton className="h-[200px] w-full" />
            </div>
          </div>
        ) : simulationResults ? (
          <ResultsDisplay results={simulationResults} formValues={formValues} />
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
