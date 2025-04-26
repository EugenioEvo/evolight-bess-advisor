
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UseFormReturn } from "react-hook-form";
import { SimuladorFormValues } from "@/schemas/simuladorSchema";

interface FinancialSectionProps {
  form: UseFormReturn<SimuladorFormValues>;
}

export function FinancialSection({ form }: FinancialSectionProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Parâmetros Financeiros</h3>
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
      </div>
      
      {form.watch("businessModel") === "turnkey" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <FormField
            control={form.control}
            name="capexCost"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Custo BESS (R$)</FormLabel>
                <FormControl>
                  <Input type="number" step="1000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="annualOmCost"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Custo O&M Anual (R$)</FormLabel>
                <FormControl>
                  <Input type="number" step="100" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <FormField
            control={form.control}
            name="setupCost"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Custo Setup Inicial (R$)</FormLabel>
                <FormControl>
                  <Input type="number" step="1000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="annualServiceCost"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Custo Anual Serviço (R$)</FormLabel>
                <FormControl>
                  <Input type="number" step="1000" {...field} />
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
