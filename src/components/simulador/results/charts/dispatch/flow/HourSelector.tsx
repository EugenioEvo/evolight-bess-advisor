
import React from 'react';
import { Clock } from 'lucide-react';

interface HourSelectorProps {
  hour: number;
  onHourChange: (hour: number) => void;
}

export function HourSelector({ hour, onHourChange }: HourSelectorProps) {
  const handleHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onHourChange(Number(e.target.value));
  };

  // Format hour display
  const formattedHour = `${hour.toString().padStart(2, '0')}:00`;
  
  // Determine if it's day or night for visual indication
  const isDaytime = hour >= 6 && hour < 18;

  return (
    <div className="flex items-center gap-2 bg-muted/30 p-2 rounded-full">
      <Clock 
        size={18} 
        className={`${isDaytime ? 'text-amber-500' : 'text-indigo-400'}`} 
      />
      <input
        type="range"
        min="0"
        max="23"
        value={hour}
        onChange={handleHourChange}
        className="w-36 h-2 rounded-lg appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, 
            #1e293b 0%, 
            #1e293b 5%, 
            #3b82f6 30%, 
            #f59e0b 50%, 
            #3b82f6 70%, 
            #1e293b 95%, 
            #1e293b 100%)`,
        }}
      />
      <span className={`text-sm font-medium w-16 ${isDaytime ? 'text-amber-500' : 'text-indigo-400'}`}>
        {formattedHour}
      </span>
    </div>
  );
}
