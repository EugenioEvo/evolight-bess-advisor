
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SimuladorFormValues } from "@/schemas/simuladorSchema";
import { ResultsDisplay } from './ResultsDisplay';

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
}

export function AnalysisSection({ simulationResults, formValues, onChangeTab }: AnalysisSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Análise & Dimensionamento</CardTitle>
        <CardDescription>
          Processamento e análise técnico-financeira baseada nos dados fornecidos.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {simulationResults ? (
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
