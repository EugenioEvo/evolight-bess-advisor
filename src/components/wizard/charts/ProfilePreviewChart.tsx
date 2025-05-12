
import React from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ReferenceLine
} from 'recharts';

interface ProfilePreviewChartProps {
  hourlyDemandKw: number[];
  hourlyPvKw?: number[];
  peakStartHour?: number;
  peakEndHour?: number;
  showPeakPeriod?: boolean;
  height?: number;
}

export function ProfilePreviewChart({
  hourlyDemandKw,
  hourlyPvKw,
  peakStartHour = 18,
  peakEndHour = 21,
  showPeakPeriod = true,
  height = 200
}: ProfilePreviewChartProps) {
  // Preparar dados para o gráfico
  const data = Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    demand: hourlyDemandKw[i] || 0,
    pv: hourlyPvKw ? hourlyPvKw[i] || 0 : undefined,
    timeLabel: `${i}:00`
  }));

  // Determinar valor máximo para o eixo Y
  const maxDemand = Math.max(...hourlyDemandKw);
  const maxPv = hourlyPvKw ? Math.max(...hourlyPvKw) : 0;
  const yMax = Math.max(maxDemand, maxPv) * 1.2; // 20% a mais para margem

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis 
          dataKey="timeLabel" 
          tick={{ fontSize: 12 }}
          tickFormatter={(value) => value.replace(':00', 'h')}
          interval={3}
        />
        <YAxis 
          tick={{ fontSize: 12 }}
          domain={[0, yMax]}
          tickFormatter={(value) => `${value} kW`}
        />
        <Tooltip
          formatter={(value, name) => [
            `${Number(value).toFixed(1)} kW`, 
            name === 'demand' ? 'Consumo' : 'Geração FV'
          ]}
          labelFormatter={(label) => `Hora: ${label}`}
        />
        <Legend 
          formatter={(value) => value === 'demand' ? 'Consumo' : 'Geração FV'} 
        />
        
        {/* Área para horário de ponta */}
        {showPeakPeriod && (
          <>
            <ReferenceLine 
              x={peakStartHour} 
              stroke="#ff4d4f" 
              strokeDasharray="3 3" 
              label={{ value: "Ponta", position: 'insideTopLeft', fill: '#ff4d4f', fontSize: 12 }} 
            />
            <ReferenceLine 
              x={peakEndHour} 
              stroke="#ff4d4f" 
              strokeDasharray="3 3" 
            />
          </>
        )}
        
        {/* Curva de geração solar, se disponível */}
        {hourlyPvKw && (
          <Area 
            type="monotone" 
            dataKey="pv" 
            stroke="#ffd666" 
            fillOpacity={0.6} 
            fill="#fff1b8"
            strokeWidth={2}
            name="pv"
          />
        )}
        
        {/* Curva de demanda */}
        <Area 
          type="monotone" 
          dataKey="demand" 
          stroke="#1668dc" 
          fill="#bae0ff" 
          fillOpacity={0.6}
          strokeWidth={2}
          name="demand"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
