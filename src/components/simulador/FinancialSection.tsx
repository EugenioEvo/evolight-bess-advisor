
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <FormField
            control={form.control}
            name="bessInstallationCost"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Custo BESS Instalado (R$/kWh)</FormLabel>
                <FormControl>
                  <Input type="number" step="100" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="capexCost"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Custo Total BESS (R$)</FormLabel>
                <FormControl>
                  <Input type="number" step="1000" {...field} />
                </FormControl>
                <FormDescription>
                  Opcional. Se preenchido, substitui o cálculo baseado em R$/kWh.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="annualOmCost"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Custo O&M Anual (% CAPEX)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.1" {...field} />
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
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <FormField
          control={form.control}
          name="incentivesValue"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Incentivos (Valor Total R$)</FormLabel>
              <FormControl>
                <Input type="number" step="1000" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="annualLoadGrowth"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Crescimento Anual Carga (%)</FormLabel>
              <FormControl>
                <Input type="number" step="0.1" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="annualTariffAdjustment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reajuste Anual Tarifa (%)</FormLabel>
              <FormControl>
                <Input type="number" step="0.1" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <div className="mt-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-md font-medium">Adiamento de Upgrade da Rede</h4>
          <FormField
            control={form.control}
            name="avoidsGridUpgrade"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormLabel>BESS evita upgrade?</FormLabel>
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
        
        {form.watch("avoidsGridUpgrade") && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-8">
            <FormField
              control={form.control}
              name="avoidedUpgradeCost"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Custo Upgrade Evitado (R$)</FormLabel>
                  <FormControl>
                    <Input type="number" step="1000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="upgradeForeseeenYear"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ano Previsto Upgrade</FormLabel>
                  <FormControl>
                    <Input type="number" step="1" min="1" max="30" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}
      </div>
      
      <div className="mt-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-md font-medium">Premissas Tributárias</h4>
          <FormField
            control={form.control}
            name="considerTaxes"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormLabel>Considerar Impostos?</FormLabel>
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
        
        {form.watch("considerTaxes") && (
          <div className="pl-8">
            <FormField
              control={form.control}
              name="taxRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alíquota Combinada (IRPJ/CSLL, %)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.1" min="0" max="100" {...field} />
                  </FormControl>
                  <FormDescription>
                    Nota: Esta é uma simplificação tributária para fins de estimativa. Consulte um especialista fiscal para análise detalhada.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}
      </div>
    </div>
  );
}
