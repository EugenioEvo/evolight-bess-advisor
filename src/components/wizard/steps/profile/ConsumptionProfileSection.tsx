
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { WizardFormValues } from '../../schema';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Upload, BarChartIcon, Clock } from 'lucide-react';
import { HourlyDemandInput } from '@/components/simulador/HourlyDemandInput';
import { ConsumptionPatternSelector } from '../../ui/ConsumptionPatternSelector';

export function ConsumptionProfileSection() {
  const { control, watch, setValue } = useFormContext<WizardFormValues>();
  const profileEntryMethod = watch('profileEntryMethod');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChartIcon className="h-5 w-5" />
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
                  onValueChange={(value: string) => {
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
        
        <div className="mt-6">
          {profileEntryMethod === 'simple' && (
            <ConsumptionPatternSelector
              onSelect={(pattern: string) => {
                // Ensure pattern is one of the allowed types
                const validPattern = pattern as "daytime" | "nighttime" | "constant";
                setValue('profileType', validPattern);
                setValue('hourlyDemandKw', generatePattern(validPattern));
              }}
            />
          )}
          
          {profileEntryMethod === 'hourly' && (
            <HourlyDemandInput 
              values={watch('hourlyDemandKw')}
              onChange={(values) => setValue('hourlyDemandKw', values)}
              className="h-80"
            />
          )}
          
          {profileEntryMethod === 'upload' && (
            <FileUploadArea description="Formatos aceitos: CSV com 24 valores (carga em kW por hora)" />
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Helper component for file upload
export function FileUploadArea({ description }: { description: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-lg">
      <Upload className="h-12 w-12 text-muted-foreground mb-4" />
      <p className="text-sm text-muted-foreground mb-4">
        Arraste um arquivo CSV ou clique para selecionar
      </p>
      <Button variant="outline">Selecionar Arquivo</Button>
      <p className="text-xs text-muted-foreground mt-4">
        {description}
      </p>
    </div>
  );
}

// Helper function to generate patterns
export function generatePattern(pattern: "daytime" | "nighttime" | "constant"): number[] {
  switch (pattern) {
    case "daytime": // Higher during the day
      return [
        30, 25, 20, 20, 25, 30, 45, 60, 
        85, 100, 110, 115, 120, 115, 100, 
        85, 70, 60, 50, 45, 40, 35, 35, 30
      ];
    case "nighttime": // Higher during the evening
      return [
        45, 35, 30, 25, 25, 30, 45, 60, 
        70, 80, 85, 90, 85, 80, 70, 85, 
        100, 110, 120, 100, 90, 80, 70, 60
      ];
    case "constant": // Relatively flat
      return Array(24).fill(80);
    default:
      return Array(24).fill(0);
  }
}
