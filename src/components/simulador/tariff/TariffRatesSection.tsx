
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { SimuladorFormValues } from "@/schemas/simuladorSchema";

interface TariffRatesSectionProps {
  form: UseFormReturn<SimuladorFormValues>;
}

export function TariffRatesSection({ form }: TariffRatesSectionProps) {
  const tarifaryGroup = form.watch("tarifaryGroup");
  const modalityA = form.watch("modalityA");
  const isBlueModality = modalityA === "blue";

  return (
    <div>
      <h4 className="text-md font-medium mb-2">Tarifas</h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tarifaryGroup === "groupA" ? (
          <>
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
              name="teIntermediate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>TE Intermediária (R$/kWh)</FormLabel>
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
              name="tusdIntermediateKwh"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>TUSD Intermediária (R$/kWh)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {isBlueModality && (
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
            )}
            
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
          </>
        ) : (
          <FormField
            control={form.control}
            name="tariffB"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tarifa Monômia (R$/kWh)</FormLabel>
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
          name="flagCost"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Custo Adicional Bandeira (R$/kWh)</FormLabel>
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
  );
}
