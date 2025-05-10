
import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { useWizard } from '../context/WizardContext';
import { WizardFormValues } from '../schema';
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { DollarSign, Clock, ArrowBigUp, ArrowBigDown, AlertTriangle } from 'lucide-react';
import { TimeRangeSelector } from '../ui/TimeRangeSelector';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';

export function TariffStep() {
  const { setCanProceed } = useWizard();
  const { control, watch, setValue, getValues } = useFormContext<WizardFormValues>();
  
  const tariffGroup = watch('tariffGroup');
  const simpleTariff = watch('simpleTariff');
  const tePeak = watch('tePeak');
  const teOffpeak = watch('teOffpeak');
  const tusdPeak = watch('tusdPeak');
  const tusdOffpeak = watch('tusdOffpeak');
  const peakStartHour = watch('peakStartHour');
  const peakEndHour = watch('peakEndHour');
  
  // Validate form based on tariff group
  useEffect(() => {
    if (tariffGroup === 'groupB') {
      setCanProceed(simpleTariff > 0);
    } else if (tariffGroup === 'groupA') {
      // Check if all required tariff fields have valid values
      const hasValidTariffs = tePeak > 0 && teOffpeak > 0 && tusdPeak >= 0 && tusdOffpeak >= 0;
      setCanProceed(hasValidTariffs);
    } else {
      setCanProceed(true); // Unknown tariff group, allow to proceed
    }
  }, [
    tariffGroup, 
    simpleTariff, 
    tePeak, 
    teOffpeak, 
    tusdPeak, 
    tusdOffpeak, 
    setCanProceed
  ]);
  
  // Calculate combined tariffs
  const combinedPeakTariff = (tePeak || 0) + (tusdPeak || 0);
  const combinedOffpeakTariff = (teOffpeak || 0) + (tusdOffpeak || 0);
  
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-2">Estrutura Tarifária</h2>
        <p className="text-muted-foreground">
          Informe os valores de tarifa aplicáveis ao seu contrato de energia.
        </p>
      </div>
      
      {tariffGroup === 'groupB' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Tarifa Grupo B (Convencional)
            </CardTitle>
            <CardDescription>
              Para unidades consumidoras de baixa tensão com tarifa única (residências, pequenos comércios)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={control}
              name="simpleTariff"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor da tarifa (R$/kWh)</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <Input
                        type="number"
                        placeholder="Ex: 0.96"
                        step="0.01"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                      <span className="text-sm text-muted-foreground">R$/kWh</span>
                    </div>
                  </FormControl>
                  <FormDescription>
                    Valor unitário da energia na sua fatura (incluindo impostos)
                  </FormDescription>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
      )}
      
      {tariffGroup === 'groupA' && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Horário de Ponta
              </CardTitle>
              <CardDescription>
                Defina o período de ponta conforme sua distribuidora local
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <TimeRangeSelector
                  startHour={peakStartHour}
                  endHour={peakEndHour}
                  onStartChange={(hour) => setValue('peakStartHour', hour)}
                  onEndChange={(hour) => setValue('peakEndHour', hour)}
                  minDuration={1}
                  maxDuration={6}
                />
                
                <div className="text-sm text-muted-foreground">
                  Período de ponta definido das {peakStartHour}h às {peakEndHour}h
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowBigUp className="h-5 w-5 text-red-500" />
                  Tarifas de Ponta
                </CardTitle>
                <CardDescription>
                  Valores aplicados no horário de ponta ({peakStartHour}h-{peakEndHour}h)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <FormField
                    control={control}
                    name="tePeak"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>TE Ponta (R$/kWh)</FormLabel>
                        <FormControl>
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-red-600" />
                            <Input
                              type="number"
                              placeholder="Ex: 0.50"
                              step="0.01"
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                            <span className="text-sm text-muted-foreground">R$/kWh</span>
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={control}
                    name="tusdPeak"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>TUSD Ponta (R$/kWh)</FormLabel>
                        <FormControl>
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-red-600" />
                            <Input
                              type="number"
                              placeholder="Ex: 0.20"
                              step="0.01"
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                            <span className="text-sm text-muted-foreground">R$/kWh</span>
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="mt-4 p-2 bg-muted/50 rounded-lg">
                          <div className="flex items-center justify-between text-sm">
                            <span>Tarifa total ponta:</span>
                            <span className="font-medium">R$ {combinedPeakTariff.toFixed(2)}/kWh</span>
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Soma de TE + TUSD no horário de ponta</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowBigDown className="h-5 w-5 text-green-500" />
                  Tarifas Fora Ponta
                </CardTitle>
                <CardDescription>
                  Valores aplicados fora do horário de ponta
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <FormField
                    control={control}
                    name="teOffpeak"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>TE Fora Ponta (R$/kWh)</FormLabel>
                        <FormControl>
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-green-600" />
                            <Input
                              type="number"
                              placeholder="Ex: 0.30"
                              step="0.01"
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                            <span className="text-sm text-muted-foreground">R$/kWh</span>
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={control}
                    name="tusdOffpeak"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>TUSD Fora Ponta (R$/kWh)</FormLabel>
                        <FormControl>
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-green-600" />
                            <Input
                              type="number"
                              placeholder="Ex: 0.10"
                              step="0.01"
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                            <span className="text-sm text-muted-foreground">R$/kWh</span>
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="mt-4 p-2 bg-muted/50 rounded-lg">
                          <div className="flex items-center justify-between text-sm">
                            <span>Tarifa total fora ponta:</span>
                            <span className="font-medium">R$ {combinedOffpeakTariff.toFixed(2)}/kWh</span>
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Soma de TE + TUSD fora do horário de ponta</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                Demanda Contratada
              </CardTitle>
              <CardDescription>
                Informações sobre demanda contratada e registro
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <FormField
                    control={control}
                    name="peakContractedDemandKw"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Demanda contratada ponta</FormLabel>
                        <FormControl>
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              placeholder="Ex: 500 kW"
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                            <span className="text-sm text-muted-foreground">kW</span>
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={control}
                    name="peakDemandKw"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Demanda medida ponta</FormLabel>
                        <FormControl>
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              placeholder="Ex: 450 kW"
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                            <span className="text-sm text-muted-foreground">kW</span>
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="space-y-4">
                  <FormField
                    control={control}
                    name="offpeakContractedDemandKw"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Demanda contratada fora ponta</FormLabel>
                        <FormControl>
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              placeholder="Ex: 600 kW"
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                            <span className="text-sm text-muted-foreground">kW</span>
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={control}
                    name="offpeakDemandKw"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Demanda medida fora ponta</FormLabel>
                        <FormControl>
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              placeholder="Ex: 550 kW"
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                            <span className="text-sm text-muted-foreground">kW</span>
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <FormField
                control={control}
                name="demandCharge"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tarifa de demanda (TUSD Demanda)</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-yellow-600" />
                        <Input
                          type="number"
                          placeholder="Ex: 20.00"
                          step="0.01"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                        <span className="text-sm text-muted-foreground">R$/kW·mês</span>
                      </div>
                    </FormControl>
                    <FormDescription>
                      Valor cobrado por kW de demanda contratada por mês
                    </FormDescription>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
