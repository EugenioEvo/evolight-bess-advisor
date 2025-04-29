
import React from 'react';
import { CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis, Area } from "recharts";
import { ChartContainer } from "@/components/ui/chart";
import { useTheme } from "next-themes";
import { SimuladorFormValues } from "@/schemas/simuladorSchema";

interface SocChartProps {
  data: Array<{
    hour: string;
    soc: number;
  }>;
  formValues?: SimuladorFormValues;
}

export function SocChart({ data, formValues }: SocChartProps) {
  // Determinar o SoC mínimo baseado no DoD máximo (se disponível)
  const minSoc = formValues ? 100 - formValues.bessMaxDod : 15;
  const { resolvedTheme } = useTheme();
  
  // Choose colors based on theme
  const colors = {
    soc: resolvedTheme === 'dark' ? "#c4b5fd" : "#8b5cf6",
    socArea: resolvedTheme === 'dark' ? "#8b5cf6" : "#c4b5fd",
    minSoc: resolvedTheme === 'dark' ? "#fca5a5" : "#ef4444",
  };
  
  return (
    <div className="w-full h-full">
      <h3 className="text-lg font-medium mb-2">Estado de Carga da Bateria (24h)</h3>
      <ChartContainer
        config={{
          soc: { theme: { light: "#8b5cf6", dark: "#c4b5fd" } },
          socArea: { theme: { light: "#c4b5fd", dark: "#8b5cf6" } },
          minSoc: { theme: { light: "#ef4444", dark: "#fca5a5" } },
        }}
      >
        <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="hour" 
            tick={{fill: 'var(--foreground)'}}
          />
          <YAxis 
            domain={[0, 100]}
            label={{ value: 'SoC (%)', angle: -90, position: 'insideLeft', fill: 'var(--foreground)' }}
            tick={{fill: 'var(--foreground)'}}
          />
          <Tooltip 
            formatter={(value) => [`${value}%`, 'Estado de Carga']}
          />
          
          {/* Área sombreada para mostrar o SoC */}
          <Area 
            type="monotone" 
            dataKey="soc" 
            name="SoC" 
            fill="var(--color-socArea)" 
            fillOpacity={0.4}
            stroke="var(--color-soc)"
          />
          
          {/* Linha para o SoC mínimo */}
          <Line
            type="monotone"
            dataKey={() => minSoc}
            name="SoC Mínimo"
            stroke="var(--color-minSoc)"
            strokeWidth={1}
            strokeDasharray="3 3"
            dot={false}
          />
          
          {/* Linha principal do SoC */}
          <Line 
            type="monotone" 
            dataKey="soc" 
            name="Estado de Carga" 
            stroke="var(--color-soc)" 
            strokeWidth={2} 
            dot={false} 
          />
        </LineChart>
      </ChartContainer>
    </div>
  );
}
