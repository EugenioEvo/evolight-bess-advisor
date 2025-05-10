
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Clock } from 'lucide-react';

interface TimeRangeSelectorProps {
  startHour: number;
  endHour: number;
  onStartChange: (hour: number) => void;
  onEndChange: (hour: number) => void;
  minDuration?: number;
  maxDuration?: number;
}

export function TimeRangeSelector({
  startHour,
  endHour,
  onStartChange,
  onEndChange,
  minDuration = 1,
  maxDuration = 24
}: TimeRangeSelectorProps) {
  const handleStartChange = (values: number[]) => {
    const newStart = values[0];
    let newEnd = endHour;
    
    // Ensure minimum duration
    if (newEnd - newStart < minDuration) {
      newEnd = Math.min(newStart + minDuration, 23);
    }
    
    // Ensure maximum duration
    if (newEnd - newStart > maxDuration) {
      newEnd = newStart + maxDuration;
    }
    
    onStartChange(newStart);
    if (newEnd !== endHour) {
      onEndChange(newEnd);
    }
  };
  
  const handleEndChange = (values: number[]) => {
    const newEnd = values[0];
    let newStart = startHour;
    
    // Ensure minimum duration
    if (newEnd - newStart < minDuration) {
      newStart = Math.max(newEnd - minDuration, 0);
    }
    
    // Ensure maximum duration
    if (newEnd - newStart > maxDuration) {
      newStart = newEnd - maxDuration;
    }
    
    onEndChange(newEnd);
    if (newStart !== startHour) {
      onStartChange(newStart);
    }
  };
  
  // Generate time labels for the day
  const timeLabels = Array.from({ length: 24 }, (_, i) => i);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <Clock className="h-4 w-4 text-muted-foreground" />
        <span className="font-medium">Selecione a janela de horário de ponta:</span>
      </div>
      
      <div className="mb-2 px-2 grid grid-cols-24">
        {timeLabels.map((hour, index) => (
          <div
            key={hour}
            className={`text-center text-xs ${index % 4 === 0 ? 'text-muted-foreground' : 'text-transparent'}`}
          >
            {index % 4 === 0 ? hour : '-'}
          </div>
        ))}
      </div>
      
      <div className="mt-6 space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm">Início do horário de ponta</span>
            <span className="font-medium">{startHour}:00</span>
          </div>
          <Slider
            value={[startHour]}
            min={0}
            max={23}
            step={1}
            onValueChange={handleStartChange}
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm">Fim do horário de ponta</span>
            <span className="font-medium">{endHour}:00</span>
          </div>
          <Slider
            value={[endHour]}
            min={0}
            max={23}
            step={1}
            onValueChange={handleEndChange}
          />
        </div>
      </div>
      
      <div className="h-16 relative mt-6">
        <div className="absolute inset-0 bg-muted rounded-md overflow-hidden">
          {timeLabels.map((hour) => (
            <div
              key={hour}
              className={`absolute top-0 bottom-0 w-[4.17%] ${
                hour % 4 === 0 ? 'border-l border-muted-foreground/20' : ''
              }`}
              style={{ left: `${(hour / 24) * 100}%` }}
            />
          ))}
          <div
            className="absolute top-0 bottom-0 bg-primary/30"
            style={{
              left: `${(startHour / 24) * 100}%`,
              width: `${((endHour - startHour + 1) / 24) * 100}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
