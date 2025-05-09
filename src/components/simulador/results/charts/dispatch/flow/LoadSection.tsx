
import React from 'react';
import { Home } from 'lucide-react';

interface LoadSectionProps {
  currentData: any;
  chartColors: Record<string, string>;
  formatNumber: (num: number) => string;
}

export function LoadSection({
  currentData,
  chartColors,
  formatNumber
}: LoadSectionProps) {
  return (
    <div className="w-40 h-40 relative">
      <div 
        className="w-full h-full rounded-lg flex flex-col items-center justify-center p-3 shadow-lg border-2 transform transition-transform hover:scale-105"
        style={{ 
          backgroundColor: chartColors.load + '20', 
          borderColor: chartColors.load,
          color: 'inherit'
        }}
      >
        <div className="mb-2">
          <Home size={28} />
        </div>
        <div className="text-center">
          <div className="font-bold text-lg">Carga</div>
          <div className="mt-1 text-xl font-semibold">{formatNumber(currentData.load)} kW</div>
        </div>
      </div>
    </div>
  );
}
