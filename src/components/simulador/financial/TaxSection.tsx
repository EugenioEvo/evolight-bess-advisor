
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from "react-hook-form";
import { SimuladorFormValues } from "@/schemas/simuladorSchema";

interface TaxSectionProps {
  form: UseFormReturn<SimuladorFormValues>;
}

export function TaxSection({ form }: TaxSectionProps) {
  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-md font-medium">Premissas Tributárias</h4>
        <FormField
          control={form.control}
          name="considerTaxes"
          render={({ field }) => (
            <FormItem className="flex items-center space-x-2">
              <FormLabel>Considerar Impostos?</FormLabel>
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
      
      {form.watch("considerTaxes") && (
        <div className="pl-8">
          <FormField
            control={form.control}
            name="taxRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Alíquota Combinada (IRPJ/CSLL, %)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.1" min="0" max="100" {...field} />
                </FormControl>
                <FormDescription>
                  Nota: Esta é uma simplificação tributária para fins de estimativa. Consulte um especialista fiscal para análise detalhada.
                </FormDescription>
              </FormItem>
            )}
          />
        </div>
      )}
    </div>
  );
}
