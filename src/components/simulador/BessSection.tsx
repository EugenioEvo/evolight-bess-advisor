
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
          name="bessTechnology"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tecnologia</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a tecnologia" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="lfp">LFP (Lítio Ferro Fosfato)</SelectItem>
                  <SelectItem value="nmc">NMC (Níquel Manganês Cobalto)</SelectItem>
                </SelectContent>
              </Select>
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
        
        <FormField
          control={form.control}
          name="bessLifetime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vida Útil (anos)</FormLabel>
              <FormControl>
                <Input type="number" step="1" min="1" max="30" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="bessAnnualDegradation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Degradação Anual (%)</FormLabel>
              <FormControl>
                <Input type="number" step="0.1" min="0" max="10" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="bessDailySelfdischarge"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Autodescarga Diária (%)</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" min="0" max="5" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
