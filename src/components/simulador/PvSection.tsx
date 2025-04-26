
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from "react-hook-form";
import { SimuladorFormValues } from "@/schemas/simuladorSchema";

interface PvSectionProps {
  form: UseFormReturn<SimuladorFormValues>;
}

export function PvSection({ form }: PvSectionProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Sistema Solar Fotovoltaico</h3>
        <FormField
          control={form.control}
          name="hasPv"
          render={({ field }) => (
            <FormItem className="flex items-center space-x-2">
              <FormLabel>Possui/Planeja PV?</FormLabel>
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
      
      {form.watch("hasPv") && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <FormField
            control={form.control}
            name="pvPowerKwp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Potência Instalada (kWp)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="pvPolicy"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Política com a Rede</FormLabel>
                <FormControl>
                  <RadioGroup 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    className="flex flex-row space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="inject" id="inject" />
                      <FormLabel htmlFor="inject" className="font-normal">Injeta Excedente</FormLabel>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="grid_zero" id="grid_zero" />
                      <FormLabel htmlFor="grid_zero" className="font-normal">Não Injeta (Grid-Zero)</FormLabel>
                    </div>
                  </RadioGroup>
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
