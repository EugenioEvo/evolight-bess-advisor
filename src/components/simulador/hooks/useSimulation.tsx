
import { useState } from "react";
import { useBessSize } from '@/hooks/useBessSize';
import { toast } from "sonner";
import { SimuladorFormValues } from "@/schemas/simuladorSchema";
import { generateLoadProfile, generatePvProfile } from "./simulation/loadProfileGenerator";
import { buildSizingParams } from "./simulation/simulationParamBuilder";
import { calculateFinancialMetrics } from "./simulation/financialCalculations";

export type SimulationResults = {
  calculatedPowerKw: number;
  calculatedEnergyKwh: number;
  paybackYears?: number;
  annualSavings?: number;
  roi?: number;
  npv?: number;
  isViable?: boolean;
};

export function useSimulation() {
  const { calculateBessSize } = useBessSize();
  
  const [simulationResults, setSimulationResults] = useState<SimulationResults | null>(null);

  const runSimulation = async (values: SimuladorFormValues) => {
    try {
      console.log("Submitting form values:", values);
      
      // Generate load and PV profiles
      const loadProfile = generateLoadProfile(values);
      const pvProfile = generatePvProfile(values);
      
      // Build simulation parameters
      const simulationParams = buildSizingParams(values);
      simulationParams.load_profile = loadProfile;
      simulationParams.pv_profile = pvProfile;
      
      console.log("Sending to Edge Function:", simulationParams);

      // Call the sizing calculation endpoint
      const sizingResult = await calculateBessSize(simulationParams);
      console.log("Received sizing result:", sizingResult);
      
      // Calculate financial metrics
      const financials = calculateFinancialMetrics(
        values, 
        sizingResult.calculated_power_kw, 
        sizingResult.calculated_energy_kwh
      );
      
      // Build and set simulation results
      const results: SimulationResults = {
        calculatedPowerKw: sizingResult.calculated_power_kw,
        calculatedEnergyKwh: sizingResult.calculated_energy_kwh,
        paybackYears: financials.paybackYears,
        annualSavings: financials.annualSavings,
        roi: financials.roi,
        isViable: financials.isViable
      };
      
      setSimulationResults(results);
      
      toast.success("BESS dimensionado com sucesso!", {
        description: `Potência: ${sizingResult.calculated_power_kw} kW, Capacidade: ${sizingResult.calculated_energy_kwh} kWh`
      });
      
      return { success: true, results };
    } catch (error) {
      console.error('Error calculating BESS size:', error);
      toast.error("Erro ao dimensionar BESS", {
        description: "Tente novamente ou ajuste os parâmetros"
      });
      return { success: false, error };
    }
  };

  return {
    simulationResults,
    setSimulationResults,
    runSimulation
  };
}
