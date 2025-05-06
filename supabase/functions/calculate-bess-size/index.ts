
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface TariffStructure {
  peak_start_hour: number
  peak_end_hour: number
  modality: "blue" | "green" | "conventional"
}

interface SizingParams {
  backup_required: boolean
  critical_load_kw?: number
  backup_duration_h?: number
  peak_shaving_required: boolean
  peak_shaving_target_kw?: number
  peak_reduction_kw?: number
  peak_shaving_start_hour?: number
  peak_shaving_end_hour?: number
  peak_shaving_duration_hours?: number
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

interface RequestBody {
  load_profile: number[]
  pv_profile?: number[]
  tariff_structure: TariffStructure
  sizing_params: SizingParams
  bess_technical_params: BessTechnicalParams
  simulation_params: SimulationParams
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      load_profile,
      pv_profile,
      tariff_structure,
      sizing_params,
      bess_technical_params,
      simulation_params 
    } = await req.json() as RequestBody

    // Basic validation
    if (!load_profile || !Array.isArray(load_profile) || load_profile.length === 0) {
      throw new Error("Invalid load profile")
    }

    console.log("Received parameters:", { sizing_params, tariff_structure });

    // Initialize requirements
    let required_power_kw = 0;
    let required_energy_kwh = 0;

    // Get efficiencies
    const discharge_eff = bess_technical_params.discharge_eff;
    const charge_eff = bess_technical_params.charge_eff;

    // Calculate peak shaving hours per day
    const peak_shaving_start_hour = sizing_params.peak_shaving_start_hour !== undefined ? sizing_params.peak_shaving_start_hour : tariff_structure.peak_start_hour;
    const peak_shaving_end_hour = sizing_params.peak_shaving_end_hour !== undefined ? sizing_params.peak_shaving_end_hour : tariff_structure.peak_end_hour;
    const peak_shaving_hours = peak_shaving_end_hour - peak_shaving_start_hour + 1;
    
    // Use specified duration if available, or use the calculated hours if not
    const peak_shaving_duration_hours = sizing_params.peak_shaving_duration_hours !== undefined ? 
      sizing_params.peak_shaving_duration_hours : peak_shaving_hours;
    
    // Limit the duration to the available hours
    const effective_peak_shaving_hours = Math.min(peak_shaving_duration_hours, peak_shaving_hours);

    console.log("Peak shaving schedule:", {
      peak_shaving_start_hour,
      peak_shaving_end_hour, 
      peak_shaving_hours,
      peak_shaving_duration_hours,
      effective_peak_shaving_hours
    });

    // 1. Backup sizing
    if (sizing_params.backup_required) {
      const critical_load_kw = sizing_params.critical_load_kw || 0;
      const backup_duration_h = sizing_params.backup_duration_h || 0;

      if (critical_load_kw > 0 && backup_duration_h > 0) {
        const power_backup = critical_load_kw;
        const energy_backup = (critical_load_kw * backup_duration_h) / discharge_eff;

        required_power_kw = Math.max(required_power_kw, power_backup);
        required_energy_kwh = Math.max(required_energy_kwh, energy_backup);
        
        console.log("Backup sizing:", { power_backup, energy_backup });
      }
    }

    // 2. Calculate peak load demand and energy
    const max_load = Math.max(...load_profile);
    let peakPeriodIndices = [];
    let peakHoursTotal = 0;
    let peakEnergyTotal = 0;

    // Determine peak period hours
    for (let hour = 0; hour < load_profile.length; hour++) {
      if (hour >= tariff_structure.peak_start_hour && hour <= tariff_structure.peak_end_hour) {
        peakPeriodIndices.push(hour);
        peakHoursTotal++;
        peakEnergyTotal += load_profile[hour];
      }
    }

    const avg_peak_load = peakEnergyTotal / peakHoursTotal;
    console.log("Peak period analysis:", { 
      peakHoursTotal, 
      peakEnergyTotal, 
      avg_peak_load, 
      max_peak_load: Math.max(...peakPeriodIndices.map(i => load_profile[i]))
    });

    // 3. Peak Shaving sizing with improvements
    let power_peak_shave = 0;
    let energy_peak_shave = 0;
    let peak_load_after_shaving = max_load;

    if (sizing_params.peak_shaving_required) {
      // Determine how much power to shave
      if (sizing_params.peak_reduction_kw && sizing_params.peak_reduction_kw > 0) {
        power_peak_shave = sizing_params.peak_reduction_kw;
      } else if (sizing_params.peak_shaving_target_kw && max_load > sizing_params.peak_shaving_target_kw) {
        power_peak_shave = max_load - sizing_params.peak_shaving_target_kw;
        peak_load_after_shaving = sizing_params.peak_shaving_target_kw;
      } else {
        // Default to 30% reduction if no target specified
        power_peak_shave = max_load * 0.3;
        peak_load_after_shaving = max_load * 0.7;
      }

      // Check if peak shaving is very high (>90% of max load)
      const peak_shaving_percentage = power_peak_shave / max_load * 100;
      const isHighPeakShaving = peak_shaving_percentage > 90;

      // Calculate energy needs for peak shaving
      if (isHighPeakShaving) {
        // For very high peak shaving, consider the entire peak energy
        energy_peak_shave = peakEnergyTotal / discharge_eff;
        console.log("High peak shaving (>90%) - using entire peak energy:", { energy_peak_shave });
      } else {
        // Regular calculation - peak shave power * duration
        energy_peak_shave = (power_peak_shave * effective_peak_shaving_hours) / discharge_eff;
      }

      if (power_peak_shave > 0) {
        required_power_kw = Math.max(required_power_kw, power_peak_shave);
        required_energy_kwh = Math.max(required_energy_kwh, energy_peak_shave);
        
        console.log("Peak shaving sizing:", { 
          power_peak_shave, 
          energy_peak_shave,
          peak_shaving_percentage,
          isHighPeakShaving,
          max_load,
          peak_load_after_shaving,
          effective_peak_shaving_hours 
        });
      }
    }

