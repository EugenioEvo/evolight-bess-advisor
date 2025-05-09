
import React, { useState } from 'react';
import { Area, ComposedChart, CartesianGrid, Line, Tooltip, XAxis, YAxis, Legend, ResponsiveContainer } from 'recharts';
import { useChartColors } from '../charts/dispatch/useChartColors';
import { EnergyFlowChart } from '../charts/dispatch/EnergyFlowChart';
import { Button } from '@/components/ui/button';
import { ChartLine, ArrowRight } from 'lucide-react';

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
    pv?: number;
  }>;
}

export function DieselBessChart({ data }: DieselBessChartProps) {
  const chartColors = useChartColors();
  const [viewMode, setViewMode] = useState<'flow' | 'chart'>('flow');
  const [selectedHour, setSelectedHour] = useState<number>(18); // Default to peak hour

  return (
    <div className="w-full h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Despacho Energético (Diesel vs. BESS)</h3>
        <div className="flex items-center gap-2">
          <Button 
            variant={viewMode === 'flow' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setViewMode('flow')}
            className="flex items-center gap-2"
          >
            <ArrowRight size={16} />
            <span>Fluxograma</span>
          </Button>
          <Button 
            variant={viewMode === 'chart' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setViewMode('chart')}
            className="flex items-center gap-2"
          >
            <ChartLine size={16} />
            <span>Gráfico</span>
          </Button>
        </div>
      </div>

      {viewMode === 'flow' ? (
        <div className="h-[380px]">
          <EnergyFlowChart 
            data={data} 
            hour={selectedHour}
            onHourChange={setSelectedHour}
          />
        </div>
      ) : (
        <div className="h-[380px]">
          <ResponsiveContainer width="100%" height="100%">
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
      )}
    </div>
  );
}
