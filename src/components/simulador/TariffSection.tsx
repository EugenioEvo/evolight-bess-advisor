import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { SimuladorFormValues } from "@/schemas/simuladorSchema";
import { HourlyDemandInput } from './HourlyDemandInput';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface TariffSectionProps {
  form: UseFormReturn<SimuladorFormValues>;
}

export function TariffSection({ form }: TariffSectionProps) {
  const tarifaryGroup = form.watch("tarifaryGroup");
  const modalityA = form.watch("modalityA");
  const isBlueModality = modalityA === "blue";
  const loadEntryMethod = form.watch("loadEntryMethod");

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Estrutura Tarifária e Consumo</h3>
      
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
          
          {loadEntryMethod === "average" && (
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
          )}
          
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

      <div className="mb-6">
        <h4 className="text-md font-medium mb-2">Grupo Tarifário</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="tarifaryGroup"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Grupo Tarifário</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o grupo tarifário" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="groupA">Grupo A (Alta/Média Tensão)</SelectItem>
                    <SelectItem value="groupB">Grupo B (Baixa Tensão)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {tarifaryGroup === "groupA" && (
            <FormField
              control={form.control}
              name="modalityA"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Modalidade Tarifária</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a modalidade" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="blue">Azul (Binômia com DP)</SelectItem>
                      <SelectItem value="green">Verde (Binômia)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>
      </div>
      
      <div className="mb-6">
        <h4 className="text-md font-medium mb-2">Dados de Demanda Contratada</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {isBlueModality && (
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
          )}
          
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
    </div>
  );
}
