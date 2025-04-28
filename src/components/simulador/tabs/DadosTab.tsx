
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SimuladorForm } from '../SimuladorForm';
import { SimuladorFormValues } from '@/schemas/simuladorSchema';

interface DadosTabProps {
  form: any; // Using any here for simplicity, should be typed properly in a real app
  onSubmit: (values: SimuladorFormValues) => Promise<void>;
}

export function DadosTab({ form, onSubmit }: DadosTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Entrada de Dados</CardTitle>
        <CardDescription>
          Forneça os dados necessários para simular seu sistema BESS.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SimuladorForm form={form} onSubmit={onSubmit} />
      </CardContent>
    </Card>
  );
}
