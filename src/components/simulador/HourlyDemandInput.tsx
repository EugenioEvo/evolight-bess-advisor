
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { SimuladorFormValues } from "@/schemas/simuladorSchema";
import { Card, CardContent } from '@/components/ui/card';

interface HourlyDemandInputProps {
  form: UseFormReturn<SimuladorFormValues>;
}

export function HourlyDemandInput({ form }: HourlyDemandInputProps) {
  return (
    <Card className="border border-gray-200">
      <CardContent className="pt-4">
        <div className="grid grid-cols-6 gap-2">
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
      </CardContent>
    </Card>
  );
}
