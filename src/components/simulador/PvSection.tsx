
import React, { useCallback } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from "react-hook-form";
import { SimuladorFormValues } from "@/schemas/simuladorSchema";
import { toast } from 'sonner';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PvSectionProps {
  form: UseFormReturn<SimuladorFormValues>;
}

export function PvSection({ form }: PvSectionProps) {
  const handlePvProfileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
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
        let pvProfile = [...profile];
        if (profile.length < 24) {
          // Repeat pattern to fill 24 hours
          for (let i = profile.length; i < 24; i++) {
            pvProfile.push(profile[i % profile.length]);
          }
        } else if (profile.length > 24) {
          // Use only the first 24 values
          pvProfile = profile.slice(0, 24);
        }
        
        // Calculate total power for estimation
        const maxPower = Math.max(...pvProfile);
        const totalEnergy = pvProfile.reduce((sum, val) => sum + val, 0);
        
        // Estimate PV power based on the profile
        // Assuming peak values represent ~80% of the nominal capacity
        const estimatedPvPower = maxPower > 0 ? maxPower / 0.8 : 0;
        const estimatedAnnualGeneration = totalEnergy * 365; // Simple estimation
        
        // Update the form
        form.setValue('pvProfileData', pvProfile);
        form.setValue('pvDataEntryMethod', 'upload');
        form.setValue('pvPowerKwp', estimatedPvPower);
        form.setValue('pvAnnualGeneration', estimatedAnnualGeneration);
        
        toast.success("Perfil PV importado", {
          description: `${pvProfile.length} valores horários de geração solar importados com sucesso.`
        });
      } catch (err) {
        console.error("Error parsing PV profile file:", err);
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
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Sistema Solar Fotovoltaico</h3>
        <FormField
          control={form.control}
          name="hasPv"
          render={({ field }) => (
            <FormItem className="flex items-center space-x-2">
              <FormLabel>Possui/Planeja PV?</FormLabel>
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
      
      {form.watch("hasPv") && (
        <div className="space-y-4 mt-4">
          <FormField
            control={form.control}
            name="pvDataEntryMethod"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Método de Entrada de Dados</FormLabel>
                <FormControl>
                  <RadioGroup 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    className="flex flex-row space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="power" id="power" />
                      <FormLabel htmlFor="power" className="font-normal">Potência Instalada</FormLabel>
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
          
          {form.watch("pvDataEntryMethod") === "power" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="pvPowerKwp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Potência Instalada (kWp)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="pvAnnualGeneration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Geração Anual (kWh)</FormLabel>
                    <FormControl>
                      <Input type="number" step="100" {...field} />
                    </FormControl>
                    <FormDescription>
                      Opcional. Se não preenchido, será estimado com base na potência.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
          
          {form.watch("pvDataEntryMethod") === "upload" && (
            <div>
              <FormItem>
                <FormLabel>Arquivo de Geração PV (.csv, .txt)</FormLabel>
                <FormControl>
                  <Input 
                    type="file" 
                    accept=".csv,.txt"
                    onChange={handlePvProfileUpload}
                  />
                </FormControl>
                <FormDescription>
                  Faça upload de um arquivo com 24 valores (um por linha ou separados por vírgulas) representando a geração PV em kW para cada hora do dia.
                </FormDescription>
                <FormMessage />
              </FormItem>
              
              <Alert className="mt-4 bg-blue-50">
                <AlertCircle className="h-4 w-4 text-blue-500" />
                <AlertDescription className="text-sm">
                  Os dados carregados serão usados para gerar um perfil PV horário. 
                  Se o arquivo contiver menos de 24 valores, o padrão será repetido para completar as 24 horas.
                </AlertDescription>
              </Alert>
            </div>
          )}
          
          <FormField
            control={form.control}
            name="pvPolicy"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Política com a Rede</FormLabel>
                <FormControl>
                  <RadioGroup 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    className="flex flex-row space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="inject" id="inject" />
                      <FormLabel htmlFor="inject" className="font-normal">Injeta Excedente</FormLabel>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="grid_zero" id="grid_zero" />
                      <FormLabel htmlFor="grid_zero" className="font-normal">Não Injeta (Grid-Zero)</FormLabel>
                    </div>
                  </RadioGroup>
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
