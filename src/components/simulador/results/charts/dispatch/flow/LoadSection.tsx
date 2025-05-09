
import React from 'react';
import { ArrowRight, Home } from 'lucide-react';

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
    <div className="flex justify-center h-1/3">
      <div className="flex-1 flex flex-col items-center max-w-md">
        <div className="flex items-center mb-2">
          <ArrowRight className="text-muted-foreground animate-pulse" />
        </div>
        <div 
          className="w-full h-16 rounded-lg flex items-center justify-center px-3"
          style={{ backgroundColor: chartColors.load, color: 'white' }}
        >
          <div className="flex items-center gap-4">
            <Home size={24} />
            <div className="text-center">
              <div className="font-bold">Carga do Cliente</div>
              <div>{formatNumber(currentData.load)} kW</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
