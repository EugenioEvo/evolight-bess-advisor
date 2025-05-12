
import React from 'react';
import { 
  ResponsiveContainer, 
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface ComparativeResultsChartProps {
  type: 'financial' | 'power' | 'costs' | 'breakdown';
  data: any;
  height?: number;
}

export function ComparativeResultsChart({
  type,
  data,
  height = 300
}: ComparativeResultsChartProps) {
  
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center bg-muted rounded-lg">
        <p className="text-muted-foreground">Dados não disponíveis para visualização</p>
      </div>
    );
  }
  
  // Cores para os gráficos
  const colors = {
    primary: '#1668dc',
    success: '#52c41a',
    warning: '#fa8c16',
    danger: '#f5222d',
    purple: '#722ed1',
    cyan: '#13c2c2',
    gold: '#faad14',
    lime: '#a0d911'
  };
  
  // Paleta para gráfico de pizza
  const pieColors = [colors.primary, colors.success, colors.warning, colors.danger, colors.purple];
  
  switch (type) {
    case 'financial':
      // Gráfico de linha para fluxo de caixa
      return (
        <ResponsiveContainer width="100%" height={height}>
          <LineChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="year" 
              tick={{ fontSize: 12 }}
              label={{ value: "Anos", position: "insideBottom", offset: -10 }}
            />
            <YAxis 
              tickFormatter={(value) => `R$ ${value/1000}k`}
              tick={{ fontSize: 12 }}
              label={{ value: "Valor (R$)", angle: -90, position: "insideLeft" }}
            />
            <Tooltip
              formatter={(value) => [`R$ ${Number(value).toLocaleString()}`, '']}
              labelFormatter={(label) => `Ano ${label}`}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="cashflow" 
              stroke={colors.primary}
              name="Fluxo de Caixa"
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line 
              type="monotone" 
              dataKey="cumulative" 
              stroke={colors.success} 
              name="Acumulado"
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      );
    
    case 'power':
      // Gráfico de barras para perfil de potência antes e depois do BESS
      return (
        <ResponsiveContainer width="100%" height={height}>
          <BarChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="hour" 
              tick={{ fontSize: 12 }}
              label={{ value: "Hora do Dia", position: "insideBottom", offset: -10 }}
              tickFormatter={(value) => `${value}h`}
            />
            <YAxis 
              tickFormatter={(value) => `${value} kW`}
              tick={{ fontSize: 12 }}
              label={{ value: "Potência (kW)", angle: -90, position: "insideLeft" }}
            />
            <Tooltip
              formatter={(value) => [`${Number(value).toFixed(1)} kW`, '']}
              labelFormatter={(label) => `${label}:00h`}
            />
            <Legend />
            <Bar 
              dataKey="before" 
              fill={colors.warning} 
              name="Antes do BESS"
              barSize={20}
            />
            <Bar 
              dataKey="after" 
              fill={colors.success} 
              name="Com BESS"
              barSize={20}
            />
          </BarChart>
        </ResponsiveContainer>
      );
    
    case 'costs':
      // Gráfico de barras comparando custos antes e depois
      return (
        <ResponsiveContainer width="100%" height={height}>
          <BarChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
            layout="vertical"
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              type="number"
              tickFormatter={(value) => `R$ ${value/1000}k`}
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              type="category"
              dataKey="name"
              tick={{ fontSize: 12 }}
              width={150}
            />
            <Tooltip
              formatter={(value) => [`R$ ${Number(value).toLocaleString()}`, '']}
            />
            <Legend />
            <Bar 
              dataKey="before" 
              fill={colors.danger} 
              name="Antes"
              barSize={20}
            />
            <Bar 
              dataKey="after" 
              fill={colors.success} 
              name="Depois"
              barSize={20}
            />
          </BarChart>
        </ResponsiveContainer>
      );
      
    case 'breakdown':
      // Gráfico de pizza para breakdown de custos ou economia
      return (
        <ResponsiveContainer width="100%" height={height}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={true}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
              label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry: any, index: number) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={pieColors[index % pieColors.length]} 
                />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => [`R$ ${Number(value).toLocaleString()}`, '']}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      );
      
    default:
      return (
        <div className="h-64 flex items-center justify-center bg-muted rounded-lg">
          <p className="text-muted-foreground">Tipo de gráfico não suportado</p>
        </div>
      );
  }
}
