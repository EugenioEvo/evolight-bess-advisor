import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { SimuladorFormValues } from "@/schemas/simuladorSchema";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { HourlyDemandInput } from "../HourlyDemandInput";
import { MinDemandSection } from "./MinDemandSection";

interface LoadEntrySectionProps {
  form: UseFormReturn<SimuladorFormValues>;
}

export function LoadEntrySection({ form }: LoadEntrySectionProps) {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="loadEntryMethod"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>Método de Entrada de Dados</FormLabel>
            <FormControl>
              <RadioGroup {...field} className="flex flex-col space-y-1">
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <RadioGroupItem value="average" id="average" />
                  <FormLabel htmlFor="average">Média</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <RadioGroupItem value="hourly" id="hourly" />
                  <FormLabel htmlFor="hourly">Horária</FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {form.watch("loadEntryMethod") === "average" && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="avgPeakDemandKw"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Demanda Média na Ponta (kW)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="avgOffpeakDemandKw"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Demanda Média Fora Ponta (kW)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="maxPeakDemandKw"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Demanda Máxima na Ponta (kW)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="maxOffpeakDemandKw"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Demanda Máxima Fora Ponta (kW)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Add our new minimum demand section */}
          <MinDemandSection form={form} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="avgDailyPeakConsumptionKwh"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Consumo Diário na Ponta (kWh)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="avgDailyOffpeakConsumptionKwh"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Consumo Diário Fora Ponta (kWh)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="avgMonthlyPeakConsumptionKwh"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Consumo Mensal na Ponta (kWh)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="avgMonthlyOffpeakConsumptionKwh"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Consumo Mensal Fora Ponta (kWh)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </>
      )}
      
      {form.watch("loadEntryMethod") === "hourly" && (
        <HourlyDemandInput form={form} />
      )}
    </div>
  );
}
