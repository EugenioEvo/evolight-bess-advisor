
import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { useWizard } from '../context/WizardContext';
import { WizardFormValues } from '../schema';
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { BarChartIcon, Upload, Sun, LineChart, Clock } from 'lucide-react';
import { HourlyDemandInput } from '@/components/simulador/HourlyDemandInput';
import { ConsumptionPatternSelector } from '../ui/ConsumptionPatternSelector';

export function ProfileStep() {
  const { setCanProceed } = useWizard();
  const { control, watch, setValue } = useFormContext<WizardFormValues>();
  
  const profileEntryMethod = watch('profileEntryMethod');
  const hourlyDemandKw = watch('hourlyDemandKw');
  const hasPv = watch('hasPv');
  
  // Check if profile data is valid to proceed
  useEffect(() => {
    if (profileEntryMethod === 'simple') {
      setCanProceed(true);
    } else if (profileEntryMethod === 'hourly') {
      const hasValidData = hourlyDemandKw && 
        hourlyDemandKw.length === 24 && 
        hourlyDemandKw.some(val => val > 0);
      setCanProceed(hasValidData);
    } else {
      // Upload method validation would go here
      setCanProceed(false);
    }
  }, [profileEntryMethod, hourlyDemandKw, setCanProceed]);
  
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-2">Perfil Energético</h2>
        <p className="text-muted-foreground">
          Informe como a energia é consumida e, se aplicável, gerada ao longo do dia.
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LineChart className="h-5 w-5" />
            Perfil de Consumo
          </CardTitle>
          <CardDescription>
            Como você deseja informar seu consumo de energia?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FormField
            control={control}
            name="profileEntryMethod"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <RadioGroup
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(value);
                      // If switching to simple, generate default data
                      if (value === 'simple') {
                        setValue('profileType', 'daytime');
                        // Apply a default pattern
                        const pattern = generatePattern('daytime');
                        setValue('hourlyDemandKw', pattern);
                      }
                    }}
                    className="flex flex-col space-y-3"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="simple" id="simple" />
                      <Label htmlFor="simple" className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Perfil simplificado (padrões comuns)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="hourly" id="hourly" />
                      <Label htmlFor="hourly" className="flex items-center gap-2">
                        <BarChartIcon className="h-4 w-4" />
                        Consumo hora a hora (detalhado)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="upload" id="upload" />
                      <Label htmlFor="upload" className="flex items-center gap-2">
                        <Upload className="h-4 w-4" />
                        Upload de arquivo CSV
                      </Label>
                    </div>
                  </RadioGroup>
                </FormControl>
              </FormItem>
            )}
          />
          
          {/* Profile input based on method */}
          <div className="mt-6">
            {profileEntryMethod === 'simple' && (
              <ConsumptionPatternSelector
                onSelect={(pattern) => {
                  setValue('profileType', pattern);
                  setValue('hourlyDemandKw', generatePattern(pattern));
                }}
              />
            )}
            
            {profileEntryMethod === 'hourly' && (
              <HourlyDemandInput 
                values={hourlyDemandKw}
                onChange={(values) => setValue('hourlyDemandKw', values)}
                className="h-80"
              />
            )}
            
            {profileEntryMethod === 'upload' && (
              <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-lg">
                <Upload className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground mb-4">
                  Arraste um arquivo CSV ou clique para selecionar
                </p>
                <Button variant="outline">Selecionar Arquivo</Button>
                <p className="text-xs text-muted-foreground mt-4">
                  Formatos aceitos: CSV com 24 valores (carga em kW por hora)
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {hasPv && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sun className="h-5 w-5 text-yellow-500" />
              Perfil de Geração Solar
            </CardTitle>
            <CardDescription>
              Como você deseja informar sua geração fotovoltaica?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={control}
              name="pvProfileMethod"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <RadioGroup
                      value={field.value}
                      onValueChange={field.onChange}
                      className="flex flex-col space-y-3"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="auto" id="auto" />
                        <Label htmlFor="auto">
                          Calcular automaticamente com base no kWp informado
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="upload" id="uploadPv" />
                        <Label htmlFor="uploadPv">
                          Upload de arquivo CSV com dados reais
                        </Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />
            
            <div className="mt-6">
              {watch('pvProfileMethod') === 'auto' && (
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Sun className="h-6 w-6 text-yellow-600 mt-1" />
                    <div>
                      <p className="font-medium text-yellow-800">
                        Geração Solar Estimada
                      </p>
                      <p className="text-sm text-yellow-700 mt-1">
                        Com {watch('pvPowerKwp')} kWp e insolação média de 4,5 kWh/kWp/dia, 
                        sua geração média diária será de aproximadamente {(watch('pvPowerKwp') * 4.5).toFixed(0)} kWh.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {watch('pvProfileMethod') === 'upload' && (
                <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-lg">
                  <Upload className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-sm text-muted-foreground mb-4">
                    Arraste um arquivo CSV ou clique para selecionar
                  </p>
                  <Button variant="outline">Selecionar Arquivo</Button>
                  <p className="text-xs text-muted-foreground mt-4">
                    Formatos aceitos: CSV com 24 valores (geração em kW por hora)
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Chart Preview */}
      <Card className="bg-muted/40">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Prévia da Curva de Carga</CardTitle>
          <CardDescription>
            Visualize seu perfil de consumo{hasPv ? ' e geração' : ''} ao longo do dia
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Chart preview would go here */}
          <div className="h-48 flex items-center justify-center bg-muted rounded-md">
            <p className="text-sm text-muted-foreground">
              Gráfico de previsualização (a ser implementado)
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Helper function to generate patterns
function generatePattern(pattern: string): number[] {
  switch (pattern) {
    case 'daytime': // Higher during the day
      return [
        30, 25, 20, 20, 25, 30, 45, 60, 
        85, 100, 110, 115, 120, 115, 100, 
        85, 70, 60, 50, 45, 40, 35, 35, 30
      ];
    case 'nighttime': // Higher during the evening
      return [
        45, 35, 30, 25, 25, 30, 45, 60, 
        70, 80, 85, 90, 85, 80, 70, 85, 
        100, 110, 120, 100, 90, 80, 70, 60
      ];
    case 'constant': // Relatively flat
      return Array(24).fill(80);
    default:
      return Array(24).fill(0);
  }
}
