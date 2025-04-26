
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from "react-hook-form";
import { SimuladorFormValues } from "@/schemas/simuladorSchema";

interface DieselSectionProps {
  form: UseFormReturn<SimuladorFormValues>;
}

export function DieselSection({ form }: DieselSectionProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Gerador Diesel Existente</h3>
        <FormField
          control={form.control}
          name="hasDiesel"
          render={({ field }) => (
            <FormItem className="flex items-center space-x-2">
              <FormLabel>Possui Gerador Diesel?</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
      
      {form.watch("hasDiesel") && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <FormField
            control={form.control}
            name="dieselPowerKw"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Potência Total (kW)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="dieselConsumption"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Consumo (L/kWh)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="dieselFuelCost"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Custo Combustível (R$/L)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}
    </div>
  );
}
