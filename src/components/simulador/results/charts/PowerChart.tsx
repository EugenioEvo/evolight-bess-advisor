
import React from 'react';
import { Area, ComposedChart, CartesianGrid, Line, Tooltip, XAxis, YAxis, Legend, ReferenceLine } from "recharts";
import { ChartContainer } from "@/components/ui/chart";
import { SimuladorFormValues } from "@/schemas/simuladorSchema";
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";

interface PowerChartProps {
  data: Array<{
    hour: string;
    loadKw: number;
    pvKw: number;
    bessKw: number;
    gridKw: number;
    dieselKw?: number;
  }>;
  formValues: SimuladorFormValues;
}

export function PowerChart({ data, formValues }: PowerChartProps) {
  const getValueLabel = (value: number, type: string) => {
    const absValue = Math.abs(value).toFixed(1);
    
    if (type === 'bessKw') {
      return value <= 0 
        ? `${absValue} kW (descarga)` 
        : `${absValue} kW (carga)`;
    }
    
    if (type === 'gridKw') {
      return value >= 0 
        ? `${absValue} kW (consumo)` 
        : `${absValue} kW (injeção)`;
    }
    
    if (type === 'dieselKw') {
      return `${absValue} kW (gerador)`;
    }
    
    return `${absValue} kW`;
  };

  // Identifica o período de peak shaving para destacar no gráfico
  const peakShavingPeriod = data.map(entry => {
    const hour = parseInt(entry.hour.split(':')[0]);
    return hour >= formValues.peakShavingStartHour && hour <= formValues.peakShavingEndHour;
  });

  return (
    <div className="w-full h-full">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-medium">Interação Carga, BESS e Rede (24h)</h3>
        <TooltipProvider>
          <UITooltip>
            <TooltipTrigger>
              <Info className="h-4 w-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p>Valores negativos para BESS indicam descarga</p>
              <p>Valores positivos para BESS indicam carga</p>
              <p>Valores positivos para rede indicam consumo</p>
              <p>Valores negativos para rede indicam injeção</p>
            </TooltipContent>
          </UITooltip>
        </TooltipProvider>
      </div>

      <ChartContainer
        config={{
          load: { theme: { light: "#333", dark: "#ccc" } },
          pv: { theme: { light: "#f97316", dark: "#f97316" } },
          bessDischarge: { theme: { light: "#22c55e", dark: "#4ade80" } },
          bessCharge: { theme: { light: "#8b5cf6", dark: "#c4b5fd" } },
          gridConsume: { theme: { light: "#ef4444", dark: "#fca5a5" } },
          gridInject: { theme: { light: "#0ea5e9", dark: "#7dd3fc" } },
          diesel: { theme: { light: "#f59e0b", dark: "#fbbf24" } },
        }}
      >
        <ComposedChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="hour" 
            tick={{fill: 'var(--foreground)'}}
          />
          <YAxis 
            label={{ value: 'kW', angle: -90, position: 'insideLeft', fill: 'var(--foreground)' }} 
            domain={['auto', 'auto']} 
            tick={{fill: 'var(--foreground)'}}
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
                name === 'bessKw' ? 'BESS' :
                name === 'dieselKw' ? 'Gerador' : 'Rede'
              ];
            }}
            labelFormatter={(label, payload) => {
              const hourIndex = data.findIndex(item => item.hour === label);
              const isPeakShaving = hourIndex >= 0 ? peakShavingPeriod[hourIndex] : false;
              return `Hora: ${label}${isPeakShaving ? ' (Peak Shaving)' : ''}`;
            }}
          />
          <Legend />
          
          {/* Grid consumo (valores positivos) com área */}
          <Area 
            type="monotone" 
            dataKey={(data) => data.gridKw > 0 ? data.gridKw : 0}
            name="Consumo Rede" 
            fill="var(--color-gridConsume)" 
            fillOpacity={0.6}
            stroke="var(--color-gridConsume)" 
            strokeWidth={1}
          />

          {/* Grid injeção (valores negativos) com área */}
          <Area 
            type="monotone" 
            dataKey={(data) => data.gridKw < 0 ? Math.abs(data.gridKw) : 0}
            name="Injeção Rede" 
            fill="var(--color-gridInject)" 
            fillOpacity={0.6}
            stroke="var(--color-gridInject)" 
            strokeWidth={1}
          />

          {/* BESS descarga (valores negativos) com área */}
          <Area 
            type="monotone" 
            dataKey={(data) => data.bessKw < 0 ? Math.abs(data.bessKw) : 0}
            name="Descarga BESS" 
            fill="var(--color-bessDischarge)" 
            fillOpacity={0.6}
            stroke="var(--color-bessDischarge)"
            strokeWidth={1}
          />

          {/* BESS carga (valores positivos) com área */}
          <Area 
            type="monotone" 
            dataKey={(data) => data.bessKw > 0 ? data.bessKw : 0}
            name="Carga BESS" 
            fill="var(--color-bessCharge)" 
            fillOpacity={0.6}
            stroke="var(--color-bessCharge)" 
            strokeWidth={1}
          />

          {/* Diesel geração com área se disponível */}
          {formValues.hasDiesel && (
            <Area 
              type="monotone" 
              dataKey="dieselKw" 
              name="Gerador" 
              fill="var(--color-diesel)" 
              fillOpacity={0.6}
              stroke="var(--color-diesel)" 
              strokeWidth={1}
            />
          )}

          {/* PV geração com área se disponível */}
          {formValues.hasPv && (
            <Area 
              type="monotone" 
              dataKey="pvKw" 
              name="PV" 
              fill="var(--color-pv)" 
              fillOpacity={0.6}
              stroke="var(--color-pv)" 
              strokeWidth={1}
            />
          )}
          
          {/* Carga como linha */}
          <Line 
            type="monotone" 
            dataKey="loadKw" 
            name="Carga" 
            stroke="var(--color-load)" 
            strokeWidth={2} 
            dot={false} 
          />
        </ComposedChart>
      </ChartContainer>
    </div>
  );
}
