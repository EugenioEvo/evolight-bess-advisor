
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { SimuladorFormValues } from "@/schemas/simuladorSchema";

interface ContractedDemandSectionProps {
  form: UseFormReturn<SimuladorFormValues>;
}

export function ContractedDemandSection({ form }: ContractedDemandSectionProps) {
  const modalityA = form.watch("modalityA");
  const isBlueModality = modalityA === "blue";

  return (
    <div className="mb-6">
      <h4 className="text-md font-medium mb-2">Dados de Demanda Contratada</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {isBlueModality && (
          <FormField
            control={form.control}
            name="contractedPeakDemandKw"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Demanda Contratada Ponta (kW)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        
        <FormField
          control={form.control}
          name="contractedOffpeakDemandKw"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Demanda Contratada Fora Ponta (kW)</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
