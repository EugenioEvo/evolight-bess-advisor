
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
      
      console.log("Sending BESS sizing parameters to edge function:", JSON.stringify(params));
      
      // Sempre forneça valores padrão para o perfil de carga e de PV
      if (!params.load_profile || params.load_profile.length === 0) {
        params.load_profile = Array(24).fill(0).map((_, i) => {
          if (i >= 18 && i <= 21) return 100; // Pico
          if (i >= 8 && i <= 17) return 80;   // Horas comerciais
          return 40;                          // Noite/madrugada
        });
      }
      
      if (!params.pv_profile) {
        params.pv_profile = [];
      }
      
      // Tente chamar a edge function, mas estabeleça um timeout
      const timeoutPromise = new Promise<BessSizeResult>((_, reject) => {
        setTimeout(() => reject(new Error("Tempo limite excedido")), 15000); // 15s timeout
      });
      
      const fetchPromise = supabase.functions.invoke('calculate-bess-size', {
        body: params,
      }).then(response => {
        if (response.error) {
          console.error("BESS sizing calculation failed:", response.error);
          throw new Error(`Erro no cálculo de dimensionamento: ${response.error.message}`);
        }
        return response.data as BessSizeResult;
      });
      
      // Use o resultado que vier primeiro (ou a resposta ou o timeout)
      const data = await Promise.race([fetchPromise, timeoutPromise]);
      
      console.log("BESS sizing calculation result data:", data);
      
      // Validate the received data
      if (!data || 
          typeof data.calculated_power_kw !== 'number' || 
          typeof data.calculated_energy_kwh !== 'number' ||
          isNaN(data.calculated_power_kw) ||
          isNaN(data.calculated_energy_kwh)) {
        
        console.error("Invalid BESS sizing result:", data);
        throw new Error("Resultado do dimensionamento inválido");
      }
      
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido no dimensionamento";
      setLastError(new Error(errorMessage));
      console.error("BESS sizing calculation error:", errorMessage);
      
      // Retornar valores padrão em caso de erro
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
    try {
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
        console.warn("No sizing strategy enabled, enabling peak shaving by default");
        params.sizing_params.peak_shaving_required = true;
        
        // Set default peak reduction if not set
        if (!params.sizing_params.peak_reduction_kw) {
          const maxLoad = Math.max(...params.load_profile);
          params.sizing_params.peak_reduction_kw = maxLoad * 1; // 100% reduction
        }
      }
      
      return true;
    } catch (error) {
      console.error("Error validating parameters:", error);
      setLastError(new Error("Erro ao validar parâmetros"));
      return false;
    }
  }, []);

  return {
    calculateBessSize,
    isCalculating,
    lastError,
    clearError,
    validateParams
  }
}
