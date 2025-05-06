
// Main BESS sizing calculation logic
import { TariffStructure, SizingParams, BessTechnicalParams, SimulationParams, BessSizeResult } from "./types.ts";
import { calculateBackupRequirements } from "./backup.ts";
import { calculatePeakShavingConfig, analyzePeakPeriod, calculatePeakShavingSizing } from "./peak-shaving.ts";
import { calculateArbitrageRequirements } from "./arbitrage.ts";

// Apply buffer factor and ensure minimum sizes
export function applyBufferAndMinimumSizes(
  required_power_kw: number,
  required_energy_kwh: number,
  buffer_factor?: number
): BessSizeResult {
  // Apply buffer factor
  const buffer = buffer_factor || 1.1;
  let final_power_kw = required_power_kw * buffer;
  let final_energy_kwh = required_energy_kwh * buffer;

  // Ensure minimum sizes
  if (final_power_kw <= 0 || final_energy_kwh <= 0) {
    final_power_kw = Math.max(final_power_kw, 10.0);
    final_energy_kwh = Math.max(final_energy_kwh, 20.0);
    console.log("Applied minimum sizes");
  }
  
  console.log("Final sizing:", { final_power_kw, final_energy_kwh });
  
  return { final_power_kw, final_energy_kwh };
}

// Main calculation function that coordinates all sizing logic
export function calculateBessSize(
  load_profile: number[], 
  pv_profile?: number[],
  tariff_structure?: TariffStructure,
  sizing_params?: SizingParams,
  bess_technical_params?: BessTechnicalParams,
  simulation_params?: SimulationParams
): BessSizeResult {
  // Initialize requirements
  let required_power_kw = 0;
  let required_energy_kwh = 0;

  // Get efficiencies
  const discharge_eff = bess_technical_params?.discharge_eff ?? 0.95;
  const charge_eff = bess_technical_params?.charge_eff ?? 0.95;

  // Calculate peak shaving configuration
  const peakShavingConfig = calculatePeakShavingConfig(
    tariff_structure,
    sizing_params,
    load_profile
  );

  // 1. Backup sizing
  if (sizing_params?.backup_required) {
    const backupResult = calculateBackupRequirements(
      sizing_params,
      discharge_eff
    );
    
    required_power_kw = Math.max(required_power_kw, backupResult.power_backup);
    required_energy_kwh = Math.max(required_energy_kwh, backupResult.energy_backup);
    
    console.log("Backup sizing:", backupResult);
  }

  // 2. Calculate peak load demand and energy
  const peakAnalysis = analyzePeakPeriod(
    load_profile, 
    tariff_structure
  );
  
  console.log("Peak period analysis:", peakAnalysis);

  // 3. Peak Shaving sizing with improvements
  if (sizing_params?.peak_shaving_required) {
    const peakShavingResult = calculatePeakShavingSizing(
      load_profile,
      sizing_params,
      peakShavingConfig,
      peakAnalysis,
      discharge_eff
    );
    
    if (peakShavingResult.power_peak_shave > 0) {
      required_power_kw = Math.max(required_power_kw, peakShavingResult.power_peak_shave);
      required_energy_kwh = Math.max(required_energy_kwh, peakShavingResult.energy_peak_shave);
      
      console.log("Peak shaving sizing:", peakShavingResult);
    }
  }

  // 4. PV Optimization / Arbitrage sizing
  if (sizing_params?.arbitrage_required) {
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
    
    required_power_kw = Math.max(required_power_kw, arbitrageResult.power_arbitrage);
    required_energy_kwh = Math.max(required_energy_kwh, arbitrageResult.energy_arbitrage);
    
    console.log("Final arbitrage sizing:", arbitrageResult);
  }

  console.log("Initial sizing:", { required_power_kw, required_energy_kwh });

  // Apply buffer factor and ensure minimum sizes
  return applyBufferAndMinimumSizes(
    required_power_kw,
    required_energy_kwh,
    sizing_params?.sizing_buffer_factor
  );
}
