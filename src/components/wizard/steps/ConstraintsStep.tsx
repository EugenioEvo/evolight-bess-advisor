
import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { useWizard } from '../context/WizardContext';
import { WizardFormValues } from '../schema';
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, Shield, Clock, Zap, CheckCircle, XCircle } from 'lucide-react';

export function ConstraintsStep() {
  const { setCanProceed } = useWizard();
  const { control, watch, setValue } = useFormContext<WizardFormValues>();
  
  const needsBackup = watch('needsBackup');
  const criticalLoadKw = watch('criticalLoadKw');
  const backupHours = watch('backupHours');
  
  // Always allow proceeding in this step as constraints are optional
  useEffect(() => {
    setCanProceed(true);
    
    // If backup is needed, make sure the values are > 0
    if (needsBackup && (criticalLoadKw <= 0 || backupHours <= 0)) {
      setCanProceed(false);
    }
  }, [needsBackup, criticalLoadKw, backupHours, setCanProceed]);
  
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-2">Restrições Técnicas</h2>
        <p className="text-muted-foreground">
          Informe os limites e requisitos técnicos para o sistema de armazenamento.
        </p>
      </div>
      
      {/* Grid Export Permission */}
      <FormField
        control={control}
        name="canInjectToGrid"
        render={({ field }) => (
          <FormItem>
            <div className="flex flex-row items-center justify-between space-x-2">
              <div className="space-y-0.5">
                <FormLabel>Injeção na rede permitida?</FormLabel>
                <FormDescription>
                  Se você não estiver autorizado a injetar energia na rede, o sistema será configurado no modo "Grid Zero"
                </FormDescription>
              </div>
              <FormControl>
                <div className="flex items-center gap-2">
                  {field.value ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </div>
              </FormControl>
            </div>
          </FormItem>
        )}
      />
      
      {/* Space Constraints */}
      <FormField
        control={control}
        name="hasSpaceConstraints"
        render={({ field }) => (
          <FormItem>
            <div className="flex flex-row items-center justify-between">
              <div className="space-y-0.5">
                <FormLabel>Existem limitações de espaço físico?</FormLabel>
                <FormDescription>
                  Indique se há restrições para instalação de baterias ou inversores
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
      
      {/* Transformer Constraints */}
      <FormField
        control={control}
        name="hasTransformerConstraints"
        render={({ field }) => (
          <FormItem>
            <div className="flex flex-row items-center justify-between">
              <div className="space-y-0.5">
                <FormLabel>Existem limitações no transformador/subestação?</FormLabel>
                <FormDescription>
                  Indique se há restrições na capacidade elétrica da instalação
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </div>
            
            {field.value && (
              <FormField
                control={control}
                name="transformerLimitKva"
                render={({ field }) => (
                  <div className="mt-3 pl-6 border-l-2 border-muted">
                    <FormLabel>Potência máxima disponível (kVA)</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-2 mt-1">
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        <Input
                          type="number"
                          placeholder="Ex: 300 kVA"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                        <span className="text-sm text-muted-foreground">kVA</span>
                      </div>
                    </FormControl>
                  </div>
                )}
              />
            )}
          </FormItem>
        )}
      />
      
      {/* Backup Requirements */}
      <div className="space-y-4">
        <Card className="border-dashed">
          <CardContent className="pt-6">
            <FormField
              control={control}
              name="needsBackup"
              render={({ field }) => (
                <FormItem className="space-y-4">
                  <div className="flex flex-row items-center justify-between">
                    <div className="space-y-0.5">
                      <FormLabel className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-blue-500" />
                        Precisa de backup para cargas críticas?
                      </FormLabel>
                      <FormDescription>
                        Isso permitirá que o sistema mantenha energia em caso de falha na rede
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </div>
                  
                  {field.value && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
                      <FormField
                        control={control}
                        name="criticalLoadKw"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cargas críticas</FormLabel>
                            <FormControl>
                              <div className="flex items-center gap-2">
                                <Zap className="h-4 w-4 text-yellow-500" />
                                <Input
                                  type="number"
                                  placeholder="Ex: 50 kW"
                                  {...field}
                                  onChange={(e) => field.onChange(Number(e.target.value))}
                                />
                                <span className="text-sm text-muted-foreground">kW</span>
                              </div>
                            </FormControl>
                            <FormDescription>
                              Potência das cargas essenciais que precisam ser mantidas
                            </FormDescription>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={control}
                        name="backupHours"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tempo de autonomia desejado</FormLabel>
                            <FormControl>
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-blue-500" />
                                <Input
                                  type="number"
                                  placeholder="Ex: 4 horas"
                                  {...field}
                                  onChange={(e) => field.onChange(Number(e.target.value))}
                                />
                                <span className="text-sm text-muted-foreground">horas</span>
                              </div>
                            </FormControl>
                            <FormDescription>
                              Por quanto tempo o backup precisa funcionar
                            </FormDescription>
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
