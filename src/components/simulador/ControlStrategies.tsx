
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { SimuladorFormValues } from "@/schemas/simuladorSchema";

interface ControlStrategiesProps {
  form: UseFormReturn<SimuladorFormValues>;
}

export function ControlStrategies({ form }: ControlStrategiesProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Aplicações BESS Desejadas</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="usePeakShaving"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel>Peak Shaving (Gestão de Demanda)</FormLabel>
              </FormItem>
            )}
          />
          
          {form.watch("usePeakShaving") && (
            <div className="pl-8 space-y-4">
              <FormField
                control={form.control}
                name="peakShavingMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Método de Peak Shaving</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione o método" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="percentage">Redução Percentual</SelectItem>
                        <SelectItem value="reduction">Redução em kW</SelectItem>
                        <SelectItem value="target">Alvo de Demanda</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {form.watch("peakShavingMethod") === "percentage" && (
                <FormField
                  control={form.control}
                  name="peakShavingPercentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Percentual de Redução (%)</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" max="100" step="1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {(form.watch("peakShavingMethod") === "reduction" || form.watch("peakShavingMethod") === "target") && (
                <FormField
                  control={form.control}
                  name="peakShavingTarget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {form.watch("peakShavingMethod") === "reduction" 
                          ? "Redução de Demanda (kW)" 
                          : "Meta de Demanda Máxima (kW)"}
                      </FormLabel>
                      <FormControl>
                        <Input type="number" step="1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
          )}
          
          <FormField
            control={form.control}
            name="useArbitrage"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel>Arbitragem (Energy Time Shifting)</FormLabel>
              </FormItem>
            )}
          />
        </div>
        
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="useBackup"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel>Backup/Reserva</FormLabel>
              </FormItem>
            )}
          />
          
          {form.watch("useBackup") && (
            <div className="pl-8 space-y-4">
              <FormField
                control={form.control}
                name="criticalLoadKw"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Carga Crítica (kW)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
                
              <FormField
                control={form.control}
                name="backupDurationHours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duração do Backup (horas)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.5" min="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
          
          <FormField
            control={form.control}
            name="usePvOptim"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel>Otimização Autoconsumo PV</FormLabel>
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
}
