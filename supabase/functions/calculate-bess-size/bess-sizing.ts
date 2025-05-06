
// Main BESS sizing calculation logic
import { TariffStructure, SizingParams, BessTechnicalParams, SimulationParams, BessSizeResult } from "./types.ts";
import { 
  combineRequirements, 
  calculateBackupRequirementsIfNeeded, 
  calculatePeakShavingRequirementsIfNeeded, 
  calculateArbitrageRequirementsIfNeeded 
} from "./requirement-handler.ts";
import { 
  applyBufferAndMinimumSizes, 
  applyIndivisibleModuleRule 
} from "./module-sizing.ts";

/**
 * Main calculation function that coordinates all sizing logic
 * @param load_profile - Load profile data 
 * @param pv_profile - PV profile data
 * @param tariff_structure - Tariff structure
 * @param sizing_params - Sizing parameters
 * @param bess_technical_params - Battery technical parameters
 * @param simulation_params - Simulation parameters
 * @returns The calculated BESS size
 */
export function calculateBessSize(
  load_profile: number[], 
  pv_profile?: number[],
  tariff_structure?: TariffStructure,
  sizing_params?: SizingParams,
  bess_technical_params?: BessTechnicalParams,
  simulation_params?: SimulationParams
): BessSizeResult {
  console.log("Starting BESS sizing calculation with parameters:", { 
    sizing_params,
    tariff_structure,
    bess_technical_params,
    load_profile_length: load_profile?.length,
    pv_profile_length: pv_profile?.length
  });
  
  // Get efficiencies from parameters or use defaults
  const discharge_eff = bess_technical_params?.discharge_eff ?? 0.95;
  
  // Track requirements from each sizing strategy
  const powerRequirements: { value: number, source: string }[] = [];
  const energyRequirements: { value: number, source: string }[] = [];

  // 1. Backup sizing
  const backupReq = calculateBackupRequirementsIfNeeded(sizing_params, discharge_eff);
  if (backupReq.power_kw > 0 || backupReq.energy_kwh > 0) {
    powerRequirements.push({ value: backupReq.power_kw, source: "backup" });
    energyRequirements.push({ value: backupReq.energy_kwh, source: "backup" });
  }

  // 2. Peak Shaving sizing
  const peakShavingReq = calculatePeakShavingRequirementsIfNeeded(
    load_profile, 
    sizing_params,
    tariff_structure,
    discharge_eff
  );
  if (peakShavingReq.power_kw > 0 || peakShavingReq.energy_kwh > 0) {
    powerRequirements.push({ value: peakShavingReq.power_kw, source: "peak_shaving" });
    energyRequirements.push({ value: peakShavingReq.energy_kwh, source: "peak_shaving" });
  }

  // 3. Arbitrage sizing
  const arbitrageReq = calculateArbitrageRequirementsIfNeeded(
    load_profile,
    pv_profile,
    sizing_params,
    tariff_structure,
    bess_technical_params,
    simulation_params
  );
  if (arbitrageReq.power_kw > 0 || arbitrageReq.energy_kwh > 0) {
    powerRequirements.push({ value: arbitrageReq.power_kw, source: "arbitrage" });
    energyRequirements.push({ value: arbitrageReq.energy_kwh, source: "arbitrage" });
  }

  // Combine requirements and find final sizing
  const { power_kw, energy_kwh } = combineRequirements(powerRequirements, energyRequirements);
  
  console.log("Combined requirements:", { power_kw, energy_kwh });

  // Apply buffer factor and ensure minimum sizes
  const bufferedResult = applyBufferAndMinimumSizes(
    power_kw,
    energy_kwh,
    sizing_params?.sizing_buffer_factor
  );
  
  // Apply indivisible module rule
  const finalResult = applyIndivisibleModuleRule(
    bufferedResult.final_power_kw,
    bufferedResult.final_energy_kwh
  );
  
  return {
    calculated_power_kw: finalResult.final_power_kw,
    calculated_energy_kwh: finalResult.final_energy_kwh
  };
}
