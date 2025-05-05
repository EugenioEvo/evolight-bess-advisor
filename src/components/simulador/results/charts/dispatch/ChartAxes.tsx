
import React from 'react';
import { XAxis, YAxis } from 'recharts';

interface ChartAxesProps {
  isMobile: boolean;
}

export const ChartAxes: React.FC<ChartAxesProps> = ({ isMobile }) => {
  return (
    <>
      <XAxis 
        dataKey="hour" 
        interval={isMobile ? 2 : 1}
        tick={{ 
          fill: 'var(--foreground)',
          fontSize: isMobile ? 10 : 12 
        }}
        tickLine={{ stroke: 'var(--foreground)' }}
      />
      
      <YAxis 
        yAxisId="left" 
        domain={[
          (dataMin: number) => Math.min(0, dataMin),
          (dataMax: number) => dataMax * 1.1
        ]}
        label={{ 
          value: "Potência (kW)", 
          angle: -90, 
          position: "insideLeft",
          fill: 'var(--foreground)'
        }}
        tick={{ 
          fill: 'var(--foreground)',
          fontSize: 12 
        }}
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
        tick={{ 
          fill: 'var(--foreground)',
          fontSize: 12 
        }}
        tickLine={{ stroke: 'var(--foreground)' }}
      />
    </>
  );
};
