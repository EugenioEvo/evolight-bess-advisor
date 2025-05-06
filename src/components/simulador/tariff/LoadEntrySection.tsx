
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UseFormReturn } from "react-hook-form";
import { SimuladorFormValues } from "@/schemas/simuladorSchema";
import { HourlyDemandInput } from '../HourlyDemandInput';

interface LoadEntrySectionProps {
  form: UseFormReturn<SimuladorFormValues>;
}

export function LoadEntrySection({ form }: LoadEntrySectionProps) {
  const loadEntryMethod = form.watch("loadEntryMethod");

  return (
    <div className="mb-6">
      <h4 className="text-md font-medium mb-2">Dados de Consumo</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="loadEntryMethod"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Método de Entrada</FormLabel>
              <FormControl>
                <RadioGroup 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                  className="flex flex-row space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="average" id="average" />
                    <FormLabel htmlFor="average" className="font-normal">Dados Médios</FormLabel>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="hourly" id="hourly" />
                    <FormLabel htmlFor="hourly" className="font-normal">Valores Horários</FormLabel>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="upload" id="upload" />
                    <FormLabel htmlFor="upload" className="font-normal">Upload Arquivo</FormLabel>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {loadEntryMethod === "average" && <AverageDemandFields form={form} />}
        
        {loadEntryMethod === "hourly" && (
          <div className="col-span-2">
            <h5 className="text-sm font-medium mb-2 text-gray-700">Demanda Horária (kW)</h5>
            <p className="text-sm text-gray-500 mb-2">
              Informe a potência média para cada hora do dia:
            </p>
            <HourlyDemandInput form={form} />
          </div>
        )}
        
        {loadEntryMethod === "upload" && (
          <FormItem>
            <FormLabel>Arquivo de Consumo (.csv, .xlsx)</FormLabel>
            <FormControl>
              <Input type="file" accept=".csv,.xlsx" disabled />
            </FormControl>
            <FormDescription>
              Funcionalidade em desenvolvimento. Por favor, use a entrada por dados médios ou valores horários.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      </div>
    </div>
  );
}

function AverageDemandFields({ form }: { form: UseFormReturn<SimuladorFormValues> }) {
  return (
    <>
      <div className="col-span-2">
        <h5 className="text-sm font-medium mb-2 text-gray-700">Demanda (kW)</h5>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="avgPeakDemandKw"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Média na Ponta</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
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
                <FormLabel>Média Fora Ponta</FormLabel>
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
                <FormLabel>Máxima na Ponta</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
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
                <FormLabel>Máxima Fora Ponta</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
      
      <div className="col-span-2">
        <h5 className="text-sm font-medium mb-2 text-gray-700">Consumo (kWh)</h5>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="avgDailyPeakConsumptionKwh"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Diário na Ponta</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
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
                <FormLabel>Diário Fora Ponta</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="avgMonthlyPeakConsumptionKwh"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mensal na Ponta</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
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
                <FormLabel>Mensal Fora Ponta</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </>
  );
}
