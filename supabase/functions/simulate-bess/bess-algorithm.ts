
/**
 * BESS algorithm main file - coordinates the simulation process
 */
import { sum, range, calculateModules } from "./utils.ts";
import { MODULE_POWER_KW, MODULE_ENERGY_KWH, MIN_POWER_KW, MIN_ENERGY_KWH } from "./constants.ts";
import { SimulationInput, SimulationResults } from "./types.ts";
import { 
  calculateBackupRequirements, 
  calculatePeakShavingRequirements, 
  calculateArbitrageRequirements 
} from "./strategies.ts";
import { calculateAnnualSavings } from "./financial.ts";
import { generateDispatchData } from "./dispatch.ts";

/**
 * Main simulation function for battery energy storage systems (BESS)
 */
export function simulateBESS(input: SimulationInput): SimulationResults {
  // 1. Set up default values
  const load_profile = input.load_profile || Array(24).fill(100);
  const pv_profile = input.pv_profile || Array(24).fill(0);
  const peak_start = input.tariff.peak_start || 18;
  const peak_end = input.tariff.peak_end || 21;
  
  // 2. Identify peak hours and calculate max load during peak hours
  const peak_hours = range(peak_start, peak_end);
  const peak_loads = peak_hours.map(hour => load_profile[hour] || 0);
  const max_load = Math.max(...peak_loads);
  const avg_load = sum(peak_loads) / peak_loads.length;
  
  // 3. Calculate individual strategy requirements
  const backupReqs = calculateBackupRequirements(input);
  const peakShavingReqs = calculatePeakShavingRequirements(input, peak_hours, peak_loads, max_load);
  const arbitrageReqs = calculateArbitrageRequirements(input, peak_hours, peak_loads, avg_load, peakShavingReqs);
  
  // 4. Calculate envelope (maximum requirements)
  const power_need = Math.max(backupReqs.powerKw, peakShavingReqs.powerKw, arbitrageReqs.powerKw);
  const energy_need = Math.max(backupReqs.energyKwh, peakShavingReqs.energyKwh, arbitrageReqs.energyKwh);
  
  console.log("Combined requirements:", { power_need, energy_need });
  
  // 5. Apply buffer and minimum sizes
  const buffer_factor = input.sizing.buffer_factor || 1.1;
  const power_buf = Math.max(power_need * buffer_factor, MIN_POWER_KW);
  const energy_buf = Math.max(energy_need * buffer_factor, MIN_ENERGY_KWH);
  
  console.log("After buffer:", { power_buf, energy_buf });
  
  // 6. Calculate number of modules needed
  const n_modules = calculateModules(power_buf, energy_buf, MODULE_POWER_KW, MODULE_ENERGY_KWH);
  
  // 7. Calculate final BESS power and energy
  const bess_power_kw = n_modules * MODULE_POWER_KW;
  const bess_energy_kwh = n_modules * MODULE_ENERGY_KWH;
  
  console.log("Final BESS sizing:", { 
    n_modules, 
    bess_power_kw, 
    bess_energy_kwh, 
    by_power: Math.ceil(power_buf / MODULE_POWER_KW),
    by_energy: Math.ceil(energy_buf / MODULE_ENERGY_KWH)
  });
  
  // 8. Calculate financial KPIs
  const annual_savings = calculateAnnualSavings(input, peakShavingReqs.powerKw);
  
  // 9. Generate 24h dispatch data for chart
  const chartData = generateDispatchData(input, bess_power_kw, bess_energy_kwh);
  
  return {
    modules: n_modules,
    bessPowerKw: bess_power_kw,
    bessEnergyKwh: bess_energy_kwh,
    annualSavingsR$: annual_savings,
    chartData
  };
}
