
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { SimuladorFormValues } from "@/schemas/simuladorSchema";

interface TurnkeyFieldsProps {
  form: UseFormReturn<SimuladorFormValues>;
}

export function TurnkeyFields({ form }: TurnkeyFieldsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="bessUnitCost"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Custo Unitário BESS (R$/unidade)</FormLabel>
              <FormControl>
                <Input type="number" step="1000" {...field} />
              </FormControl>
              <FormDescription>
                Custo por unidade de 108kW (indivisível)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="bessInstallationCost"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Custo por kWh (R$/kWh)</FormLabel>
              <FormControl>
                <Input type="number" step="100" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="capexCost"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Custo Total Manual (R$)</FormLabel>
              <FormControl>
                <Input type="number" step="1000" {...field} />
              </FormControl>
              <FormDescription>
                Valor total se conhecido (opcional)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="annualOmCost"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Custo O&M Anual (% CAPEX)</FormLabel>
              <FormControl>
                <Input type="number" step="0.1" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
