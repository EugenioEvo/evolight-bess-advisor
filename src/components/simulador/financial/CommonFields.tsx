
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { SimuladorFormValues } from "@/schemas/simuladorSchema";
import { BusinessModelField } from './BusinessModelField';

interface CommonFieldsProps {
  form: UseFormReturn<SimuladorFormValues>;
}

export function CommonFields({ form }: CommonFieldsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <FormField
        control={form.control}
        name="discountRate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Taxa de Desconto (%)</FormLabel>
            <FormControl>
              <Input type="number" step="0.1" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="horizonYears"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Horizonte (Anos)</FormLabel>
            <FormControl>
              <Input type="number" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <BusinessModelField form={form} />
    </div>
  );
}
