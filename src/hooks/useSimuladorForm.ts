
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { simuladorFormSchema, type SimuladorFormValues } from '@/schemas/simuladorSchema';
import { toast } from 'sonner';

/**
 * Hook for managing the simulador form state and validation
 */
export function useSimuladorForm() {
  // Create an array with default values for hourly demand
  const defaultHourlyDemand = Array(24).fill(0).map((_, i) => {
    if (i >= 18 && i <= 21) return 100; // Horário de ponta (18h-21h)
    if (i >= 8 && i <= 17) return 80;  // Horário comercial (8h-17h)
    return 40; // Demais horários
  });
  
  const form = useForm<SimuladorFormValues>({
    resolver: zodResolver(simuladorFormSchema),
    defaultValues: {
      // Informações do Projeto
      projectName: "Novo Projeto",
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
      hourlyDemandKw: defaultHourlyDemand,
      
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
      pvProfileData: [], // Initialize the PV profile data
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
      bessUnitCost: 300000,
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
      peakShavingStartHour: 18,
      peakShavingEndHour: 21,
      peakShavingDurationHours: 3,
      criticalLoadKw: 0,
      backupDurationHours: 2,
    },
  });
  
  /**
   * Validates that the required fields for simulation are filled
   */
  const validateRequiredFields = (values: SimuladorFormValues): boolean => {
    // Verificações mínimas para garantir uma simulação válida
    if (values.loadEntryMethod === "average") {
      if (!values.avgPeakDemandKw || !values.avgOffpeakDemandKw) {
        toast.error("Dados incompletos", {
          description: "Preencha os valores de demanda média na ponta e fora de ponta"
        });
        return false;
      }
    } else if (values.loadEntryMethod === "hourly") {
      if (!values.hourlyDemandKw || !values.hourlyDemandKw.some(v => v > 0)) {
        toast.error("Dados incompletos", {
          description: "Preencha os valores de demanda horária"
        });
        return false;
      }
    }

    // Verificar se pelo menos uma estratégia de controle está habilitada
    if (!values.usePeakShaving && !values.useArbitrage && !values.useBackup && !values.usePvOptim) {
      toast.warning("Nenhuma estratégia de controle selecionada", {
        description: "Habilitando Peak Shaving como padrão"
      });
      
      // Habilitar peak shaving como estratégia padrão
      form.setValue("usePeakShaving", true);
    }

    return true;
  };

  return {
    form,
    validateRequiredFields
  };
}
