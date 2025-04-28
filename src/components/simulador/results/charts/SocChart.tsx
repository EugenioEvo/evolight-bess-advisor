
import React from 'react';
import { CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";
import { ChartContainer } from "@/components/ui/chart";

interface SocChartProps {
  data: Array<{
    hour: string;
    soc: number;
  }>;
}

export function SocChart({ data }: SocChartProps) {
  return (
    <ChartContainer
      config={{
        soc: { theme: { light: "#8b5cf6", dark: "#c4b5fd" } },
      }}
    >
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="hour" />
        <YAxis 
          domain={[0, 100]}
          label={{ value: 'SoC (%)', angle: -90, position: 'insideLeft' }}
        />
        <Tooltip />
        <Line type="monotone" dataKey="soc" name="Estado de Carga" stroke="var(--color-soc)" strokeWidth={2} dot={false} />
      </LineChart>
    </ChartContainer>
  );
}
