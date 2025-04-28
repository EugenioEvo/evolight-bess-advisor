
import React from 'react';
import { Check, AlertCircle } from 'lucide-react';

interface ViabilityIndicatorProps {
  isViable: boolean;
}

export function ViabilityIndicator({ isViable }: ViabilityIndicatorProps) {
  return (
    <div className="flex items-center justify-between p-4 mb-4 rounded-lg bg-card/50">
      <span className="text-lg font-medium">Viabilidade:</span>
      <div className="flex items-center">
        {isViable ? (
          <Check className="h-6 w-6 text-green-500 mr-2" />
        ) : (
          <AlertCircle className="h-6 w-6 text-yellow-500 mr-2" />
        )}
        <span className={isViable ? "text-green-500 font-semibold" : "text-yellow-500 font-semibold"}>
          {isViable ? 'Viável' : 'Revisar Parâmetros'}
        </span>
      </div>
    </div>
  );
}
