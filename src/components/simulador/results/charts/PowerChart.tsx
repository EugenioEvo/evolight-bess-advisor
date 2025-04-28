
import React from 'react';
import { CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis, Legend } from "recharts";
import { ChartContainer } from "@/components/ui/chart";
import { SimuladorFormValues } from "@/schemas/simuladorSchema";

interface PowerChartProps {
  data: Array<{
    hour: string;
    loadKw: number;
    pvKw: number;
    bessKw: number;
    gridKw: number;
  }>;
  formValues: SimuladorFormValues;
}

export function PowerChart({ data, formValues }: PowerChartProps) {
  return (
    <ChartContainer
      config={{
        load: { theme: { light: "#333", dark: "#ccc" } },
        pv: { theme: { light: "#f97316", dark: "#f97316" } },
        bess: { theme: { light: "#8b5cf6", dark: "#c4b5fd" } },
        grid: { theme: { light: "#0ea5e9", dark: "#7dd3fc" } },
      }}
    >
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="hour" />
        <YAxis label={{ value: 'kW', angle: -90, position: 'insideLeft' }} />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="loadKw" name="Carga" stroke="var(--color-load)" strokeWidth={2} dot={false} />
        {formValues.hasPv && <Line type="monotone" dataKey="pvKw" name="PV" stroke="var(--color-pv)" strokeWidth={2} dot={false} />}
        <Line type="monotone" dataKey="bessKw" name="BESS" stroke="var(--color-bess)" strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="gridKw" name="Rede" stroke="var(--color-grid)" strokeWidth={2} dot={false} />
      </LineChart>
    </ChartContainer>
  );
}
