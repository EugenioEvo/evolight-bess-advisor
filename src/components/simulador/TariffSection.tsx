import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { SimuladorFormValues } from "@/schemas/simuladorSchema";

interface TariffSectionProps {
  form: UseFormReturn<SimuladorFormValues>;
}

export function TariffSection({ form }: TariffSectionProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Estrutura Tarifária e Consumo</h3>
      
      <div className="mb-6">
        <h4 className="text-md font-medium mb-2">Dados de Consumo</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="avgPeakDemandKw"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Demanda Média Ponta (kW)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="maxPeakDemandKw"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Demanda Máxima Ponta (kW)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="avgDailyConsumptionKwh"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Consumo Médio Diário (kWh)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="avgMonthlyConsumptionKwh"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Consumo Médio Mensal (kWh)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-md font-medium mb-2">Dados de Demanda Contratada</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
      
      <div>
        <h4 className="text-md font-medium mb-2">Tarifas</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="tePeak"
            render={({ field }) => (
              <FormItem>
                <FormLabel>TE Ponta (R$/kWh)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="teOffpeak"
            render={({ field }) => (
              <FormItem>
                <FormLabel>TE Fora Ponta (R$/kWh)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="tusdPeakKwh"
            render={({ field }) => (
              <FormItem>
                <FormLabel>TUSD Ponta (R$/kWh)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="tusdOffpeakKwh"
            render={({ field }) => (
              <FormItem>
                <FormLabel>TUSD Fora Ponta (R$/kWh)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="tusdPeakKw"
            render={({ field }) => (
              <FormItem>
                <FormLabel>TUSD Demanda Ponta (R$/kW)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="tusdOffpeakKw"
            render={({ field }) => (
              <FormItem>
                <FormLabel>TUSD Demanda FP (R$/kW)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="peakStartHour"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Início Ponta (hora)</FormLabel>
                <FormControl>
                  <Input type="number" min="0" max="23" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="peakEndHour"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fim Ponta (hora)</FormLabel>
                <FormControl>
                  <Input type="number" min="0" max="23" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
}
