
import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { useWizard } from '../context/WizardContext';
import { WizardFormValues, OBJECTIVE_OPTIONS } from '../schema';
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { 
  DollarSign, 
  TrendingDown, 
  Shield, 
  Grid, 
  Sun, 
  ZapOff, 
  Check, 
  X, 
  Scale 
} from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

export function StrategyStep() {
  const { setCanProceed } = useWizard();
  const { control, watch, setValue } = useFormContext<WizardFormValues>();
  
  const objectives = watch('objectives');
  
  // Enable next button if at least one objective is selected
  useEffect(() => {
    setCanProceed(objectives && objectives.length > 0);
  }, [objectives, setCanProceed]);
  
  const getIconForObjective = (value: string) => {
    switch (value) {
      case 'reduce_bill':
        return <DollarSign className="h-6 w-6" />;
      case 'peak_shaving':
        return <TrendingDown className="h-6 w-6" />;
      case 'backup':
        return <Shield className="h-6 w-6" />;
      case 'grid_zero':
        return <Grid className="h-6 w-6" />;
      case 'pv_optim':
        return <Sun className="h-6 w-6" />;
      default:
        return null;
    }
  };
  
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-2">Estratégia Energética</h2>
        <p className="text-muted-foreground">
          Quais objetivos você quer alcançar com seu sistema de armazenamento?
        </p>
      </div>
      
      {/* Objectives */}
      <FormField
        control={control}
        name="objectives"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>Selecione os objetivos principais (múltipla escolha)</FormLabel>
            <FormControl>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {OBJECTIVE_OPTIONS.map((option) => {
                  const isSelected = field.value?.includes(option.value);
                  
                  return (
                    <Card 
                      key={option.value}
                      className={`cursor-pointer transition-all ${
                        isSelected ? 'ring-2 ring-primary' : 'hover:border-primary/50'
                      }`}
                      onClick={() => {
                        const newValues = isSelected 
                          ? field.value.filter(v => v !== option.value)
                          : [...(field.value || []), option.value];
                        field.onChange(newValues);
                      }}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${isSelected ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                            {getIconForObjective(option.value)}
                          </div>
                          <div className="space-y-1 flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium">{option.label}</h4>
                              <Checkbox
                                checked={isSelected}
                                onCheckedChange={(checked) => {
                                  const newValues = checked 
                                    ? [...(field.value || []), option.value]
                                    : field.value.filter(v => v !== option.value);
                                  field.onChange(newValues);
                                }}
                              />
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {option.description}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </FormControl>
          </FormItem>
        )}
      />
      
      {/* Additional Questions */}
      <div className="space-y-6 bg-muted/50 p-6 rounded-lg">
        <FormField
          control={control}
          name="hasBlackouts"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <ZapOff className="h-4 w-4 text-muted-foreground" />
                  <FormLabel>Você sofre com quedas de energia ou problemas de tensão?</FormLabel>
                </div>
                <FormDescription>
                  Isso ajuda a dimensionar a função de backup do sistema
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="canInjectToGrid"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Grid className="h-4 w-4 text-muted-foreground" />
                  <FormLabel>Você pode injetar energia na rede elétrica?</FormLabel>
                </div>
                <FormDescription>
                  Se não for permitido, ativaremos o modo Grid Zero
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="focusTechnical"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sua principal preocupação é:</FormLabel>
              <FormControl>
                <RadioGroup
                  value={field.value ? 'technical' : 'financial'}
                  onValueChange={(v) => field.onChange(v === 'technical')}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="financial" id="financial" />
                    <Label htmlFor="financial" className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Retorno financeiro
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="technical" id="technical" />
                    <Label htmlFor="technical" className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Autonomia técnica
                    </Label>
                  </div>
                </RadioGroup>
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
