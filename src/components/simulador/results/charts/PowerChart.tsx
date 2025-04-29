
import React from 'react';
import { CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis, Legend, ReferenceLine } from "recharts";
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
  const getValueLabel = (value: number, type: string) => {
    const absValue = Math.abs(value).toFixed(1);
    
    if (type === 'bessKw') {
      return value >= 0 
        ? `${absValue} kW (descarga)` 
        : `${absValue} kW (carga)`;
    }
    
    if (type === 'gridKw') {
      return value >= 0 
        ? `${absValue} kW (consumo)` 
        : `${absValue} kW (injeção)`;
    }
    
    return `${absValue} kW`;
  };

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
        <YAxis 
          label={{ value: 'kW', angle: -90, position: 'insideLeft' }} 
          domain={['auto', 'auto']} 
        />
        <ReferenceLine y={0} stroke="#666" strokeDasharray="3 3" />
        <Tooltip 
          formatter={(value, name) => {
            const numValue = Number(value);
            const type = name as string;
            return [
              getValueLabel(numValue, type), 
              name === 'loadKw' ? 'Carga' : 
              name === 'pvKw' ? 'PV' : 
              name === 'bessKw' ? 'BESS' : 'Rede'
            ];
          }}
          labelFormatter={(label) => `Hora: ${label}`}
        />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="loadKw" 
          name="Carga" 
          stroke="var(--color-load)" 
          strokeWidth={2} 
          dot={false} 
        />
        {formValues.hasPv && (
          <Line 
            type="monotone" 
            dataKey="pvKw" 
            name="PV" 
            stroke="var(--color-pv)" 
            strokeWidth={2} 
            dot={false} 
          />
        )}
        <Line 
          type="monotone" 
          dataKey="bessKw" 
          name="BESS" 
          stroke="var(--color-bess)" 
          strokeWidth={2} 
          dot={false}
          strokeDasharray={formValues.usePeakShaving ? "" : "5 5"}
        />
        <Line 
          type="monotone" 
          dataKey="gridKw" 
          name="Rede" 
          stroke="var(--color-grid)" 
          strokeWidth={2} 
          dot={false} 
        />
      </LineChart>
    </ChartContainer>
  );
}
