
import React from 'react';
import { XAxis, YAxis } from 'recharts';

interface ChartAxesProps {
  isMobile: boolean;
}

export const ChartAxes: React.FC<ChartAxesProps> = ({ isMobile }) => {
  return (
    <>
      <XAxis 
        dataKey="hourLabel" 
        interval={isMobile ? 3 : 1}
        tick={{ fill: 'var(--foreground)' }}
        tickLine={{ stroke: 'var(--foreground)' }}
      />
      
      <YAxis 
        yAxisId="left" 
        label={{ 
          value: "Potência (kW)", 
          angle: -90, 
          position: "insideLeft",
          fill: 'var(--foreground)'
        }}
        tick={{ fill: 'var(--foreground)' }}
        tickLine={{ stroke: 'var(--foreground)' }}
      />
      
      <YAxis 
        yAxisId="right" 
        orientation="right"
        domain={[0, 100]} 
        label={{ 
          value: "SoC (%)", 
          angle: 90, 
          position: "insideRight",
          fill: 'var(--foreground)'
        }}
        tick={{ fill: 'var(--foreground)' }}
        tickLine={{ stroke: 'var(--foreground)' }}
      />
    </>
  );
};
