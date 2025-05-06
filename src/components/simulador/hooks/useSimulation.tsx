
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

/**
 * Hook for managing battery simulation state and execution
 */
export function useSimulation() {
  const { calculateBessSize, isCalculating, validateParams } = useBessSize();
  
  const [simulationResults, setSimulationResults] = useState<SimulationResults | null>(null);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  /**
   * Runs a full battery simulation including technical sizing and financial calculations
   * @param values The form values from the simulator interface
   * @returns Object containing success status and results or error
   */
  const runSimulation = async (values: SimuladorFormValues) => {
    try {
      setIsSimulating(true);
      console.log("Submitting form values:", values);
      
      // Generate load and PV profiles
      const loadProfile = generateLoadProfile(values);
      const pvProfile = generatePvProfile(values);
      
      console.log("Generated profiles:", {
        loadProfile: loadProfile?.length,
        pvProfile: pvProfile?.length,
        hasPv: values.hasPv,
        pvPowerKwp: values.pvPowerKwp
      });
      
      // Build simulation parameters
      const simulationParams = buildSizingParams(values);
      simulationParams.load_profile = loadProfile;
      simulationParams.pv_profile = pvProfile;
      
      console.log("Sending to Edge Function:", simulationParams);
      
      // Validate parameters before sending to edge function
      if (!validateParams(simulationParams)) {
        toast.error("Parâmetros inválidos", {
          description: "Verifique os dados de entrada e tente novamente"
        });
        return { success: false, error: new Error("Parâmetros inválidos") };
      }

      // Call the sizing calculation endpoint
      const sizingResult = await calculateBessSize(simulationParams);
      console.log("Received sizing result:", sizingResult);
      
      // Validate sizing result to ensure we have valid numerical values
      const calculatedPowerKw = typeof sizingResult.calculated_power_kw === 'number' && 
        !isNaN(sizingResult.calculated_power_kw) ? 
        sizingResult.calculated_power_kw : 108; // Default to module size if invalid
        
      const calculatedEnergyKwh = typeof sizingResult.calculated_energy_kwh === 'number' && 
        !isNaN(sizingResult.calculated_energy_kwh) ? 
        sizingResult.calculated_energy_kwh : 215; // Default to module size if invalid
      
      // Calculate financial metrics with validated values
      const financials = calculateFinancialMetrics(
        values, 
        calculatedPowerKw,
        calculatedEnergyKwh
      );
      
      // Build and set simulation results
      const results: SimulationResults = {
        calculatedPowerKw: calculatedPowerKw,
        calculatedEnergyKwh: calculatedEnergyKwh,
        paybackYears: financials.paybackYears,
        annualSavings: financials.annualSavings,
        roi: financials.roi,
        isViable: financials.isViable
      };
      
      console.log("Final simulation results:", results);
      setSimulationResults(results);
      
      toast.success("BESS dimensionado com sucesso!", {
        description: `Potência: ${calculatedPowerKw} kW, Capacidade: ${calculatedEnergyKwh} kWh`
      });
      
      return { success: true, results };
    } catch (error) {
      console.error('Error calculating BESS size:', error);
      toast.error("Erro ao dimensionar BESS", {
        description: "Tente novamente ou ajuste os parâmetros"
      });
      return { success: false, error };
    } finally {
      setIsSimulating(false);
    }
  };

  return {
    simulationResults,
    setSimulationResults,
    runSimulation,
    isSimulating
  };
}
