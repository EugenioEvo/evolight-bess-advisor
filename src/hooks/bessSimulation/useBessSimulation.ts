
import { useState } from 'react';
import { SimuladorFormValues } from '@/schemas/simuladorSchema';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { BessSimulationResult } from './types';
import { mapFormValuesToSimInput } from './mapFormValuesToSimInput';

/**
 * Hook for running BESS simulations via edge function
 */
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
        const defaultResult = createDefaultResult(error.message);
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
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      const defaultResult = createDefaultResult(errorMessage);
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

/**
 * Creates a default simulation result for error cases
 */
function createDefaultResult(errorMessage: string): BessSimulationResult {
  return {
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
    error: errorMessage
  };
}
