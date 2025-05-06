
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SimuladorForm } from '../SimuladorForm';
import { SimuladorFormValues } from '@/schemas/simuladorSchema';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

interface DadosTabProps {
  form: any; // Using any here for simplicity, should be typed properly in a real app
  onSubmit: (values: SimuladorFormValues) => Promise<void>;
}

export function DadosTab({ form, onSubmit }: DadosTabProps) {
  const tarifaryGroup = form.watch("tarifaryGroup");
  const modalityA = form.watch("modalityA");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Entrada de Dados</CardTitle>
        <CardDescription>
          Forneça os dados necessários para simular seu sistema BESS.
        </CardDescription>
        
        {tarifaryGroup === "groupA" && (
          <Alert className="mt-2 bg-blue-50">
            <Info className="h-4 w-4 text-blue-500" />
            <AlertDescription className="text-sm">
              {modalityA === "blue" 
                ? "Na modalidade Azul, há tarifação de demanda específica para os horários de ponta e fora de ponta."
                : "Na modalidade Verde, há apenas tarifação de demanda para o período fora de ponta."}
            </AlertDescription>
          </Alert>
        )}
      </CardHeader>
      <CardContent>
        <SimuladorForm form={form} onSubmit={onSubmit} />
      </CardContent>
    </Card>
  );
}
