
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { SimuladorFormValues } from "@/schemas/simuladorSchema";

interface BessSectionProps {
  form: UseFormReturn<SimuladorFormValues>;
}

export function BessSection({ form }: BessSectionProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Parâmetros Técnicos do BESS</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name="bessCapacityKwh"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Capacidade (kWh)</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="bessPowerKw"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Potência (kW)</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="bessEfficiency"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Eficiência (%)</FormLabel>
              <FormControl>
                <Input type="number" step="0.1" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="bessMaxDod"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Max DoD (%)</FormLabel>
              <FormControl>
                <Input type="number" step="0.1" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="bessInitialSoc"
          render={({ field }) => (
            <FormItem>
              <FormLabel>SoC Inicial (%)</FormLabel>
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
