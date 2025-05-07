
import { useState } from 'react';
import { SimuladorFormValues } from '@/schemas/simuladorSchema';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface BessDispatchPoint {
  hour: number;
  load: number;
  pv: number;
  diesel: number;
  charge: number;
  discharge: number;
  grid: number;
  soc: number;
  dieselRef?: number;
}

export interface BessSimulationResult {
  modules: number;
  bessPowerKw: number;
  bessEnergyKwh: number;
  kpiAnnual: number;
  dispatch24h: BessDispatchPoint[];
  needPower: number;
  needEnergy: number;
  psPower: number;
  arbPower: number;
  psEnergy: number;
  arbEnergy: number;
  isSuccess: boolean;
  error?: string;
}

export function useBessSimulation() {
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState<BessSimulationResult | null>(null);

  const runSimulation = async (formValues: SimuladorFormValues): Promise<BessSimulationResult> => {
    try {
      setIsSimulating(true);
      
      // Build the simulation input from form values
      const simulationInput = mapFormValuesToSimInput(formValues);
      
      console.log("Calling BESS simulation with input:", simulationInput);
      
      // Call the edge function
      const { data, error } = await supabase.functions.invoke('simulate-bess', {
        body: simulationInput,
      });
      
      if (error) {
        console.error('Error calling BESS simulation:', error);
        toast.error('Erro na simulação', {
          description: 'Não foi possível executar a simulação. Usando valores padrão.'
        });
        
        // Return default values on error
        const defaultResult: BessSimulationResult = {
          modules: 1,
          bessPowerKw: 108,
          bessEnergyKwh: 215,
          kpiAnnual: 50000,
          dispatch24h: [],
          needPower: 0,
          needEnergy: 0,
          psPower: 0,
          arbPower: 0,
          psEnergy: 0,
          arbEnergy: 0,
          isSuccess: false,
          error: error.message
        };
        setSimulationResult(defaultResult);
        return defaultResult;
      }
      
      // Process the result
      const result: BessSimulationResult = {
        ...data,
        isSuccess: true
      };
      
      console.log("BESS simulation result:", result);
      
      setSimulationResult(result);
      return result;
    } catch (err) {
      console.error('Exception in BESS simulation:', err);
      toast.error('Erro na simulação', {
        description: 'Ocorreu um erro ao processar os resultados da simulação.'
      });
      
      // Return default values on error
      const defaultResult: BessSimulationResult = {
        modules: 1,
        bessPowerKw: 108,
        bessEnergyKwh: 215,
        kpiAnnual: 50000,
        dispatch24h: [],
        needPower: 0,
        needEnergy: 0,
        psPower: 0,
        arbPower: 0,
        psEnergy: 0,
        arbEnergy: 0,
        isSuccess: false,
        error: err instanceof Error ? err.message : 'Erro desconhecido'
      };
      setSimulationResult(defaultResult);
      return defaultResult;
    } finally {
      setIsSimulating(false);
    }
  };

  return {
    runSimulation,
    isSimulating,
    simulationResult
  };
}

// Helper function to map form values to simulation input
function mapFormValuesToSimInput(formValues: SimuladorFormValues) {
  // Generate load profile
  let loadProfile: number[];
  if (formValues.loadEntryMethod === "hourly" && Array.isArray(formValues.hourlyDemandKw)) {
    loadProfile = formValues.hourlyDemandKw;
  } else {
    loadProfile = Array(24).fill(0).map((_, i) => {
      if (i >= (formValues.peakStartHour || 18) && i <= (formValues.peakEndHour || 21)) {
        return formValues.maxPeakDemandKw || formValues.avgPeakDemandKw || 100;
      }
      if (i >= 8 && i <= 17) {
        return formValues.avgOffpeakDemandKw || 80;
      }
      return (formValues.avgOffpeakDemandKw || 80) * 0.5;
    });
  }

  // Generate PV profile if enabled
  let pvProfile: number[] = Array(24).fill(0);
  if (formValues.hasPv && formValues.pvPowerKwp > 0) {
    // Simple bell curve for PV generation (peak at noon)
    const pvFactors = [0, 0, 0, 0, 0, 0.1, 0.3, 0.5, 0.7, 0.9, 1.0, 0.9, 0.8, 0.6, 0.4, 0.2, 0, 0, 0, 0, 0, 0, 0, 0];
    pvProfile = pvFactors.map(v => v * formValues.pvPowerKwp);
  }

  // Map peak shaving mode
  let psMode: "percent" | "kw" | "target" = "percent";
  if (formValues.peakShavingMethod === "target") {
    psMode = "target";
  } else if (formValues.peakShavingMethod === "reduction") {
    psMode = "kw";
  }

  // Map peak shaving value
  let psValue = formValues.peakShavingPercentage || 30;
  if (formValues.peakShavingMethod === "target" || formValues.peakShavingMethod === "reduction") {
    psValue = formValues.peakShavingTarget || 0;
  }

  return {
    load: loadProfile,
    pv: formValues.hasPv ? pvProfile : undefined,
    peakStart: formValues.peakStartHour || 18,
    peakEnd: formValues.peakEndHour || 21,
    tePeak: formValues.tePeak || 0.80,
    tusdPeak: formValues.tusdPeakKwh || 0.20,
    teOff: formValues.teOffpeak || 0.40,
    tusdOff: formValues.tusdOffpeakKwh || 0.10,
    tusdDemand: formValues.tusdPeakKw || 50.0,
    usePS: formValues.usePeakShaving,
    psMode,
    psValue,
    useARB: formValues.useArbitrage,
    modulePower: 108,
    moduleEnergy: 215,
    chargeEff: (formValues.bessEfficiency || 90) / 100,
    dischargeEff: (formValues.bessEfficiency || 90) / 100,
    roundEff: Math.pow((formValues.bessEfficiency || 90) / 100, 2),
    maxSoC: 1.0,
    minSoC: 1.0 - (formValues.bessMaxDod || 85) / 100,
    chargeWindow: [1, 5] // Default charging window for arbitrage (early morning)
  };
}
