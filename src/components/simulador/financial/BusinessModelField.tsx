
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UseFormReturn } from "react-hook-form";
import { SimuladorFormValues } from "@/schemas/simuladorSchema";

interface BusinessModelFieldProps {
  form: UseFormReturn<SimuladorFormValues>;
}

export function BusinessModelField({ form }: BusinessModelFieldProps) {
  return (
    <FormField
      control={form.control}
      name="businessModel"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Modelo de Negócio</FormLabel>
          <FormControl>
            <RadioGroup 
              onValueChange={field.onChange} 
              defaultValue={field.value}
              className="flex flex-row space-x-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="turnkey" id="turnkey" />
                <FormLabel htmlFor="turnkey" className="font-normal">Compra Direta</FormLabel>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="eaas" id="eaas" />
                <FormLabel htmlFor="eaas" className="font-normal">Locação/EAAS</FormLabel>
              </div>
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
