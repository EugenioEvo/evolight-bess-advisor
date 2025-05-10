
import React from 'react';
import { Area, Line } from 'recharts';

interface ChartAreasProps {
  chartColors: {
    pv: string;
    diesel: string;
    discharge: string;
    charge: string;
    grid: string;
    load: string;
    soc: string;
    peakArea?: string;
    chargeArea?: string;
  };
}

export const ChartAreas: React.FC<ChartAreasProps> = ({ chartColors }) => {
  return (
    <>
      {/* Stacking order: grid → charge → discharge → diesel → pv */}
      <Area 
        yAxisId="left" 
        dataKey="grid" 
        stackId="src" 
        fill={chartColors.grid} 
        stroke="none"
        name="Rede"
        isAnimationActive={true}
      />
      
      <Area 
        yAxisId="left" 
        dataKey="charge" 
        stackId="src" 
        fill={chartColors.charge} 
        stroke="none"
        name="BESS (carga)"
        isAnimationActive={true}
      />
      
      <Area 
        yAxisId="left" 
        dataKey="negDis" 
        stackId="src" 
        fill={chartColors.discharge} 
        stroke="none"
        name="BESS (descarga)"
        isAnimationActive={true}
        // Asseguramos que o valor negativo seja renderizado corretamente
        fillOpacity={1}
      />
      
      <Area 
        yAxisId="left" 
        dataKey="diesel" 
        stackId="src" 
        fill={chartColors.diesel} 
        stroke="none"
        name="Diesel"
        isAnimationActive={true}
      />
      
      <Area 
        yAxisId="left" 
        dataKey="pv" 
        stackId="src" 
        fill={chartColors.pv} 
        stroke="none"
        name="Fotovoltaico"
        isAnimationActive={true}
      />
      
      {/* Load line - always showing the original load */}
      <Line 
        yAxisId="left" 
        dataKey="load" 
        stroke={chartColors.load} 
        strokeDasharray="6 4" 
        dot={false}
        name="Carga Cliente"
        isAnimationActive={true}
      />
      
      <Line 
        yAxisId="right" 
        dataKey="soc" 
        stroke={chartColors.soc} 
        dot={false}
        name="SoC BESS"
        isAnimationActive={true}
      />
    </>
  );
};
