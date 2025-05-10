
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { SimuladorFormValues } from "@/schemas/simuladorSchema";

interface HourlyDemandInputProps {
  form?: UseFormReturn<SimuladorFormValues>;
  values?: number[];
  onChange?: (values: number[]) => void;
  className?: string;
}

export function HourlyDemandInput({ form, values, onChange, className }: HourlyDemandInputProps) {
  // If form is provided, use it as before
  if (form) {
    return (
      <div className={`border border-gray-200 rounded-lg ${className || ''}`}>
        <div className="p-4 grid grid-cols-6 gap-2">
          {Array.from({ length: 24 }, (_, i) => (
            <FormField
              key={`hour-${i}`}
              control={form.control}
              name={`hourlyDemandKw.${i}`}
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-xs">{`${i}:00h`}</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.01" 
                      className="h-8 text-sm" 
                      {...field}
                      value={field.value || 0}
                      onChange={(e) => {
                        const value = e.target.value === '' ? 0 : parseFloat(e.target.value);
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          ))}
        </div>
      </div>
    );
  }

  // If values and onChange are provided, use them directly
  return (
    <div className={`border border-gray-200 rounded-lg ${className || ''}`}>
      <div className="p-4 grid grid-cols-6 gap-2">
        {Array.from({ length: 24 }, (_, i) => (
          <div key={`hour-${i}`} className="space-y-1">
            <label htmlFor={`hour-${i}`} className="text-xs block">{`${i}:00h`}</label>
            <Input 
              id={`hour-${i}`}
              type="number" 
              step="0.01" 
              className="h-8 text-sm" 
              value={values?.[i] || 0}
              onChange={(e) => {
                if (onChange) {
                  const newValues = [...(values || Array(24).fill(0))];
                  newValues[i] = e.target.value === '' ? 0 : parseFloat(e.target.value);
                  onChange(newValues);
                }
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
