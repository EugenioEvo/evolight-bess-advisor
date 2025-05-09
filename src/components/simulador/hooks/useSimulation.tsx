
import { useState } from "react";
import { useBessSize } from '@/hooks/useBessSize';
import { useBessSimulation } from '@/hooks/bessSimulation/useBessSimulation';
import { toast } from "sonner";
import { SimuladorFormValues } from "@/schemas/simuladorSchema";
import { SimulationResults } from "./simulation/types";
import { runLegacySimulation } from "./simulation/legacySimulation";
import { processBessSimulationResult } from "./simulation/bessSimulation";

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
        
        // Fall back to legacy simulation if the new one fails
        const legacyResult = await runLegacySimulation(values, calculateBessSize, validateParams);
        
        if (legacyResult.success && legacyResult.results) {
          setSimulationResults(legacyResult.results);
        } else {
          setSimulationError(legacyResult.error?.message || "Erro na simulação");
          return legacyResult;
        }
        
        return legacyResult;
      } else {
        // Process the results of the new BESS simulation
        const processedResult = processBessSimulationResult(bessResult, values);
        
        if (processedResult.success && processedResult.results) {
          setSimulationResults(processedResult.results);
        } else {
          setSimulationError(processedResult.error?.message || "Erro no processamento da simulação");
        }
        
        return processedResult;
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
