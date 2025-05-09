
import React, { useCallback } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UseFormReturn } from "react-hook-form";
import { SimuladorFormValues } from "@/schemas/simuladorSchema";
import { HourlyDemandInput } from '../HourlyDemandInput';
import { toast } from 'sonner';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";

interface LoadEntrySectionProps {
  form: UseFormReturn<SimuladorFormValues>;
}

export function LoadEntrySection({ form }: LoadEntrySectionProps) {
  const loadEntryMethod = form.watch("loadEntryMethod");

  const handleLoadProfileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        // Parse CSV or text file data
        const lines = text.trim().split(/[\r\n,]+/);
        
        // Convert all values to numbers and validate
        const profile = lines
          .map(line => parseFloat(line.trim()))
          .filter(val => !isNaN(val));
          
        // Check if we have valid data
        if (profile.length === 0) {
          toast.error("Arquivo inválido", {
            description: "O arquivo não contém valores numéricos válidos."
          });
          return;
        }
        
        // If we have fewer than 24 values, repeat the pattern or pad with zeros
        let hourlyDemandKw = [...profile];
        if (profile.length < 24) {
          // Repeat pattern to fill 24 hours
          for (let i = profile.length; i < 24; i++) {
            hourlyDemandKw.push(profile[i % profile.length]);
          }
        } else if (profile.length > 24) {
          // Use only the first 24 values
          hourlyDemandKw = profile.slice(0, 24);
        }
        
        // Update the form with the new hourly demand values
        form.setValue('hourlyDemandKw', hourlyDemandKw);
        form.setValue('loadEntryMethod', 'hourly');
        
        toast.success("Perfil de carga importado", {
          description: `${hourlyDemandKw.length} valores horários importados com sucesso.`
        });
      } catch (err) {
        console.error("Error parsing load profile file:", err);
        toast.error("Erro ao processar arquivo", {
          description: "O formato do arquivo não é compatível. Use um arquivo CSV ou texto com valores separados por linhas ou vírgulas."
        });
      }
    };
    
    reader.onerror = () => {
      toast.error("Erro ao ler arquivo", {
        description: "Não foi possível ler o arquivo. Tente novamente."
      });
    };
    
    reader.readAsText(file);
  }, [form]);

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
          <div className="col-span-2">
            <FormItem>
              <FormLabel>Arquivo de Consumo (.csv, .txt)</FormLabel>
              <FormControl>
                <Input 
                  type="file" 
                  accept=".csv,.txt" 
                  onChange={handleLoadProfileUpload}
                />
              </FormControl>
              <FormDescription>
                Faça upload de um arquivo com 24 valores (um por linha ou separados por vírgulas) representando a demanda em kW para cada hora do dia.
              </FormDescription>
              <FormMessage />
            </FormItem>
            
            <Alert className="mt-4 bg-blue-50">
              <AlertCircle className="h-4 w-4 text-blue-500" />
              <AlertDescription className="text-sm">
                Após o upload, os valores serão exibidos no modo de entrada "Valores Horários" para revisão. 
                Se o arquivo contiver menos de 24 valores, o padrão será repetido para completar as 24 horas.
              </AlertDescription>
            </Alert>
          </div>
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