    // 4. PV Optimization / Arbitrage sizing with improved integration with peak shaving
    if (sizing_params.arbitrage_required) {
      let power_arbitrage = 0;
      let energy_arbitrage = 0;

      // Improved arbitrage calculation that works better with peak shaving
      if (sizing_params.peak_shaving_required && power_peak_shave > 0) {
        // When combining with peak shaving, arbitrage should account for peak period energy
        // Calculate energy needed for peak period based on post-peak-shaving load
        const peakPeriodEnergy = peakEnergyTotal - (power_peak_shave * effective_peak_shaving_hours);
        
        // Power requirement should be at least the peak shaving power
        power_arbitrage = power_peak_shave;
        
        // Energy requirement depends on peak period energy after peak shaving
        energy_arbitrage = peakPeriodEnergy / discharge_eff;
        
        console.log("Combined arbitrage + peak shaving:", {
          peakPeriodEnergy,
          power_arbitrage,
          energy_arbitrage
        });
      } else {
        // Calculate for arbitrage without peak shaving
        // Simple arbitrage sizing based on load profile
        const avg_load = load_profile.reduce((sum, val) => sum + val, 0) / load_profile.length;
        const peak_period_avg = avg_peak_load || avg_load * 1.5;
        
        // For pure arbitrage, use a more substantial portion of the peak load
        power_arbitrage = peak_period_avg * 0.8;
        energy_arbitrage = power_arbitrage * effective_peak_shaving_hours;
        
        console.log("Pure arbitrage sizing:", { 
          power_arbitrage, 
          energy_arbitrage, 
          avg_load,
          peak_period_avg
        });
      }
      
      // Add PV contribution if available
      if (pv_profile && pv_profile.length > 0) {
        // Calculate daily PV surplus
        const interval_hours = simulation_params.interval_minutes / 60;
        const net_load = load_profile.map((load, i) => load - (pv_profile[i] || 0));
        const pv_surplus = net_load.map(nl => Math.max(0, -nl));
        
        const total_surplus = pv_surplus.reduce((sum, val) => sum + val * interval_hours, 0);
        const max_surplus = Math.max(...pv_surplus);
        
        // Assume one day of data for simplicity
        const daily_surplus = total_surplus;
        
        // Size for storing daily surplus
        const energy_pv_arbitrage = daily_surplus;

        // Power sizing based on C/4 rate or peak surplus
        const power_pv_arbitrage_discharge = energy_pv_arbitrage / 4.0;
        const power_pv_arbitrage_charge = max_surplus;
        
        const power_pv = Math.max(power_pv_arbitrage_discharge, power_pv_arbitrage_charge);
        
        if (sizing_params.grid_zero) {
          power_arbitrage = Math.max(power_arbitrage, power_pv_arbitrage_charge);
        }
        
        power_arbitrage = Math.max(power_arbitrage, power_pv);
        energy_arbitrage = Math.max(energy_arbitrage, energy_pv_arbitrage);
        
        console.log("PV contribution to arbitrage:", { 
          power_pv, 
          energy_pv_arbitrage, 
          daily_surplus, 
          max_surplus 
        });
      }

      // Account for charge efficiency when calculating energy requirements
      energy_arbitrage = energy_arbitrage / charge_eff;
      
      required_power_kw = Math.max(required_power_kw, power_arbitrage);
      required_energy_kwh = Math.max(required_energy_kwh, energy_arbitrage);
      
      console.log("Final arbitrage sizing:", { power_arbitrage, energy_arbitrage });
    }

    console.log("Initial sizing:", { required_power_kw, required_energy_kwh });

    // Apply buffer factor
    const buffer_factor = sizing_params.sizing_buffer_factor || 1.1;
    let final_power_kw = required_power_kw * buffer_factor;
    let final_energy_kwh = required_energy_kwh * buffer_factor;

    // Ensure minimum sizes
    if (final_power_kw <= 0 || final_energy_kwh <= 0) {
      final_power_kw = Math.max(final_power_kw, 10.0);
      final_energy_kwh = Math.max(final_energy_kwh, 20.0);
      console.log("Applied minimum sizes");
    }
    
    console.log("Final sizing:", { final_power_kw, final_energy_kwh });

    return new Response(
      JSON.stringify({
        calculated_power_kw: Math.round(final_power_kw * 10) / 10,
        calculated_energy_kwh: Math.round(final_energy_kwh * 10) / 10
      }),
      { 
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders 
        } 
      }
    )

  } catch (error) {
    console.error("Error in calculate-bess-size function:", error);
    
    return new Response(
      JSON.stringify({ error: error.message || "Unknown error in calculate-bess-size function" }),
      { 
        status: 400, 
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders 
        } 
      }
    )
  }
})
