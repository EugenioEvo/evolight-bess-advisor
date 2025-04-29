import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { DieselBessChart } from './DieselBessChart';
import { DieselBessKPI } from './DieselBessKPI';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { computeDispatch } from './computeDispatch';
import { useToast } from '@/hooks/use-toast';

// Define the schema with non-optional values to match the computeDispatch expectations
const dieselBessSchema = z.object({
  chargePower: z.number().min(1).default(300),
  dischargePower: z.number().min(1).default(700),
  bessEnergy: z.number().min(1).default(2200),
  bessEff: z.number().min(0.1).max(1).default(0.913),
  soc0: z.number().min(0).max(1).default(0.2),
  socMin: z.number().min(0).max(1).default(0.1),
  chargeWindow: z.tuple([z.number(), z.number()]).default([0, 6]),
  dischargeWindow: z.tuple([z.number(), z.number()]).default([18, 21]),
  dieselCost: z.number().min(0).default(5.5),
  dieselYield: z.number().min(0.1).default(3.6),
  gridCostFora: z.number().min(0).default(0.6),
  gridCostPonta: z.number().min(0).default(2.5),
  loadProfile: z.array(z.number()).default([])
});

type DieselBessFormValues = z.infer<typeof dieselBessSchema>;

export function DieselBessAnalysis() {
  const [chartData, setChartData] = useState<any[]>([]);
  const [kpi, setKPI] = useState<any>(null);
  const { toast } = useToast();

  const form = useForm<DieselBessFormValues>({
    resolver: zodResolver(dieselBessSchema),
    defaultValues: {
      chargePower: 300,
      dischargePower: 700,
      bessEnergy: 2200,
      bessEff: 0.913,
      soc0: 0.2,
      socMin: 0.1,
      chargeWindow: [0, 6],
      dischargeWindow: [18, 21],
      dieselCost: 5.5,
      dieselYield: 3.6,
      gridCostFora: 0.6,
      gridCostPonta: 2.5,
      loadProfile: Array(24).fill(100) // Default flat profile
    },
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.trim().split(/[\r\n,]+/);
        
        // Convert all values to numbers and take only 24 values
        const profile = lines
          .map(line => parseFloat(line.trim()))
          .filter(val => !isNaN(val))
          .slice(0, 24);
          
        // If we have fewer than 24 values, pad with the last value
        while (profile.length < 24) {
          profile.push(profile[profile.length - 1] || 100);
        }
        
        form.setValue('loadProfile', profile);
        toast({
          title: "Perfil carregado",
          description: `${profile.length} valores importados com sucesso.`,
        });
      } catch (err) {
        toast({
          title: "Erro ao carregar arquivo",
          description: "O formato do arquivo não é compatível.",
          variant: "destructive"
        });
      }
    };
    reader.readAsText(file);
  };

  const onSubmit = (values: DieselBessFormValues) => {
    // Ensure all required values are present by creating a new object with all required properties
    const computeParams = {
      chargePower: values.chargePower,
      dischargePower: values.dischargePower,
      bessEnergy: values.bessEnergy,
      bessEff: values.bessEff,
      soc0: values.soc0,
      socMin: values.socMin,
      chargeWindow: values.chargeWindow as [number, number],
      dischargeWindow: values.dischargeWindow as [number, number],
      dieselCost: values.dieselCost,
      dieselYield: values.dieselYield,
      gridCostFora: values.gridCostFora,
      gridCostPonta: values.gridCostPonta
    };
    
    const result = computeDispatch({
      profile: values.loadProfile,
      params: computeParams
    });
    
    setChartData(result.chartData);
    setKPI(result.kpi);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Análise "Diesel Out – BESS In"</CardTitle>
        <CardDescription>
          Compare a substituição do gerador diesel por um sistema BESS para gerenciamento de ponta
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Perfil de Carga Upload */}
              <div className="space-y-2">
                <FormLabel>Perfil de Carga (CSV)</FormLabel>
                <Input 
                  type="file" 
                  accept=".csv,.txt" 
                  onChange={handleFileUpload}
                />
                <p className="text-xs text-muted-foreground">Arquivo com 24 valores (kW), um por hora</p>
              </div>
              
              {/* Potência de carga BESS */}
              <FormField
                control={form.control}
                name="chargePower"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Potência de carga BESS (kW)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              {/* Potência de descarga BESS */}
              <FormField
                control={form.control}
                name="dischargePower"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Potência de descarga BESS (kW)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              {/* Capacidade BESS */}
              <FormField
                control={form.control}
                name="bessEnergy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Capacidade BESS (kWh)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              {/* Eficiência ida-volta */}
              <FormField
                control={form.control}
                name="bessEff"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Eficiência ida-volta ({(field.value * 100).toFixed(1)}%)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0.1"
                        max="1"
                        step="0.01"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              {/* SoC inicial */}
              <FormField
                control={form.control}
                name="soc0"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SoC inicial ({(field.value * 100).toFixed(0)}%)</FormLabel>
                    <FormControl>
                      <Slider
                        min={0}
                        max={1}
                        step={0.01}
                        value={[field.value]}
                        onValueChange={(value) => field.onChange(value[0])}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              {/* SoC mínimo */}
              <FormField
                control={form.control}
                name="socMin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SoC mínimo ({(field.value * 100).toFixed(0)}%)</FormLabel>
                    <FormControl>
                      <Slider
                        min={0}
                        max={1}
                        step={0.01}
                        value={[field.value]}
                        onValueChange={(value) => field.onChange(value[0])}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              {/* Janela de carga (fixed 0-6) */}
              <FormItem>
                <FormLabel>Janela de carga (h)</FormLabel>
                <p className="text-sm font-medium">0:00 - 6:00</p>
              </FormItem>
              
              {/* Janela de descarga (fixed 18-21) */}
              <FormItem>
                <FormLabel>Janela de descarga (h)</FormLabel>
                <p className="text-sm font-medium">18:00 - 21:00</p>
              </FormItem>
              
              {/* Custo Diesel */}
              <FormField
                control={form.control}
                name="dieselCost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Custo Diesel (R$/l)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              {/* Rendimento Diesel */}
              <FormField
                control={form.control}
                name="dieselYield"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rendimento Diesel (kWh/l)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.1"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              {/* Custo Rede (fora-ponta) */}
              <FormField
                control={form.control}
                name="gridCostFora"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Custo Rede (fora-ponta)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              {/* Custo Rede (ponta) */}
              <FormField
                control={form.control}
                name="gridCostPonta"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Custo Rede (ponta)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit">Calcular</Button>
            </div>
            
            {chartData.length > 0 && (
              <div className="space-y-6 pt-4">
                <DieselBessChart data={chartData} />
                <DieselBessKPI kpi={kpi} />
              </div>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
