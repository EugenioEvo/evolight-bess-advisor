
import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Header from '@/components/Header';
import { simuladorFormSchema, type SimuladorFormValues } from '@/schemas/simuladorSchema';
import { HeaderSection } from '@/components/simulador/HeaderSection';
import { FooterSection } from '@/components/simulador/FooterSection';
import { SimuladorTabContent } from '@/components/simulador/tabs/SimuladorTabContent';
import { useSimulation } from '@/components/simulador/hooks/useSimulation';
import { useState } from 'react';

const SimuladorPage = () => {
  const [activeTab, setActiveTab] = useState("dados");
  const { simulationResults, runSimulation } = useSimulation();
  
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
      avgOffpeakDemandKw: 80,
      maxPeakDemandKw: 150,
      maxOffpeakDemandKw: 120,
      avgDailyPeakConsumptionKwh: 400,
      avgDailyOffpeakConsumptionKwh: 1600,
      avgMonthlyPeakConsumptionKwh: 12000,
      avgMonthlyOffpeakConsumptionKwh: 48000,
      
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
      peakShavingStartHour: 18,  // Valor padrão igual ao peakStartHour
      peakShavingEndHour: 21,    // Valor padrão igual ao peakEndHour
      peakShavingDurationHours: 3, // Duração padrão = 3 horas
      criticalLoadKw: 0,
      backupDurationHours: 2,
    },
  });
  
  const onSubmit = async (values: SimuladorFormValues) => {
    const result = await runSimulation(values);
    if (result.success) {
      form.setValue('bessPowerKw', result.results.calculatedPowerKw);
      form.setValue('bessCapacityKwh', result.results.calculatedEnergyKwh);
      setActiveTab("analise");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 container py-6 px-4 md:py-10">
        <HeaderSection />
        
        <SimuladorTabContent
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          form={form}
          onSubmit={onSubmit}
          simulationResults={simulationResults}
        />
      </main>
      
      <FooterSection />
    </div>
  );
};

export default SimuladorPage;
