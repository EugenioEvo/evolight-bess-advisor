import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { SimuladorFormValues } from "@/schemas/simuladorSchema";
import { ChartContainer } from "@/components/ui/chart";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, BarChart, Bar, Legend } from "recharts";

interface InteractiveChartsProps {
  results: {
    calculatedPowerKw: number;
    calculatedEnergyKwh: number;
    paybackYears?: number;
    annualSavings?: number;
  };
  formValues: SimuladorFormValues;
}

export function InteractiveCharts({ results, formValues }: InteractiveChartsProps) {
  // Generate mock time series data for demo
  const generatePowerData = () => {
    const hourlyData = [];
    const peakDemand = formValues.avgPeakDemandKw;
    const maxPeakDemand = formValues.maxPeakDemandKw;
    const pvPower = formValues.hasPv ? formValues.pvPowerKwp : 0;
    const batteryCap = results.calculatedEnergyKwh;
    const batteryPower = results.calculatedPowerKw;
    
    for (let hour = 0; hour < 24; hour++) {
      // Create synthetic load profile
      const baseLoad = peakDemand * (0.7 + 0.3 * Math.sin(hour / 24 * Math.PI));
      let loadKw = hour >= 18 && hour <= 21 ? maxPeakDemand : baseLoad;
      
      // Create synthetic PV profile (bell curve during day)
      let pvKw = 0;
      if (hour >= 6 && hour <= 18 && pvPower > 0) {
        pvKw = pvPower * Math.sin((hour - 6) / 12 * Math.PI);
      }
      
      // Create synthetic BESS profile (discharge during peak)
      let bessKw = 0;
      if (hour >= formValues.peakStartHour && hour <= formValues.peakEndHour && formValues.usePeakShaving) {
        bessKw = formValues.peakShavingMethod === 'percentage' 
          ? maxPeakDemand * formValues.peakShavingPercentage / 100
          : formValues.peakShavingTarget;
        if (bessKw > batteryPower) bessKw = batteryPower;
      } else if (hour >= 1 && hour <= 5 && formValues.useArbitrage) {
        // Charging during off-peak
        bessKw = -batteryPower * 0.8;
      }
      
      // Calculate net grid consumption
      const netGridKw = loadKw - pvKw - bessKw;
      
      hourlyData.push({
        hour: `${hour}:00`,
        loadKw: parseFloat(loadKw.toFixed(1)),
        pvKw: parseFloat(pvKw.toFixed(1)),
        bessKw: parseFloat(bessKw.toFixed(1)),
        gridKw: parseFloat(netGridKw.toFixed(1)),
      });
    }
    
    return hourlyData;
  };
  
  // Generate mock SoC data
  const generateSoCData = () => {
    const hourlyData = [];
    let currentSoc = formValues.bessInitialSoc;
    
    for (let hour = 0; hour < 24; hour++) {
      // SoC slowly decreases during peak hours (usage)
      if (hour >= formValues.peakStartHour && hour <= formValues.peakEndHour && formValues.usePeakShaving) {
        currentSoc -= 10;
      } 
      // SoC increases during off-peak hours (charging)
      else if (hour >= 1 && hour <= 5 && formValues.useArbitrage) {
        currentSoc += 8;
      } 
      // Minimal self-discharge
      else {
        currentSoc -= 0.2;
      }
      
      // Keep within limits
      currentSoc = Math.max(formValues.bessMaxDod, Math.min(100, currentSoc));
      
      hourlyData.push({
        hour: `${hour}:00`,
        soc: parseFloat(currentSoc.toFixed(1))
      });
    }
    
    return hourlyData;
  };
  
  // Generate mock cash flow data
  const generateCashFlowData = () => {
    const costPerKwh = formValues.bessInstallationCost || 1500;
    const totalInvestment = results.calculatedEnergyKwh * costPerKwh;
    const annualSavings = results.annualSavings || 0;
    
    const yearlyData = [];
    let cumulativeCashFlow = -totalInvestment;
    
    for (let year = 0; year <= formValues.horizonYears; year++) {
      if (year === 0) {
        yearlyData.push({
          year,
          cashFlow: -totalInvestment,
          cumulative: cumulativeCashFlow
        });
        continue;
      }
      
      // Account for annual adjustments
      const yearlyInflationFactor = Math.pow(1 + formValues.annualTariffAdjustment/100, year-1);
      const yearlyCashFlow = annualSavings * yearlyInflationFactor;
      cumulativeCashFlow += yearlyCashFlow;
      
      yearlyData.push({
        year,
        cashFlow: parseFloat(yearlyCashFlow.toFixed(2)),
        cumulative: parseFloat(cumulativeCashFlow.toFixed(2))
      });
    }
    
    return yearlyData;
  };
  
  const powerData = generatePowerData();
  const socData = generateSoCData();
  const cashFlowData = generateCashFlowData();

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Gráficos Interativos</h3>
      
      <Tabs defaultValue="power">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="power">Perfil de Potência</TabsTrigger>
          <TabsTrigger value="soc">Estado de Carga</TabsTrigger>
          <TabsTrigger value="cashflow">Fluxo de Caixa</TabsTrigger>
        </TabsList>
        
        <TabsContent value="power">
          <Card className="h-[400px]">
            <CardContent className="p-4 h-full">
              <ChartContainer
                config={{
                  load: { theme: { light: "#333", dark: "#ccc" } },
                  pv: { theme: { light: "#f97316", dark: "#f97316" } },
                  bess: { theme: { light: "#8b5cf6", dark: "#c4b5fd" } },
                  grid: { theme: { light: "#0ea5e9", dark: "#7dd3fc" } },
                }}
              >
                <LineChart data={powerData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis label={{ value: 'kW', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="loadKw" name="Carga" stroke="var(--color-load)" strokeWidth={2} dot={false} />
                  {formValues.hasPv && <Line type="monotone" dataKey="pvKw" name="PV" stroke="var(--color-pv)" strokeWidth={2} dot={false} />}
                  <Line type="monotone" dataKey="bessKw" name="BESS" stroke="var(--color-bess)" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="gridKw" name="Rede" stroke="var(--color-grid)" strokeWidth={2} dot={false} />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="soc">
          <Card className="h-[400px]">
            <CardContent className="p-4 h-full">
              <ChartContainer
                config={{
                  soc: { theme: { light: "#8b5cf6", dark: "#c4b5fd" } },
                }}
              >
                <LineChart data={socData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis 
                    domain={[0, 100]}
                    label={{ value: 'SoC (%)', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip />
                  <Line type="monotone" dataKey="soc" name="Estado de Carga" stroke="var(--color-soc)" strokeWidth={2} dot={false} />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="cashflow">
          <Card className="h-[400px]">
            <CardContent className="p-4 h-full">
              <ChartContainer
                config={{
                  cashFlow: { theme: { light: "#22c55e", dark: "#86efac" } },
                  cumulative: { theme: { light: "#0ea5e9", dark: "#7dd3fc" } },
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={cashFlowData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip formatter={(value) => `R$ ${Number(value).toLocaleString('pt-BR')}`} />
                    <Legend />
                    <Bar dataKey="cashFlow" name="Fluxo Anual" fill="var(--color-cashFlow)" />
                    <Line type="monotone" dataKey="cumulative" name="Acumulado" stroke="var(--color-cumulative)" strokeWidth={2} yAxisId={0} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
