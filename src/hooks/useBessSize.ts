
import { useCallback } from 'react'
import { supabase } from '@/integrations/supabase/client'

interface TariffStructure {
  peak_start_hour: number
  peak_end_hour: number
}

interface SizingParams {
  backup_required: boolean
  critical_load_kw?: number
  backup_duration_h?: number
  peak_shaving_required: boolean
  peak_shaving_target_kw?: number
  peak_reduction_kw?: number
  arbitrage_required: boolean
  pv_optim_required: boolean
  grid_zero: boolean
  sizing_buffer_factor?: number
}

interface BessTechnicalParams {
  discharge_eff: number
  charge_eff: number
}

interface SimulationParams {
  interval_minutes: number
}

interface CalculateBessSizeParams {
  load_profile: number[]
  pv_profile?: number[]
  tariff_structure: TariffStructure
  sizing_params: SizingParams
  bess_technical_params: BessTechnicalParams
  simulation_params: SimulationParams
}

export const useBessSize = () => {
  const calculateBessSize = useCallback(async (params: CalculateBessSizeParams) => {
    const { data, error } = await supabase.functions.invoke('calculate-bess-size', {
      body: params,
    })
    
    if (error) throw error
    return data as { calculated_power_kw: number; calculated_energy_kwh: number }
  }, [])

  return {
    calculateBessSize,
  }
}
