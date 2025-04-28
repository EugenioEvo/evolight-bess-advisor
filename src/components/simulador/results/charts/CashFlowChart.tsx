
import React from 'react';
import { CartesianGrid, Bar, BarChart, Line, Tooltip, XAxis, YAxis, Legend, ResponsiveContainer } from "recharts";
import { ChartContainer } from "@/components/ui/chart";

interface CashFlowChartProps {
  data: Array<{
    year: number;
    cashFlow: number;
    cumulative: number;
  }>;
}

export function CashFlowChart({ data }: CashFlowChartProps) {
  return (
    <ChartContainer
      config={{
        cashFlow: { theme: { light: "#22c55e", dark: "#86efac" } },
        cumulative: { theme: { light: "#0ea5e9", dark: "#7dd3fc" } },
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart 
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip formatter={(value) => `R$ ${Number(value).toLocaleString('pt-BR')}`} />
          <Legend />
          <Bar dataKey="cashFlow" name="Fluxo Anual" fill="var(--color-cashFlow)" />
          <Line type="monotone" dataKey="cumulative" name="Acumulado" stroke="var(--color-cumulative)" strokeWidth={2} yAxisId={0} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
