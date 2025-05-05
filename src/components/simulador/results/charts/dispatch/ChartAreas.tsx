
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
  };
}

export const ChartAreas: React.FC<ChartAreasProps> = ({ chartColors }) => {
  return (
    <>
      {/* Ordem: grid → cargaBESS → descargaBESS → diesel → pv */}
      <Area 
        yAxisId="left" 
        dataKey="grid" 
        stackId="src" 
        fill={chartColors.grid} 
        stroke="none"
        name="Rede"
      />
      
      <Area 
        yAxisId="left" 
        dataKey="charge" 
        stackId="src" 
        fill={chartColors.charge} 
        stroke="none"
        name="BESS (carga)"
      />
      
      <Area 
        yAxisId="left" 
        dataKey="negDis" 
        stackId="src" 
        fill={chartColors.discharge} 
        stroke="none"
        name="BESS (descarga)"
      />
      
      <Area 
        yAxisId="left" 
        dataKey="diesel" 
        stackId="src" 
        fill={chartColors.diesel} 
        stroke="none"
        name="Diesel"
      />
      
      <Area 
        yAxisId="left" 
        dataKey="pv" 
        stackId="src" 
        fill={chartColors.pv} 
        stroke="none"
        name="Fotovoltaico"
      />
      
      {/* Load line - always showing the original load */}
      <Line 
        yAxisId="left" 
        dataKey="load" 
        stroke={chartColors.load} 
        strokeDasharray="6 4" 
        dot={false}
        name="Carga Cliente"
      />
      
      <Line 
        yAxisId="right" 
        dataKey="soc" 
        stroke={chartColors.soc} 
        dot={false}
        name="SoC BESS"
      />
    </>
  );
};
