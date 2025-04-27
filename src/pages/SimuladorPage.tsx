
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
      // Informações do Projeto
      projectName: "",
      installationType: "industrial",
      location: "",
      
      // Perfil de Consumo
      loadEntryMethod: "average",
      avgPeakDemandKw: 100,
      maxPeakDemandKw: 150,
      avgDailyConsumptionKwh: 2000,
      avgMonthlyConsumptionKwh: 60000,
      
      // Parâmetros BESS
      bessCapacityKwh: 215,
      bessPowerKw: 108,
      bessEfficiency: 90,
      bessMaxDod: 85,
      bessInitialSoc: 50,
      bessTechnology: "lfp",
      bessLifetime: 10,
      bessAnnualDegradation: 1.0,
      bessDailySelfdischarge: 0.1,
      
      // Sistema Solar
      hasPv: false,
      pvDataEntryMethod: "power",
      pvPowerKwp: 0,
      pvAnnualGeneration: 0,
      pvPolicy: "inject",
      
      // Estrutura Tarifária
      tarifaryGroup: "groupA",
      modalityA: "blue",
      tePeak: 0.80,
      teOffpeak: 0.40,
      teIntermediate: 0,
      tusdPeakKwh: 0.20,
      tusdOffpeakKwh: 0.10,
      tusdIntermediateKwh: 0,
      tusdPeakKw: 50.0,
      tusdOffpeakKw: 10.0,
      tariffB: 0,
      flagCost: 0,
      peakStartHour: 18,
      peakEndHour: 21,
      contractedPeakDemandKw: 120,
      contractedOffpeakDemandKw: 150,
      
      // Gerador Diesel
      hasDiesel: false,
      dieselPowerKw: 0,
      dieselConsumption: 0.3,
      dieselFuelCost: 6.50,
      dieselOmCost: 0,
      
      // Parâmetros Financeiros
      discountRate: 10,
      horizonYears: 10,
      businessModel: "turnkey",
      capexCost: 0,
      bessInstallationCost: 1500,
      annualOmCost: 2,
      setupCost: 0,
      annualServiceCost: 0,
      incentivesValue: 0,
      annualLoadGrowth: 0,
      annualTariffAdjustment: 5,
      
      // Upgrade de Rede
      avoidsGridUpgrade: false,
      avoidedUpgradeCost: 0,
      upgradeForeseeenYear: 0,
      
      // Impostos
      considerTaxes: false,
      taxRate: 34,
      
      // Estratégias de Controle
      usePeakShaving: true,
      useArbitrage: false,
      useBackup: false,
      usePvOptim: false,
      peakShavingMethod: "percentage",
      peakShavingTarget: 0,
      peakShavingPercentage: 30,
      criticalLoadKw: 0,
      backupDurationHours: 2,
    },
  });
  
  const onSubmit = async (values: SimuladorFormValues) => {
    try {
      console.log("Submitting form values:", values);
      
      // Create a basic load profile based on average demand
      const baseLoad = values.avgPeakDemandKw > 0 ? values.avgPeakDemandKw : 50;
      const maxLoad = values.maxPeakDemandKw > 0 ? values.maxPeakDemandKw : baseLoad * 2;
      
      // Create a synthetic load profile with lower values during night, higher during day, and peak at evening
      const load_profile = [
        baseLoad * 0.7, baseLoad * 0.6, baseLoad * 0.5, baseLoad * 0.5, baseLoad * 0.6, baseLoad * 0.8, 
        baseLoad * 1.0, baseLoad * 1.2, baseLoad * 1.4, baseLoad * 1.6, baseLoad * 1.8, baseLoad * 1.9,
        baseLoad * 1.8, baseLoad * 1.7, baseLoad * 1.6, baseLoad * 1.6, baseLoad * 1.8, maxLoad * 0.9,
        maxLoad, maxLoad * 0.9, maxLoad * 0.7, baseLoad * 1.4, baseLoad * 1.0, baseLoad * 0.8
      ];
      
      // Calculate PV profile if applicable
      const pv_profile = values.hasPv && values.pvPowerKwp > 0 
        ? [0, 0, 0, 0, 0, 0.1, 0.3, 0.5, 0.7, 0.9, 1.0, 0.9, 0.8, 0.6, 0.4, 0.2, 0, 0, 0, 0, 0, 0, 0, 0]
            .map(v => v * values.pvPowerKwp) 
        : undefined;

      // Define peak shaving target or reduction
      let peakShavingTarget = 0;
      let peakReductionKw = 0;
      
      if (values.usePeakShaving) {
        if (values.peakShavingMethod === 'percentage') {
          peakReductionKw = maxLoad * (values.peakShavingPercentage / 100);
        } else if (values.peakShavingMethod === 'reduction') {
          peakReductionKw = values.peakShavingTarget;
        } else if (values.peakShavingMethod === 'target') {
          peakShavingTarget = values.peakShavingTarget;
        }
      }
      
      // Define critical load for backup if applicable
      let criticalLoadKw = undefined;
      let backupDurationH = undefined;
      
      if (values.useBackup) {
        criticalLoadKw = values.criticalLoadKw > 0 ? values.criticalLoadKw : baseLoad * 0.5;
        backupDurationH = values.backupDurationHours > 0 ? values.backupDurationHours : 2;
      }
      
      console.log("Sending to Edge Function:", {
        load_profile,
        pv_profile,
        tariff_structure: {
          peak_start_hour: values.peakStartHour,
          peak_end_hour: values.peakEndHour
        },
        sizing_params: {
          backup_required: values.useBackup,
          critical_load_kw: criticalLoadKw,
          backup_duration_h: backupDurationH,
          peak_shaving_required: values.usePeakShaving,
          peak_shaving_target_kw: peakShavingTarget > 0 ? peakShavingTarget : undefined,
          peak_reduction_kw: peakReductionKw > 0 ? peakReductionKw : undefined,
          arbitrage_required: values.useArbitrage,
          pv_optim_required: values.usePvOptim,
          grid_zero: values.pvPolicy === 'grid_zero',
          sizing_buffer_factor: 1.1
        },
        bess_technical_params: {
          discharge_eff: Math.sqrt(values.bessEfficiency / 100),
          charge_eff: Math.sqrt(values.bessEfficiency / 100)
        },
        simulation_params: {
          interval_minutes: 60
        }
      });

      const sizingResult = await calculateBessSize({
        load_profile,
        pv_profile,
        tariff_structure: {
          peak_start_hour: values.peakStartHour,
          peak_end_hour: values.peakEndHour
        },
        sizing_params: {
          backup_required: values.useBackup,
          critical_load_kw: criticalLoadKw,
          backup_duration_h: backupDurationH,
          peak_shaving_required: values.usePeakShaving,
          peak_shaving_target_kw: peakShavingTarget > 0 ? peakShavingTarget : undefined,
          peak_reduction_kw: peakReductionKw > 0 ? peakReductionKw : undefined,
          arbitrage_required: values.useArbitrage,
          pv_optim_required: values.usePvOptim,
          grid_zero: values.pvPolicy === 'grid_zero',
          sizing_buffer_factor: 1.1
        },
        bess_technical_params: {
          discharge_eff: Math.sqrt(values.bessEfficiency / 100),
          charge_eff: Math.sqrt(values.bessEfficiency / 100)
        },
        simulation_params: {
          interval_minutes: 60
        }
      });

      console.log("Received sizing result:", sizingResult);
      
      form.setValue('bessPowerKw', sizingResult.calculated_power_kw);
      form.setValue('bessCapacityKwh', sizingResult.calculated_energy_kwh);
      
      toast.success("BESS dimensionado com sucesso!", {
        description: `Potência: ${sizingResult.calculated_power_kw} kW, Capacidade: ${sizingResult.calculated_energy_kwh} kWh`
      });
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
                      <Button type="submit">Dimensionar e Simular</Button>
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
