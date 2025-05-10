
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { SimuladorFormValues } from "@/schemas/simuladorSchema";

interface MinDemandSectionProps {
  form: UseFormReturn<SimuladorFormValues>;
}

export function MinDemandSection({ form }: MinDemandSectionProps) {
  const loadEntryMethod = form.watch("loadEntryMethod");
  
  // Don't show for hourly entry method
  if (loadEntryMethod === "hourly") return null;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      <FormField
        control={form.control}
        name="minPeakDemandKw"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Demanda Mínima na Ponta (kW)</FormLabel>
            <FormControl>
              <Input type="number" step="0.1" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="minOffpeakDemandKw"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Demanda Mínima Fora Ponta (kW)</FormLabel>
            <FormControl>
              <Input type="number" step="0.1" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
