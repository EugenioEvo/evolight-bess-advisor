import { useState } from "react";
import { useBessSize } from '@/hooks/useBessSize';
import { useBessSimulation } from '@/hooks/useBessSimulation';
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
  dispatch24h?: any[];
};

/**
 * Hook for managing battery simulation state and execution
 */
export function useSimulation() {
  const { calculateBessSize, isCalculating, validateParams } = useBessSize();
  const { runSimulation: runBessSimulation, isSimulating: isBessSimulating } = useBessSimulation();
  
  const [simulationResults, setSimulationResults] = useState<SimulationResults | null>(null);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulationError, setSimulationError] = useState<string | null>(null);

  /**
   * Runs a full battery simulation including technical sizing and financial calculations
   * @param values The form values from the simulator interface
   * @returns Object containing success status and results or error
   */
  const runSimulation = async (values: SimuladorFormValues) => {
    try {
      setIsSimulating(true);
      setSimulationError(null);
      console.log("Submitting form values:", values);
      
      // Run the new BESS simulation
      const bessResult = await runBessSimulation(values);
      console.log("BESS simulation result:", bessResult);
      
      if (!bessResult.isSuccess) {
        console.warn("BESS simulation failed, falling back to old method");
        
        // Generate load and PV profiles
        const loadProfile = generateLoadProfile(values);
        const pvProfile = generatePvProfile(values);
        
        console.log("Generated profiles:", {
          loadProfile: loadProfile?.length,
          pvProfile: pvProfile?.length,
          hasPv: values.hasPv,
          pvPowerKwp: values.pvPowerKwp
        });
        
        if (!loadProfile || loadProfile.length === 0) {
          toast.error("Perfil de carga inválido", {
            description: "Não foi possível gerar o perfil de carga. Verifique os dados de entrada."
          });
          setSimulationError("Perfil de carga inválido");
          return { success: false, error: new Error("Perfil de carga inválido") };
        }
        
        // Build simulation parameters
        const simulationParams = buildSizingParams(values);
        simulationParams.load_profile = loadProfile;
        simulationParams.pv_profile = pvProfile || [];
        
        console.log("Sending to Edge Function:", simulationParams);
        
        // Validate parameters before sending to edge function
        if (!validateParams(simulationParams)) {
          const errorMessage = "Parâmetros inválidos. Verifique se pelo menos uma estratégia de dimensionamento está habilitada.";
          toast.error("Parâmetros inválidos", {
            description: "Verifique os dados de entrada e tente novamente"
          });
          setSimulationError(errorMessage);
          return { success: false, error: new Error(errorMessage) };
        }

        // Call the sizing calculation endpoint
        let sizingResult;
        try {
          sizingResult = await calculateBessSize(simulationParams);
          console.log("Received sizing result:", sizingResult);
        } catch (callError) {
          console.error('Error calling BESS size calculation function:', callError);
          // Se falhar, use valores padrão mas informe ao usuário
          toast.warning("Usando dimensionamento padrão", {
            description: "Não foi possível calcular o dimensionamento. Usando valores padrão."
          });
          sizingResult = {
            calculated_power_kw: values.bessPowerKw || 108,
            calculated_energy_kwh: values.bessCapacityKwh || 215
          };
        }
        
        // Validate sizing result to ensure we have valid numerical values
        const calculatedPowerKw = typeof sizingResult.calculated_power_kw === 'number' && 
          !isNaN(sizingResult.calculated_power_kw) ? 
          sizingResult.calculated_power_kw : (values.bessPowerKw || 108); // Use input value as fallback
          
        const calculatedEnergyKwh = typeof sizingResult.calculated_energy_kwh === 'number' && 
          !isNaN(sizingResult.calculated_energy_kwh) ? 
          sizingResult.calculated_energy_kwh : (values.bessCapacityKwh || 215); // Use input value as fallback
        
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
          description: `Potência: ${calculatedPowerKw.toFixed(2)} kW, Capacidade: ${calculatedEnergyKwh.toFixed(2)} kWh`
        });
        
        return { success: true, results };
      } else {
        // Use the new BESS simulation results
        const calculatedPowerKw = bessResult.bessPowerKw;
        const calculatedEnergyKwh = bessResult.bessEnergyKwh;
        const annualSavings = bessResult.kpiAnnual;
        
        // Calculate additional financial metrics
        let totalInvestment = 0;
        if (values.capexCost > 0) {
          // If provided a manual total cost, use that value
          totalInvestment = values.capexCost;
        } else if (values.bessUnitCost > 0) {
          // If provided a cost per BESS unit, calculate based on number of units
          totalInvestment = bessResult.modules * values.bessUnitCost;
        } else {
          // Otherwise, use cost per kWh based on actual energy capacity
          totalInvestment = calculatedEnergyKwh * (values.bessInstallationCost || 1500);
        }
        
        // Calculate payback and ROI
        const paybackYears = annualSavings > 0 ? totalInvestment / annualSavings : 0;
        const roi = (annualSavings * values.horizonYears) / totalInvestment * 100;
        const isViable = paybackYears > 0 && paybackYears < values.horizonYears;
        
        // Build and set simulation results
        const results: SimulationResults = {
          calculatedPowerKw: calculatedPowerKw,
          calculatedEnergyKwh: calculatedEnergyKwh,
          paybackYears,
          annualSavings,
          roi,
          isViable,
          dispatch24h: bessResult.dispatch24h
        };
        
        console.log("Final simulation results (v2):", results);
        setSimulationResults(results);
        
        toast.success("BESS dimensionado com sucesso!", {
          description: `Potência: ${calculatedPowerKw.toFixed(2)} kW, Capacidade: ${calculatedEnergyKwh.toFixed(2)} kWh`
        });
        
        return { success: true, results };
      }
    } catch (error) {
      console.error('Error calculating BESS size:', error);
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
      toast.error("Erro ao dimensionar BESS", {
        description: "Tente novamente ou ajuste os parâmetros"
      });
      setSimulationError(errorMessage);
      return { success: false, error };
    } finally {
      setIsSimulating(false);
    }
  };

  return {
    simulationResults,
    simulationError,
    setSimulationResults,
    runSimulation,
    isSimulating: isSimulating || isBessSimulating || isCalculating
  };
}
