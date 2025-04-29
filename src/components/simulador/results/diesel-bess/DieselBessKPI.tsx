
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface DieselBessKPIProps {
  kpi: {
    dieselSavedKWh: number;
    dieselSavedLiters: number;
    costBaseline: number;
    costReal: number;
    economy: number;
  };
}

export function DieselBessKPI({ kpi }: DieselBessKPIProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      maximumFractionDigits: 1
    }).format(value);
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-lg font-medium mb-4">KPIs</h3>
        <div className="grid gap-y-2">
          <div className="grid grid-cols-2">
            <span>Diesel evitado:</span>
            <span>
              {formatNumber(kpi.dieselSavedKWh)} kWh (≈ {formatNumber(kpi.dieselSavedLiters)} L)
            </span>
          </div>
          <div className="grid grid-cols-2">
            <span>Custo baseline:</span>
            <span>{formatCurrency(kpi.costBaseline)}</span>
          </div>
          <div className="grid grid-cols-2">
            <span>Custo após BESS:</span>
            <span>{formatCurrency(kpi.costReal)}</span>
          </div>
          <div className="grid grid-cols-2">
            <span>Economia mensal:</span>
            <span className="font-bold">{formatCurrency(kpi.economy)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
