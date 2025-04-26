
import React, { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useBessSize } from '@/hooks/useBessSize';
import { useBessSimulation } from '@/hooks/useBessSimulation';
import { toast } from "sonner";
import { simuladorFormSchema, type SimuladorFormValues } from '@/schemas/simuladorSchema';
import { ProjectInfo } from '@/components/simulador/ProjectInfo';
import { BessSection } from '@/components/simulador/BessSection';
import { PvSection } from '@/components/simulador/PvSection';
import { TariffSection } from '@/components/simulador/TariffSection';
import { DieselSection } from '@/components/simulador/DieselSection';
import { FinancialSection } from '@/components/simulador/FinancialSection';
import { ControlStrategies } from '@/components/simulador/ControlStrategies';
import { Loader2, ChevronRight } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface SimulationResults {
  technical_summary?: {
    bess_cycles_estimated: number;
    annual_energy_throughput_mwh: number;
    annual_solar_curtailment_mwh: number;
  };
  financial_summary?: {
    annual_cost_base_case_r: number;
    annual_cost_with_bess_r: number;
    annual_gross_savings_r: number;
    npv_r: number;
    irr_percent: number;
    payback_discounted_years: number;
    cash_flow_r: number[];
  };
}

const SimuladorPage = () => {
  const { calculateBessSize } = useBessSize();
  const { simulateBess } = useBessSimulation();
  const [activeTab, setActiveTab] = useState("dados");
  const [isProcessing, setIsProcessing] = useState(false);
  const [simulationResults, setSimulationResults] = useState<SimulationResults>({});
  
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
      setIsProcessing(true);
      
      // Step 1: Calculate the BESS size
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
      
      // Step 2: Run the full simulation
      const results = await simulateBess(values);
      setSimulationResults(results);
      
      // Move to the analysis tab
      setActiveTab("analise");
      
      console.log("Simulation results:", results);
    } catch (error) {
      console.error('Error in simulation process:', error);
      toast.error("Erro no processo de simulação", {
        description: "Tente novamente ou ajuste os parâmetros"
      });
    } finally {
      setIsProcessing(false);
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
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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
                      <Button type="submit" disabled={isProcessing}>
                        {isProcessing ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processando
                          </>
                        ) : (
                          <>
                            Avançar para Análise
                            <ChevronRight className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
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
              <CardContent>
                {isProcessing ? (
                  <div className="py-12 space-y-6 text-center">
                    <Loader2 className="mx-auto h-12 w-12 animate-spin text-evolight-navy" />
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">Simulação em andamento</h3>
                      <p className="text-gray-500">Calculando parâmetros técnicos e financeiros...</p>
                      <Progress value={65} className="w-2/3 mx-auto" />
                    </div>
                  </div>
                ) : Object.keys(simulationResults).length > 0 ? (
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-lg font-bold mb-4">Resumo Técnico</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="bg-gray-50">
                          <CardContent className="p-4">
                            <p className="text-sm font-medium text-gray-500">Ciclos Estimados/Ano</p>
                            <p className="text-2xl font-bold">{simulationResults.technical_summary?.bess_cycles_estimated}</p>
                          </CardContent>
                        </Card>
                        <Card className="bg-gray-50">
                          <CardContent className="p-4">
                            <p className="text-sm font-medium text-gray-500">Energia Movimentada (MWh/ano)</p>
                            <p className="text-2xl font-bold">
                              {simulationResults.technical_summary?.annual_energy_throughput_mwh.toFixed(1)}
                            </p>
                          </CardContent>
                        </Card>
                        <Card className="bg-gray-50">
                          <CardContent className="p-4">
                            <p className="text-sm font-medium text-gray-500">Curtailment Solar (MWh/ano)</p>
                            <p className="text-2xl font-bold">
                              {simulationResults.technical_summary?.annual_solar_curtailment_mwh.toFixed(1)}
                            </p>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-bold mb-4">Resumo Financeiro</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <Card className="bg-gray-50">
                          <CardContent className="p-4">
                            <p className="text-sm font-medium text-gray-500">Valor Presente Líquido</p>
                            <p className="text-2xl font-bold text-emerald-600">
                              R$ {simulationResults.financial_summary?.npv_r.toLocaleString('pt-BR')}
                            </p>
                          </CardContent>
                        </Card>
                        <Card className="bg-gray-50">
                          <CardContent className="p-4">
                            <p className="text-sm font-medium text-gray-500">Taxa Interna de Retorno</p>
                            <p className="text-2xl font-bold text-emerald-600">
                              {simulationResults.financial_summary?.irr_percent.toFixed(1)}%
                            </p>
                          </CardContent>
                        </Card>
                        <Card className="bg-gray-50">
                          <CardContent className="p-4">
                            <p className="text-sm font-medium text-gray-500">Payback Descontado</p>
                            <p className="text-2xl font-bold">
                              {simulationResults.financial_summary?.payback_discounted_years.toFixed(1)} anos
                            </p>
                          </CardContent>
                        </Card>
                        <Card className="bg-gray-50">
                          <CardContent className="p-4">
                            <p className="text-sm font-medium text-gray-500">Custo Anual Base</p>
                            <p className="text-xl font-semibold">
                              R$ {simulationResults.financial_summary?.annual_cost_base_case_r.toLocaleString('pt-BR')}
                            </p>
                          </CardContent>
                        </Card>
                        <Card className="bg-gray-50">
                          <CardContent className="p-4">
                            <p className="text-sm font-medium text-gray-500">Custo Anual com BESS</p>
                            <p className="text-xl font-semibold">
                              R$ {simulationResults.financial_summary?.annual_cost_with_bess_r.toLocaleString('pt-BR')}
                            </p>
                          </CardContent>
                        </Card>
                        <Card className="bg-gray-50">
                          <CardContent className="p-4">
                            <p className="text-sm font-medium text-gray-500">Economia Anual Bruta</p>
                            <p className="text-xl font-semibold text-emerald-600">
                              R$ {simulationResults.financial_summary?.annual_gross_savings_r.toLocaleString('pt-BR')}
                            </p>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button onClick={() => setActiveTab("resultados")}>
                        Avançar para Resultados Detalhados
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-12">
                    <p>Para visualizar a análise, preencha os dados e clique em "Avançar para Análise" na tela anterior.</p>
                  </div>
                )}
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
              <CardContent>
                {Object.keys(simulationResults).length > 0 ? (
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-lg font-bold mb-4">Fluxo de Caixa</h3>
                      <div className="bg-white p-4 rounded-lg border">
                        <div className="grid grid-cols-6 md:grid-cols-11 gap-2 mb-2">
                          <div className="font-medium">Ano</div>
                          {simulationResults.financial_summary?.cash_flow_r.map((_, i) => (
                            <div key={i} className="font-medium text-center">{i}</div>
                          ))}
                        </div>
                        <div className="grid grid-cols-6 md:grid-cols-11 gap-2">
                          <div className="font-medium">Fluxo (R$)</div>
                          {simulationResults.financial_summary?.cash_flow_r.map((value, i) => (
                            <div 
                              key={i} 
                              className={`text-center ${value < 0 ? 'text-red-600' : 'text-emerald-600'}`}
                            >
                              {value.toLocaleString('pt-BR')}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-center">
                      <Button variant="outline" className="mr-2">
                        Exportar Relatório PDF
                      </Button>
                      <Button variant="outline">
                        Exportar Dados CSV
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-12">
                    <p>Para visualizar os resultados completos, conclua a análise na tela anterior.</p>
                  </div>
                )}
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
