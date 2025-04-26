import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useBessSize } from '@/hooks/useBessSize';
import { toast } from "sonner";
import { simuladorFormSchema, type SimuladorFormValues } from '@/schemas/simuladorSchema';
import { ProjectInfo } from '@/components/simulador/ProjectInfo';
import { BessSection } from '@/components/simulador/BessSection';
import { PvSection } from '@/components/simulador/PvSection';
import { TariffSection } from '@/components/simulador/TariffSection';
import { DieselSection } from '@/components/simulador/DieselSection';
import { FinancialSection } from '@/components/simulador/FinancialSection';
import { ControlStrategies } from '@/components/simulador/ControlStrategies';

const SimuladorPage = () => {
  const { calculateBessSize } = useBessSize();
  const form = useForm<SimuladorFormValues>({
    resolver: zodResolver(simuladorFormSchema),
    defaultValues: {
      projectName: "",
      installationType: "industrial",
      bessCapacityKwh: 215,
      bessPowerKw: 108,
      bessEfficiency: 90,
      bessMaxDod: 85,
      bessInitialSoc: 50,
      hasPv: false,
      pvPowerKwp: 0,
      pvPolicy: "inject",
      tePeak: 0.80,
      teOffpeak: 0.40,
      tusdPeakKwh: 0.20,
      tusdOffpeakKwh: 0.10,
      tusdPeakKw: 50.0,
      tusdOffpeakKw: 10.0,
      peakStartHour: 18,
      peakEndHour: 21,
      hasDiesel: false,
      dieselPowerKw: 0,
      dieselConsumption: 0.3,
      dieselFuelCost: 6.50,
      discountRate: 10,
      horizonYears: 10,
      businessModel: "turnkey",
      capexCost: 0,
      annualOmCost: 0,
      setupCost: 0,
      annualServiceCost: 0,
      usePeakShaving: true,
      useArbitrage: false,
      useBackup: false,
      usePvOptim: false,
      peakShavingTarget: 0,
    },
  });
  
  const onSubmit = async (values: SimuladorFormValues) => {
    try {
      const load_profile = [50, 45, 40, 40, 45, 55, 70, 80, 90, 100, 110, 115, 110, 105, 100, 100, 110, 150, 160, 140, 120, 100, 80, 60];
      
      const sizingResult = await calculateBessSize({
        load_profile,
        pv_profile: values.hasPv ? [0, 0, 0, 0, 0, 5, 20, 40, 60, 70, 75, 70, 60, 40, 20, 5, 0, 0, 0, 0, 0, 0, 0, 0].map(v => v *  (values.pvPowerKwp / 75)) : undefined,
        tariff_structure: {
          peak_start_hour: values.peakStartHour,
          peak_end_hour: values.peakEndHour
        },
        sizing_params: {
          backup_required: values.useBackup,
          peak_shaving_required: values.usePeakShaving,
          peak_shaving_target_kw: values.peakShavingTarget,
          arbitrage_required: values.useArbitrage,
          pv_optim_required: values.usePvOptim,
          grid_zero: values.pvPolicy === 'grid_zero'
        },
        bess_technical_params: {
          discharge_eff: Math.sqrt(values.bessEfficiency / 100),
          charge_eff: Math.sqrt(values.bessEfficiency / 100)
        },
        simulation_params: {
          interval_minutes: 60
        }
      });

      form.setValue('bessPowerKw', sizingResult.calculated_power_kw);
      form.setValue('bessCapacityKwh', sizingResult.calculated_energy_kwh);
      
      toast.success("BESS dimensionado com sucesso!", {
        description: `Potência: ${sizingResult.calculated_power_kw} kW, Capacidade: ${sizingResult.calculated_energy_kwh} kWh`
      });
      
      console.log(values);
    } catch (error) {
      console.error('Error calculating BESS size:', error);
      toast.error("Erro ao dimensionar BESS", {
        description: "Tente novamente ou ajuste os parâmetros"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 container py-6 px-4 md:py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-evolight-navy mb-2">Simulador BESS</h1>
          <p className="text-gray-600">Configure e execute simulações de sistemas de armazenamento de energia por bateria.</p>
        </div>
        
        <Tabs defaultValue="dados" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="dados">Entrada de Dados</TabsTrigger>
            <TabsTrigger value="analise">Análise & Dimensionamento</TabsTrigger>
            <TabsTrigger value="resultados">Resultados & Relatórios</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dados">
            <Card>
              <CardHeader>
                <CardTitle>Entrada de Dados</CardTitle>
                <CardDescription>
                  Forneça os dados necessários para simular seu sistema BESS.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <ProjectInfo form={form} />
                    
                    <Separator />
                    
                    <BessSection form={form} />
                    
                    <Separator />
                    
                    <PvSection form={form} />
                    
                    <Separator />
                    
                    <TariffSection form={form} />
                    
                    <Separator />
                    
                    <DieselSection form={form} />
                    
                    <Separator />
                    
                    <FinancialSection form={form} />
                    
                    <Separator />
                    
                    <ControlStrategies form={form} />
                    
                    <div className="flex justify-end pt-4">
                      <Button type="submit">Avançar para Análise</Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="analise">
            <Card>
              <CardHeader>
                <CardTitle>Análise & Dimensionamento</CardTitle>
                <CardDescription>
                  Processamento e análise técnico-financeira baseada nos dados fornecidos.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-center text-gray-500 py-12">
                  Funcionalidade em desenvolvimento. Esta seção exibirá o progresso do processamento dos dados, 
                  dimensionamento do sistema e simulação temporal da operação.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="resultados">
            <Card>
              <CardHeader>
                <CardTitle>Resultados & Relatórios</CardTitle>
                <CardDescription>
                  Visualize os resultados da simulação e gere relatórios.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-center text-gray-500 py-12">
                  Funcionalidade em desenvolvimento. Esta seção exibirá um dashboard resumo, 
                  gráficos interativos e permitirá a exportação do relatório detalhado.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      
      <footer className="bg-white py-4 border-t border-gray-200">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Evolight Energia Inovadora. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
};

export default SimuladorPage;
