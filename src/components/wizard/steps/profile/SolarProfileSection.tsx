
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { WizardFormValues } from '../../schema';
import { FormField, FormItem, FormControl } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Sun } from 'lucide-react';
import { HourlyDemandInput } from '@/components/simulador/HourlyDemandInput';
import { FileUploadArea } from './ConsumptionProfileSection';

export function SolarProfileSection() {
  const { control, watch, setValue } = useFormContext<WizardFormValues>();
  
  const hasPv = watch('hasPv');
  const pvPowerKwp = watch('pvPowerKwp');
  const pvProfileMethod = watch('pvProfileMethod');
  
  if (!hasPv) return null;
  
  return (
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
                    <RadioGroupItem value="hourly" id="hourlyPv" />
                    <Label htmlFor="hourlyPv">
                      Informar valores hora a hora
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
          {pvProfileMethod === 'auto' && (
            <SolarEstimationCard pvPowerKwp={pvPowerKwp} />
          )}
          
          {pvProfileMethod === 'hourly' && (
            <HourlyDemandInput 
              values={watch('hourlyPvKw')}
              onChange={(values) => setValue('hourlyPvKw', values)}
              className="h-80"
            />
          )}
          
          {pvProfileMethod === 'upload' && (
            <FileUploadArea description="Formatos aceitos: CSV com 24 valores (geração em kW por hora)" />
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function SolarEstimationCard({ pvPowerKwp }: { pvPowerKwp: number }) {
  return (
    <div className="p-4 bg-yellow-50 rounded-lg">
      <div className="flex items-start gap-3">
        <Sun className="h-6 w-6 text-yellow-600 mt-1" />
        <div>
          <p className="font-medium text-yellow-800">
            Geração Solar Estimada
          </p>
          <p className="text-sm text-yellow-700 mt-1">
            Com {pvPowerKwp} kWp e insolação média de 4,5 kWh/kWp/dia, 
            sua geração média diária será de aproximadamente {(pvPowerKwp * 4.5).toFixed(0)} kWh.
          </p>
        </div>
      </div>
    </div>
  );
}

// Helper function to generate a simple solar profile based on installed capacity
export function generateSolarProfile(kWp: number): number[] {
  // Simplified solar generation curve (bell curve)
  const baseProfile = [
    0, 0, 0, 0, 0, 0.05, 0.1, 0.3, 
    0.5, 0.7, 0.85, 0.95, 1.0, 0.95, 0.85, 
    0.7, 0.5, 0.3, 0.1, 0.05, 0, 0, 0, 0
  ];
  
  // Scale by installed capacity, assuming AC/DC ratio of 0.8
  return baseProfile.map(value => value * kWp * 0.8);
}
