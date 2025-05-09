
import React from 'react';

interface HourSelectorProps {
  hour: number;
  onHourChange: (hour: number) => void;
}

export function HourSelector({ hour, onHourChange }: HourSelectorProps) {
  const handleHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onHourChange(Number(e.target.value));
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-500">Hora:</span>
      <input
        type="range"
        min="0"
        max="23"
        value={hour}
        onChange={handleHourChange}
        className="w-32 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
      />
      <span className="text-sm text-muted-foreground">{hour}:00</span>
    </div>
  );
}
