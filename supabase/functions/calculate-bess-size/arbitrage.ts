
// Arbitrage and PV optimization calculations
import { PeakShavingConfig, PeakAnalysisResult, SizingParams, ArbitrageResult, SimulationParams, PvArbitrageResult } from "./types.ts";

// Calculate arbitrage power and energy requirements
export function calculateArbitrageRequirements(
  load_profile: number[],
  pv_profile?: number[],
  sizing_params?: SizingParams,
  peakShavingConfig?: PeakShavingConfig,
  peakAnalysis?: PeakAnalysisResult,
  discharge_eff: number = 0.95,
  charge_eff: number = 0.95,
  simulation_params?: SimulationParams
): ArbitrageResult {
  let power_arbitrage = 0;
  let energy_arbitrage = 0;

  // Improved arbitrage calculation that works better with peak shaving
  if (sizing_params?.peak_shaving_required && 
      peakShavingConfig?.power_peak_shave && 
      peakShavingConfig.power_peak_shave > 0 &&
      peakAnalysis) {
    // When combining with peak shaving, arbitrage should account for peak period energy
    // Calculate energy needed for peak period based on post-peak-shaving load
    const peakPeriodEnergy = peakAnalysis.peakEnergyTotal - 
      (peakShavingConfig.power_peak_shave * peakShavingConfig.effective_peak_shaving_hours);
    
    // Power requirement should be at least the peak shaving power
    power_arbitrage = peakShavingConfig.power_peak_shave;
    
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
    const peak_period_avg = peakAnalysis?.avg_peak_load || avg_load * 1.5;
    
    // For pure arbitrage, use a more substantial portion of the peak load
    power_arbitrage = peak_period_avg * 0.8;
    energy_arbitrage = power_arbitrage * (peakShavingConfig?.effective_peak_shaving_hours || 4);
    
    console.log("Pure arbitrage sizing:", { 
      power_arbitrage, 
      energy_arbitrage, 
      avg_load,
      peak_period_avg
    });
  }
  
  // Add PV contribution if available
  if (pv_profile && pv_profile.length > 0) {
    const pvArbitrageResult = calculatePvArbitrageContribution(
      load_profile,
      pv_profile,
      power_arbitrage,
      energy_arbitrage,
      sizing_params,
      simulation_params
    );
    
    power_arbitrage = pvArbitrageResult.power_arbitrage;
    energy_arbitrage = pvArbitrageResult.energy_arbitrage;
  }

  // Account for charge efficiency when calculating energy requirements
  energy_arbitrage = energy_arbitrage / charge_eff;

  return { power_arbitrage, energy_arbitrage };
}

// Calculate PV contribution to arbitrage
export function calculatePvArbitrageContribution(
  load_profile: number[],
  pv_profile: number[],
  current_power_arbitrage: number,
  current_energy_arbitrage: number,
  sizing_params?: SizingParams,
  simulation_params?: SimulationParams
): PvArbitrageResult {
  // Calculate daily PV surplus
  const interval_hours = (simulation_params?.interval_minutes || 60) / 60;
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
  
  if (sizing_params?.grid_zero) {
    current_power_arbitrage = Math.max(current_power_arbitrage, power_pv_arbitrage_charge);
  }
  
  const power_arbitrage = Math.max(current_power_arbitrage, power_pv);
  const energy_arbitrage = Math.max(current_energy_arbitrage, energy_pv_arbitrage);
  
  console.log("PV contribution to arbitrage:", { 
    power_pv, 
    energy_pv_arbitrage, 
    daily_surplus, 
    max_surplus 
  });
  
  return { power_arbitrage, energy_arbitrage };
}
