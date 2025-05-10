
import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { useWizard } from '../context/WizardContext';
import { WizardFormValues } from '../schema';
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Building, Factory, Home, PuzzleIcon, Sun, Zap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export function SiteContextStep() {
  const { siteTypeOptions, tariffGroupOptions, setCanProceed } = useWizard();
  const { control, watch, setValue } = useFormContext<WizardFormValues>();
  
  const hasPv = watch('hasPv');
  const hasDiesel = watch('hasDiesel');
  const siteType = watch('siteType');
  const tariffGroup = watch('tariffGroup');
  
  // Check if required fields are filled to enable next button
  useEffect(() => {
    const hasRequiredFields = siteType && tariffGroup;
    setCanProceed(!!hasRequiredFields);
  }, [siteType, tariffGroup, setCanProceed]);
  
  const getIconForSiteType = (type: string) => {
    switch (type) {
      case 'industrial':
        return <Factory className="h-8 w-8" />;
      case 'commercial':
        return <Building className="h-8 w-8" />;
      case 'rural':
        return <Home className="h-8 w-8" />;
      default:
        return <PuzzleIcon className="h-8 w-8" />;
    }
  };
  
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-2">Contexto do Local</h2>
        <p className="text-muted-foreground">
          Vamos entender o tipo de unidade consumidora e sua estrutura atual.
        </p>
      </div>
      
      {/* Site Type Selection */}
      <FormField
        control={control}
        name="siteType"
        render={() => (
          <FormItem className="space-y-3">
            <FormLabel>Qual o tipo de unidade consumidora?</FormLabel>
            <FormControl>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {siteTypeOptions.map((option) => (
                  <Card
                    key={option.value}
                    className={`cursor-pointer transition-all ${
                      siteType === option.value 
                        ? 'ring-2 ring-primary' 
                        : 'hover:border-primary/50'
                    }`}
                    onClick={() => setValue('siteType', option.value)}
                  >
                    <CardContent className="flex flex-col items-center justify-center p-6">
                      {getIconForSiteType(option.value)}
                      <span className="mt-3 font-medium">{option.label}</span>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </FormControl>
          </FormItem>
        )}
      />
      
      {/* Tariff Group Selection */}
      <FormField
        control={control}
        name="tariffGroup"
        render={() => (
          <FormItem className="space-y-3">
            <FormLabel>Qual o seu modelo tarifário?</FormLabel>
            <FormControl>
              <TooltipProvider>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {tariffGroupOptions.map((option) => (
                    <Tooltip key={option.value}>
                      <TooltipTrigger asChild>
                        <Card
                          className={`cursor-pointer transition-all ${
                            tariffGroup === option.value 
                              ? 'ring-2 ring-primary' 
                              : 'hover:border-primary/50'
                          }`}
                          onClick={() => setValue('tariffGroup', option.value)}
                        >
                          <CardContent className="flex flex-col items-center justify-center p-6">
                            <span className="font-medium text-lg">{option.label}</span>
                          </CardContent>
                        </Card>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">{option.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              </TooltipProvider>
            </FormControl>
            <FormDescription>
              Grupo A: Alta tensão com demanda contratada. Grupo B: Baixa tensão com tarifa única.
            </FormDescription>
          </FormItem>
        )}
      />
      
      {/* PV System */}
      <FormField
        control={control}
        name="hasPv"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <FormLabel>Possui sistema fotovoltaico?</FormLabel>
                <FormDescription>
                  Indique se já possui geração solar instalada
                </FormDescription>
              </div>
              <FormControl>
                <Switch 
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </div>
          </FormItem>
        )}
      />
      
      {/* PV Power Input */}
      {hasPv && (
        <FormField
          control={control}
          name="pvPowerKwp"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Qual a potência da usina solar (kWp)?</FormLabel>
              <FormControl>
                <div className="flex items-center gap-2">
                  <Sun className="h-5 w-5 text-yellow-500" />
                  <Input
                    type="number"
                    placeholder="Ex: 150 kWp"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                  <span className="text-sm text-muted-foreground">kWp</span>
                </div>
              </FormControl>
              <FormDescription>
                Potência nominal instalada em corrente contínua (CC)
              </FormDescription>
            </FormItem>
          )}
        />
      )}
      
      {/* Diesel System */}
      <FormField
        control={control}
        name="hasDiesel"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <FormLabel>Possui gerador diesel?</FormLabel>
                <FormDescription>
                  Indique se você tem um gerador diesel instalado
                </FormDescription>
              </div>
              <FormControl>
                <Switch 
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </div>
          </FormItem>
        )}
      />
      
      {/* Diesel Power Input */}
      {hasDiesel && (
        <FormField
          control={control}
          name="dieselPowerKw"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Qual a potência do gerador diesel (kW)?</FormLabel>
              <FormControl>
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-orange-500" />
                  <Input
                    type="number"
                    placeholder="Ex: 200 kW"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                  <span className="text-sm text-muted-foreground">kW</span>
                </div>
              </FormControl>
              <FormDescription>
                Potência nominal do gerador diesel
              </FormDescription>
            </FormItem>
          )}
        />
      )}
    </div>
  );
}
