
import React, { useState } from 'react';
import { EnergyDispatchChart } from '../EnergyDispatchChart';
import { EnergyFlowChart } from './flow';
import { DispatchPoint } from '../EnergyDispatchChartTypes';
import { Button } from '@/components/ui/button';
import { ChartLine, ArrowRight } from 'lucide-react';

interface EnergyDispatchVisualizationProps {
  data: DispatchPoint[];
  highlightPeakHours?: boolean;
  peakStartHour?: number;
  peakEndHour?: number;
  title?: string;
}

export function EnergyDispatchVisualization({
  data,
  highlightPeakHours,
  peakStartHour,
  peakEndHour,
  title = "Despacho de Energia"
}: EnergyDispatchVisualizationProps) {
  const [viewMode, setViewMode] = useState<'flow' | 'chart'>('flow');
  const [selectedHour, setSelectedHour] = useState<number>(18); // Default to peak hour
  
  return (
    <div className="w-full h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">{title}</h3>
        <div className="flex items-center gap-2">
          <Button 
            variant={viewMode === 'flow' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setViewMode('flow')}
            className="flex items-center gap-2"
          >
            <ArrowRight size={16} />
            <span>Fluxograma</span>
          </Button>
          <Button 
            variant={viewMode === 'chart' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setViewMode('chart')}
            className="flex items-center gap-2"
          >
            <ChartLine size={16} />
            <span>Gráfico</span>
          </Button>
        </div>
      </div>
      
      {viewMode === 'flow' ? (
        <EnergyFlowChart 
          data={data} 
          hour={selectedHour}
          onHourChange={setSelectedHour}
        />
      ) : (
        <EnergyDispatchChart 
          data={data}
          highlightPeakHours={highlightPeakHours}
          peakStartHour={peakStartHour}
          peakEndHour={peakEndHour}
          title=""
        />
      )}
    </div>
  );
}
