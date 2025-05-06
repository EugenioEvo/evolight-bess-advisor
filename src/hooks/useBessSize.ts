
import { useCallback, useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { CalculateBessSizeParams, BessSizeResult } from '@/types/bessSizing'
import { toast } from 'sonner'

/**
 * Hook for battery energy storage system sizing functionality
 * Provides loading states and error handling
 */
export const useBessSize = () => {
  const [isCalculating, setIsCalculating] = useState(false);
  const [lastError, setLastError] = useState<Error | null>(null);
  
  /**
   * Calculates the optimal BESS size based on provided parameters
   * @param params The parameters needed for BESS sizing calculation
   * @returns Promise resolving to the calculated power and energy specifications
   */
  const calculateBessSize = useCallback(async (params: CalculateBessSizeParams): Promise<BessSizeResult> => {
    try {
      // Reset states before starting calculation
      setIsCalculating(true);
      setLastError(null);
      
      console.log("Sending BESS sizing parameters to edge function:", params);
      
      const { data, error } = await supabase.functions.invoke('calculate-bess-size', {
        body: params,
      })
      
      if (error) {
        console.error("BESS sizing calculation failed:", error);
        setLastError(new Error(`Erro no cálculo de dimensionamento: ${error.message}`));
        toast.error("Falha no dimensionamento", {
          description: "Ocorreu um erro ao calcular o dimensionamento do BESS"
        });
        // Return default values even on error to prevent null values
        return {
          calculated_power_kw: 108, // Default module size
          calculated_energy_kwh: 215 // Default module size
        };
      }
      
      console.log("BESS sizing calculation result data:", data);
      
      // Validate the received data
      if (!data || 
          typeof data.calculated_power_kw !== 'number' || 
          typeof data.calculated_energy_kwh !== 'number' ||
          isNaN(data.calculated_power_kw) ||
          isNaN(data.calculated_energy_kwh)) {
        
        console.error("Invalid BESS sizing result:", data);
        setLastError(new Error("Resultado do dimensionamento inválido"));
        
        // Return default values if the data is invalid
        return {
          calculated_power_kw: 108, // Default module size
          calculated_energy_kwh: 215 // Default module size
        };
      }
      
      return data as BessSizeResult;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido no dimensionamento";
      setLastError(new Error(errorMessage));
      toast.error("Erro no dimensionamento", {
        description: errorMessage
      });
      
      // Return default values even on error to prevent null values
      return {
        calculated_power_kw: 108, // Default module size
        calculated_energy_kwh: 215 // Default module size
      };
    } finally {
      setIsCalculating(false);
    }
  }, []);
  
  /**
   * Clear any stored errors from previous calculations
   */
  const clearError = useCallback(() => {
    setLastError(null);
  }, []);
  
  /**
   * Validates the input parameters before calculation
   * @param params The parameters to validate
   * @returns True if parameters are valid, false otherwise
   */
  const validateParams = useCallback((params: CalculateBessSizeParams): boolean => {
    // Basic validation
    if (!params.load_profile || !Array.isArray(params.load_profile) || params.load_profile.length === 0) {
      setLastError(new Error("Perfil de carga inválido ou vazio"));
      return false;
    }
    
    // Ensure pv_profile is an array if provided
    if (params.pv_profile && !Array.isArray(params.pv_profile)) {
      console.warn("PV profile provided but not an array, correcting to empty array", params.pv_profile);
      params.pv_profile = [];
    }
    
    // Check if at least one sizing strategy is enabled
    if (
      !params.sizing_params.peak_shaving_required &&
      !params.sizing_params.backup_required &&
      !params.sizing_params.arbitrage_required &&
      !params.sizing_params.pv_optim_required
    ) {
      setLastError(new Error("Pelo menos uma estratégia de dimensionamento deve ser habilitada"));
      return false;
    }
    
    return true;
  }, []);

  return {
    calculateBessSize,
    isCalculating,
    lastError,
    clearError,
    validateParams
  }
}
