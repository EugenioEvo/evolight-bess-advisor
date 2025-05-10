
import React, { useEffect } from 'react';
import { useWizard } from '../context/WizardContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Battery, Download, BarChart3, ListChecks, Bolt, Sparkles, Clock, DollarSign } from 'lucide-react';
import { EnergyDispatchVisualization } from '@/components/simulador/results/charts/dispatch/EnergyDispatchVisualization';
import { useFormContext } from 'react-hook-form';

export function ResultsStep() {
  const { simulationResults, runSimulation, isLoading } = useWizard();
  const { watch } = useFormContext();
  
  // Get peak hours from form data
  const peakStartHour = watch('peakStartHour') || 18;
  const peakEndHour = watch('peakEndHour') || 21;
  
  // Ensure we have results
  useEffect(() => {
    if (!simulationResults && !isLoading) {
      runSimulation();
    }
  }, [simulationResults, runSimulation, isLoading]);
  
  // Use these values if we have results, otherwise use placeholders
  const bessPowerKw = simulationResults?.bessPowerKw || 108;
  const bessEnergyKwh = simulationResults?.bessEnergyKwh || 215;
  const modules = simulationResults?.modules || 1;
  const annualSavings = simulationResults?.annualSavingsR$ || 50000;
  const paybackYears = 5; // This would be calculated based on investment cost
  const dispatchData = simulationResults?.chartData || [];
  
  // Convert data for the chart component
  const processedDispatchData = dispatchData.map((item: any) => ({
    hour: item.hour,
    load: item.load,
    pv: item.pv || 0,
    diesel: item.diesel || 0, 
    grid: item.grid || 0,
    charge: item.charge || 0,
    discharge: Math.abs(item.negDis) || 0, // Convert negative values to positive
    soc: item.soc || 50,
    dieselRef: item.dieselRef || 0
  }));
  
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold mb-1">Resultado da Simulação</h2>
          <p className="text-muted-foreground">
            Solução dimensionada com base nos parâmetros fornecidos
          </p>
        </div>
        <Button variant="outline" className="flex items-center gap-2" onClick={() => runSimulation()}>
          <Sparkles className="h-4 w-4" />
          Recalcular
        </Button>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Módulos BESS</span>
                <div className="text-2xl font-bold">{modules}</div>
                <span className="text-xs text-muted-foreground">Huawei LUNA2000</span>
              </div>
              <div className="p-3 rounded-full bg-primary/10">
                <Battery className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Potência</span>
                <div className="text-2xl font-bold">{bessPowerKw} kW</div>
                <span className="text-xs text-muted-foreground">Máxima descarga</span>
              </div>
              <div className="p-3 rounded-full bg-orange-100">
                <Bolt className="h-6 w-6 text-orange-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Capacidade</span>
                <div className="text-2xl font-bold">{bessEnergyKwh} kWh</div>
                <span className="text-xs text-muted-foreground">Energia armazenada</span>
              </div>
              <div className="p-3 rounded-full bg-blue-100">
                <Clock className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Economia Anual</span>
                <div className="text-2xl font-bold">R$ {Math.round(annualSavings).toLocaleString()}</div>
                <span className="text-xs text-muted-foreground">Payback em {paybackYears} anos</span>
              </div>
              <div className="p-3 rounded-full bg-green-100">
                <DollarSign className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Detailed Analysis Tabs */}
      <Tabs defaultValue="dispatch">
        <TabsList>
          <TabsTrigger value="dispatch" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span>Despacho de Energia</span>
          </TabsTrigger>
          <TabsTrigger value="financial" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            <span>Análise Financeira</span>
          </TabsTrigger>
          <TabsTrigger value="technical" className="flex items-center gap-2">
            <ListChecks className="h-4 w-4" />
            <span>Detalhes Técnicos</span>
          </TabsTrigger>
        </TabsList>
        
        <div className="mt-6">
          <TabsContent value="dispatch" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Despacho de Energia (24h)</CardTitle>
                <CardDescription>
                  Visualize como o sistema BESS irá gerenciar energia ao longo do dia
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[500px]">
                <EnergyDispatchVisualization
                  data={processedDispatchData}
                  highlightPeakHours={true}
                  peakStartHour={peakStartHour}
                  peakEndHour={peakEndHour}
                  title=""
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="financial" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Análise Financeira</CardTitle>
                <CardDescription>
                  Detalhamento das economias e retorno do investimento
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* This would be replaced with a financial chart component */}
                  <div className="h-64 bg-muted/40 rounded-lg flex items-center justify-center">
                    <p className="text-muted-foreground">Gráfico de fluxo de caixa (a ser implementado)</p>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Economia Anual</p>
                      <p className="text-xl font-semibold">R$ {Math.round(annualSavings).toLocaleString()}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Payback</p>
                      <p className="text-xl font-semibold">{paybackYears} anos</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">ROI</p>
                      <p className="text-xl font-semibold">15%</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Economia 10 anos</p>
                      <p className="text-xl font-semibold">R$ {Math.round(annualSavings * 10).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="technical" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Especificações Técnicas</CardTitle>
                <CardDescription>
                  Detalhes do dimensionamento e parâmetros do sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium mb-2">Módulos BESS</h4>
                        <div className="flex items-center gap-2">
                          <Battery className="h-5 w-5 text-primary" />
                          <span className="font-medium">{modules}x Huawei LUNA2000-215</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Cada módulo: 108 kW / 215 kWh
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium mb-2">Estratégias Ativas</h4>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline" className="bg-primary/10">Peak Shaving</Badge>
                          <Badge variant="outline" className="bg-blue-100">Arbitragem</Badge>
                          <Badge variant="outline" className="bg-yellow-100">Otimização PV</Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium mb-2">Parâmetros Técnicos</h4>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Eficiência de carga</p>
                            <p className="font-medium">95%</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Eficiência de descarga</p>
                            <p className="font-medium">95%</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">DoD máxima</p>
                            <p className="font-medium">90%</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Vida útil</p>
                            <p className="font-medium">10 anos</p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium mb-2">Dimensionamento</h4>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Potência total</p>
                            <p className="font-medium">{bessPowerKw} kW</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Energia total</p>
                            <p className="font-medium">{bessEnergyKwh} kWh</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
      
      {/* Actions */}
      <div className="flex justify-center gap-4">
        <Button variant="outline" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Baixar PDF
        </Button>
      </div>
    </div>
  );
}
