
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from "react-hook-form";
import { SimuladorFormValues } from "@/schemas/simuladorSchema";

interface GridUpgradeSectionProps {
  form: UseFormReturn<SimuladorFormValues>;
}

export function GridUpgradeSection({ form }: GridUpgradeSectionProps) {
  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-md font-medium">Adiamento de Upgrade da Rede</h4>
        <FormField
          control={form.control}
          name="avoidsGridUpgrade"
          render={({ field }) => (
            <FormItem className="flex items-center space-x-2">
              <FormLabel>BESS evita upgrade?</FormLabel>
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
      
      {form.watch("avoidsGridUpgrade") && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-8">
          <FormField
            control={form.control}
            name="avoidedUpgradeCost"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Custo Upgrade Evitado (R$)</FormLabel>
                <FormControl>
                  <Input type="number" step="1000" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="upgradeForeseeenYear"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ano Previsto Upgrade</FormLabel>
                <FormControl>
                  <Input type="number" step="1" min="1" max="30" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      )}
    </div>
  );
}
