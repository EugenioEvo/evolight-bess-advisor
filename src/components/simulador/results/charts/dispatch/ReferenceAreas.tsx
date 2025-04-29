
import React from 'react';
import { ReferenceArea } from 'recharts';

interface ReferenceAreasProps {
  highlightPeakHours?: boolean;
  peakStartHour?: number;
  peakEndHour?: number;
  chartColors: {
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
        x1={`${peakStartHour}:00`} 
        x2={`${peakEndHour}:00`} 
        yAxisId="left"
        fill={chartColors.peakArea} 
        fillOpacity={0.8}
        stroke="none"
        isFront={false}
      />
      
      {/* Highlight charging window (typically night) */}
      <ReferenceArea 
        x1="0:00" 
        x2="6:00" 
        yAxisId="left"
        fill={chartColors.chargeArea} 
        fillOpacity={0.8}
        stroke="none"
        isFront={false}
      />
    </>
  );
};
