
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { SimuladorFormValues } from "@/schemas/simuladorSchema";

interface IncentivesFieldsProps {
  form: UseFormReturn<SimuladorFormValues>;
}

export function IncentivesFields({ form }: IncentivesFieldsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
      <FormField
        control={form.control}
        name="incentivesValue"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Incentivos (Valor Total R$)</FormLabel>
            <FormControl>
              <Input type="number" step="1000" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="annualLoadGrowth"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Crescimento Anual Carga (%)</FormLabel>
            <FormControl>
              <Input type="number" step="0.1" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="annualTariffAdjustment"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Reajuste Anual Tarifa (%)</FormLabel>
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
