
import { useCallback } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { CalculateBessSizeParams, BessSizeResult } from '@/types/bessSizing'

/**
 * Hook for battery energy storage system sizing functionality
 */
export const useBessSize = () => {
  /**
   * Calculates the optimal BESS size based on provided parameters
   * @param params The parameters needed for BESS sizing calculation
   * @returns Promise resolving to the calculated power and energy specifications
   */
  const calculateBessSize = useCallback(async (params: CalculateBessSizeParams): Promise<BessSizeResult> => {
    const { data, error } = await supabase.functions.invoke('calculate-bess-size', {
      body: params,
    })
    
    if (error) throw error
    return data as BessSizeResult
  }, [])

  return {
    calculateBessSize,
  }
}
