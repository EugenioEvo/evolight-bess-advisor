
import React from 'react';
import { ReferenceArea } from 'recharts';

interface ReferenceAreasProps {
  highlightPeakHours?: boolean;
  peakStartHour?: number;
  peakEndHour?: number;
  chartColors: {
    pv: string;
    diesel: string;
    discharge: string;
    charge: string;
    grid: string;
    load: string;
    soc: string;
    peakArea: string;
    chargeArea: string;
  };
}

export const ReferenceAreas: React.FC<ReferenceAreasProps> = ({ 
  highlightPeakHours = true,
  peakStartHour = 18,
  peakEndHour = 21,
  chartColors
}) => {
  if (!highlightPeakHours) return null;
  
  return (
    <>
      {/* Highlight peak hours */}
      <ReferenceArea 
        x1={peakStartHour} 
        x2={peakEndHour} 
        yAxisId="left"
        fill={chartColors.peakArea} 
        fillOpacity={0.8}
        stroke="none"
        isFront={false}
      />
      
      {/* Highlight charging window (typically night) */}
      <ReferenceArea 
        x1={0} 
        x2={6} 
        yAxisId="left"
        fill={chartColors.chargeArea} 
        fillOpacity={0.8}
        stroke="none"
        isFront={false}
      />
    </>
  );
};
