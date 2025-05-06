
// Requirements aggregation functionality
import { SizingParams, TariffStructure, BessTechnicalParams, SimulationParams } from "./types.ts";
import { calculateBackupRequirements } from "./backup.ts";
import { calculatePeakShavingConfig, analyzePeakPeriod, calculatePeakShavingSizing } from "./peak-shaving.ts";
import { calculateArbitrageRequirements } from "./arbitrage.ts";

/**
 * Combine sizing requirements from different sizing strategies
 * @param powerRequirements - Array of power requirements from different strategies
 * @param energyRequirements - Array of energy requirements from different strategies
 * @returns Combined power and energy requirements
 */
export function combineRequirements(
  powerRequirements: { value: number, source: string }[],
  energyRequirements: { value: number, source: string }[]
): { power_kw: number, energy_kwh: number } {
  // Find maximum requirements from all strategies
  let max_power = 0;
  let max_energy = 0;
  let max_power_source = "";
  let max_energy_source = "";
  
  // Determine the max power requirement and its source
  powerRequirements.forEach(req => {
    if (req.value > max_power) {
      max_power = req.value;
      max_power_source = req.source;
    }
  });
  
  // Determine the max energy requirement and its source
  energyRequirements.forEach(req => {
    if (req.value > max_energy) {
      max_energy = req.value;
      max_energy_source = req.source;
    }
  });
  
  console.log("Requirements summary:", {
    power_requirements: powerRequirements,
    energy_requirements: energyRequirements,
    max_power,
    max_power_source,
    max_energy,
    max_energy_source
  });
  
  return {
    power_kw: max_power,
    energy_kwh: max_energy
  };
}

/**
 * Calculate backup power requirements if backup is required
 * @param sizing_params - Sizing parameters
 * @param discharge_eff - Discharge efficiency
 * @returns Power and energy requirements for backup
 */
export function calculateBackupRequirementsIfNeeded(
  sizing_params?: SizingParams,
  discharge_eff: number = 0.95
): { power_kw: number, energy_kwh: number } {
  if (sizing_params?.backup_required) {
    const backupResult = calculateBackupRequirements(
      sizing_params,
      discharge_eff
    );
    
    console.log("Backup sizing:", backupResult);
    return {
      power_kw: backupResult.power_backup,
      energy_kwh: backupResult.energy_backup
    };
  }
  
  return { power_kw: 0, energy_kwh: 0 };
}

/**
 * Calculate peak shaving requirements if peak shaving is required
 * @param load_profile - Load profile data
 * @param sizing_params - Sizing parameters
 * @param tariff_structure - Tariff structure
 * @param discharge_eff - Discharge efficiency
 * @returns Power and energy requirements for peak shaving
 */
export function calculatePeakShavingRequirementsIfNeeded(
  load_profile: number[],
  sizing_params?: SizingParams,
  tariff_structure?: TariffStructure,
  discharge_eff: number = 0.95
): { power_kw: number, energy_kwh: number } {
  if (sizing_params?.peak_shaving_required) {
    // Calculate peak shaving configuration
    const peakShavingConfig = calculatePeakShavingConfig(
      tariff_structure,
      sizing_params,
      load_profile
    );
    
    // Calculate peak load demand and energy
    const peakAnalysis = analyzePeakPeriod(
      load_profile, 
      tariff_structure
    );
    
    console.log("Peak period analysis:", peakAnalysis);
    
    // Calculate peak shaving sizing
    const peakShavingResult = calculatePeakShavingSizing(
      load_profile,
      sizing_params,
      peakShavingConfig,
      peakAnalysis,
      discharge_eff
    );
    
    if (peakShavingResult.power_peak_shave > 0) {
      console.log("Peak shaving sizing:", peakShavingResult);
      return {
        power_kw: peakShavingResult.power_peak_shave,
        energy_kwh: peakShavingResult.energy_peak_shave
      };
    }
  }
  
  return { power_kw: 0, energy_kwh: 0 };
}

/**
 * Calculate arbitrage requirements if arbitrage is required
 * @param load_profile - Load profile data
 * @param pv_profile - PV profile data
 * @param sizing_params - Sizing parameters
 * @param tariff_structure - Tariff structure
 * @param bess_technical_params - Battery technical parameters
 * @param simulation_params - Simulation parameters
 * @returns Power and energy requirements for arbitrage
 */
export function calculateArbitrageRequirementsIfNeeded(
  load_profile: number[],
  pv_profile?: number[],
  sizing_params?: SizingParams,
  tariff_structure?: TariffStructure,
  bess_technical_params?: BessTechnicalParams,
  simulation_params?: SimulationParams
): { power_kw: number, energy_kwh: number } {
  if (sizing_params?.arbitrage_required || sizing_params?.pv_optim_required) {
    // Calculate peak shaving configuration for reference
    const peakShavingConfig = calculatePeakShavingConfig(
      tariff_structure,
      sizing_params,
      load_profile
    );
    
    // Calculate peak load demand and energy
    const peakAnalysis = analyzePeakPeriod(
      load_profile, 
      tariff_structure
    );
    
    // Get efficiencies
    const discharge_eff = bess_technical_params?.discharge_eff ?? 0.95;
    const charge_eff = bess_technical_params?.charge_eff ?? 0.95;
    
    const arbitrageResult = calculateArbitrageRequirements(
      load_profile,
      pv_profile,
      sizing_params,
      peakShavingConfig,
      peakAnalysis,
      discharge_eff,
      charge_eff,
      simulation_params
    );
    
    console.log("Arbitrage sizing:", arbitrageResult);
    return {
      power_kw: arbitrageResult.power_arbitrage,
      energy_kwh: arbitrageResult.energy_arbitrage
    };
  }
  
  return { power_kw: 0, energy_kwh: 0 };
}
