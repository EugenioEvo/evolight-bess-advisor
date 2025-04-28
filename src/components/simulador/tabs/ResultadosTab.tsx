
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from "@/components/ui/button";
import { ResultsDisplay } from '../ResultsDisplay';
import { SimuladorFormValues } from '@/schemas/simuladorSchema';

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
}

export function ResultadosTab({ simulationResults, formValues, onChangeTab }: ResultadosTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Resultados & Relatórios</CardTitle>
        <CardDescription>
          Visualize os resultados detalhados da simulação e gere relatórios.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {simulationResults ? (
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
