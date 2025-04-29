
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { SimuladorFormValues } from "@/schemas/simuladorSchema";

interface EaasFieldsProps {
  form: UseFormReturn<SimuladorFormValues>;
}

export function EaasFields({ form }: EaasFieldsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      <FormField
        control={form.control}
        name="setupCost"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Custo Setup Inicial (R$)</FormLabel>
            <FormControl>
              <Input type="number" step="1000" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="annualServiceCost"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Custo Anual Serviço (R$)</FormLabel>
            <FormControl>
              <Input type="number" step="1000" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
