
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from "react-hook-form";
import { SimuladorFormValues } from "@/schemas/simuladorSchema";

interface ControlStrategiesProps {
  form: UseFormReturn<SimuladorFormValues>;
}

export function ControlStrategies({ form }: ControlStrategiesProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Aplicações BESS Desejadas</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="usePeakShaving"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel>Peak Shaving (Gestão de Demanda)</FormLabel>
              </FormItem>
            )}
          />
          
          {form.watch("usePeakShaving") && (
            <FormField
              control={form.control}
              name="peakShavingTarget"
              render={({ field }) => (
                <FormItem className="pl-8">
                  <FormLabel>Meta de Demanda Máxima (kW)</FormLabel>
                  <FormControl>
                    <Input type="number" step="1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          
          <FormField
            control={form.control}
            name="useArbitrage"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel>Arbitragem (Energy Time Shifting)</FormLabel>
              </FormItem>
            )}
          />
        </div>
        
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="useBackup"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel>Backup/Reserva</FormLabel>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="usePvOptim"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel>Otimização Autoconsumo PV</FormLabel>
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
}
