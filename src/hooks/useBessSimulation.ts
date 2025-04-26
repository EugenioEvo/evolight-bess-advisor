
import { useCallback } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { SimuladorFormValues } from '@/schemas/simuladorSchema'

interface SimulationParams {
  load_profile_kw: number[]
  pv_profile_kw?: number[]
  bess_params: {
    capacity_kwh: number
    power_kw: number
    rte_efficiency: number
    dod_max_percent: number
    initial_soc_percent: number
    degradation_percent_year?: number
  }
  tariff_structure: {
    te_peak: number
    te_offpeak: number
    tusd_peak_kwh: number
    tusd_offpeak_kwh: number
    tusd_peak_kw: number
    tusd_offpeak_kw: number
    peak_start_hour: number
    peak_end_hour: number
  }
  diesel_params?: {
    enabled: boolean
    power_kw: number
    consumption_l_per_kwh: number
    fuel_cost_per_liter: number
    om_cost_per_hour?: number
  }
  simulation_params: {
    interval_minutes: number
    days_in_year: number
  }
  financial_params: {
    discount_rate: number
    horizon_years: number
    tax_rate?: number
    upgrade_deferral_cost?: number
    upgrade_deferral_year?: number
    tariff_escalation_rate?: number
  }
  business_model_params: {
    type: 'turnkey' | 'eaas'
    capex_cost?: number
    annual_om_cost?: number
    setup_cost?: number
    annual_service_cost?: number
  }
  control_strategy: {
    use_peak_shaving: boolean
    peak_shaving_target_kw?: number
    use_arbitrage: boolean
    use_backup: boolean
    use_pv_optim: boolean
    grid_zero: boolean
  }
}

interface SimulationResult {
  technical_summary: {
    bess_cycles_estimated: number
    annual_energy_throughput_mwh: number
    annual_solar_curtailment_mwh: number
  }
  financial_summary: {
    annual_cost_base_case_r: number
    annual_cost_with_bess_r: number
    annual_gross_savings_r: number
    npv_r: number
    irr_percent: number
    payback_discounted_years: number
    cash_flow_r: number[]
  }
  input_summary: {
    bess_params: any
    tariff_structure: any
    diesel_params: any
    financial_params: any
    business_model: string
  }
}

export const useBessSimulation = () => {
  const simulateBess = useCallback(async (formValues: SimuladorFormValues): Promise<SimulationResult> => {
    // Convert form values to simulation parameters
    const params: SimulationParams = {
      // Example daily load profile (simplified for demonstration)
      load_profile_kw: [50, 45, 40, 40, 45, 55, 70, 80, 90, 100, 110, 115, 110, 105, 100, 100, 110, 150, 160, 140, 120, 100, 80, 60],
      
      // Add PV profile if enabled
      pv_profile_kw: formValues.hasPv 
        ? [0, 0, 0, 0, 0, 5, 20, 40, 60, 70, 75, 70, 60, 40, 20, 5, 0, 0, 0, 0, 0, 0, 0, 0].map(v => v * (formValues.pvPowerKwp / 75))
        : undefined,
      
      bess_params: {
        capacity_kwh: formValues.bessCapacityKwh,
        power_kw: formValues.bessPowerKw,
        rte_efficiency: formValues.bessEfficiency / 100, // Convert from percentage
        dod_max_percent: formValues.bessMaxDod,
        initial_soc_percent: formValues.bessInitialSoc,
        degradation_percent_year: 1.0 // Default value
      },
      
      tariff_structure: {
        te_peak: formValues.tePeak,
        te_offpeak: formValues.teOffpeak,
        tusd_peak_kwh: formValues.tusdPeakKwh,
        tusd_offpeak_kwh: formValues.tusdOffpeakKwh,
        tusd_peak_kw: formValues.tusdPeakKw,
        tusd_offpeak_kw: formValues.tusdOffpeakKw,
        peak_start_hour: formValues.peakStartHour,
        peak_end_hour: formValues.peakEndHour
      },
      
      // Diesel parameters if enabled
      diesel_params: formValues.hasDiesel ? {
        enabled: true,
        power_kw: formValues.dieselPowerKw,
        consumption_l_per_kwh: formValues.dieselConsumption,
        fuel_cost_per_liter: formValues.dieselFuelCost,
        om_cost_per_hour: 10.0 // Default value
      } : undefined,
      
      simulation_params: {
        interval_minutes: 60,
        days_in_year: 365
      },
      
      financial_params: {
        discount_rate: formValues.discountRate,
        horizon_years: formValues.horizonYears,
        tax_rate: 34.0, // Default value
        upgrade_deferral_cost: 0, // Default value
        upgrade_deferral_year: 3, // Default value
        tariff_escalation_rate: 5.0 // Default value
      },
      
      business_model_params: formValues.businessModel === 'turnkey' 
        ? {
            type: 'turnkey',
            capex_cost: formValues.capexCost,
            annual_om_cost: formValues.annualOmCost
          }
        : {
            type: 'eaas',
            setup_cost: formValues.setupCost,
            annual_service_cost: formValues.annualServiceCost
          },
      
      control_strategy: {
        use_peak_shaving: formValues.usePeakShaving,
        peak_shaving_target_kw: formValues.peakShavingTarget,
        use_arbitrage: formValues.useArbitrage,
        use_backup: formValues.useBackup,
        use_pv_optim: formValues.usePvOptim,
        grid_zero: formValues.pvPolicy === 'grid_zero'
      }
    };

    console.log('Running simulation with params:', params);

    const { data, error } = await supabase.functions.invoke(
      'run-bess-simulation', 
      { body: params }
    );

    if (error) {
      console.error('Error running BESS simulation:', error);
      throw error;
    }

    return data as SimulationResult;
  }, []);

  return { simulateBess };
};
