
import React from 'react';
import { Area, ComposedChart, CartesianGrid, Line, Tooltip, XAxis, YAxis, Legend, ResponsiveContainer } from 'recharts';
import { useChartColors } from '../charts/dispatch/useChartColors';

interface DieselBessChartProps {
  data: Array<{
    hour: number;
    load: number;
    grid: number;
    diesel: number;
    charge: number;
    discharge: number;
    soc: number;
    dieselRef: number;
  }>;
}

export function DieselBessChart({ data }: DieselBessChartProps) {
  const chartColors = useChartColors();

  return (
    <div className="w-full">
      <h3 className="text-lg font-medium mb-2">Despacho Energético (Diesel vs. BESS)</h3>
      <div className="h-[420px]">
        <ResponsiveContainer width="100%" height={420}>
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="hour" 
              interval={1}
              tickFormatter={(value) => `${value}:00`}
              label={{ value: 'Hora', position: 'insideBottomRight', offset: -5 }}
            />
            <YAxis 
              yAxisId="left" 
              label={{ value: "kW", angle: -90, position: "insideLeft" }}
            />
            <YAxis 
              yAxisId="right" 
              orientation="right" 
              domain={[0, 100]}
              label={{ value: "SoC (%)", angle: 90, position: "insideRight" }}
            />

            {/* Pilha: Grid → Carga BESS → Descarga BESS → Diesel */}
            <Area 
              yAxisId="left" 
              dataKey="grid" 
              stackId="s" 
              fill={chartColors.grid} 
              stroke={chartColors.grid}
              name="Rede"
            />
            <Area 
              yAxisId="left" 
              dataKey="charge" 
              stackId="s" 
              fill={chartColors.charge} 
              stroke={chartColors.charge}
              name="Carga BESS"
            />
            <Area 
              yAxisId="left" 
              dataKey={(d) => -d.discharge} 
              stackId="s" 
              fill={chartColors.discharge} 
              stroke={chartColors.discharge}
              name="Descarga BESS"
            />
            <Area 
              yAxisId="left" 
              dataKey="diesel" 
              stackId="s" 
              fill={chartColors.diesel} 
              stroke={chartColors.diesel}
              name="Diesel"
            />

            {/* Linhas */}
            <Line 
              yAxisId="left" 
              dataKey="load" 
              stroke={chartColors.load} 
              strokeDasharray="6 4" 
              dot={false} 
              name="Carga Total"
            />
            <Line 
              yAxisId="left" 
              dataKey="dieselRef" 
              stroke={chartColors.dieselRef} 
              strokeDasharray="3 3" 
              dot={false} 
              name="Diesel (Baseline)"
            />
            <Line 
              yAxisId="right" 
              dataKey="soc" 
              stroke={chartColors.soc} 
              dot={false} 
              name="SoC BESS"
            />

            <Tooltip 
              formatter={(value: number, name: string) => {
                if (name === 'SoC BESS') return [`${value.toFixed(1)}%`, name];
                return [`${value.toFixed(1)} kW`, name];
              }}
              labelFormatter={(label) => `Hora: ${label}:00`}
            />
            <Legend verticalAlign="top" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
