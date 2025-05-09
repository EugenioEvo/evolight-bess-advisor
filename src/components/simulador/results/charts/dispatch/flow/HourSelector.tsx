
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

  return (
    <div className="flex items-center gap-2 bg-muted/30 p-2 rounded-full">
      <Clock size={16} className="text-muted-foreground" />
      <input
        type="range"
        min="0"
        max="23"
        value={hour}
        onChange={handleHourChange}
        className="w-32 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
      />
      <span className="text-sm text-muted-foreground w-12">{formattedHour}</span>
    </div>
  );
}
