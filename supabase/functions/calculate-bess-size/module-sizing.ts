
// Module sizing functionality
import { BessSizeResult } from "./types.ts";

// BESS module specifications
const MODULE_POWER_KW = 108;
const MODULE_ENERGY_KWH = 215;

/**
 * Apply buffer factor and ensure minimum sizes for BESS
 * @param required_power_kw - The calculated required power
 * @param required_energy_kwh - The calculated required energy
 * @param buffer_factor - Optional buffer factor to apply (default: 1.1)
 * @returns The final power and energy with buffer and minimum thresholds applied
 */
export function applyBufferAndMinimumSizes(
  required_power_kw: number,
  required_energy_kwh: number,
  buffer_factor?: number
): BessSizeResult {
  // Apply buffer factor (default 10%)
  const buffer = buffer_factor || 1.1;
  let final_power_kw = required_power_kw * buffer;
  let final_energy_kwh = required_energy_kwh * buffer;

  // Ensure minimum sizes for practical deployments
  if (final_power_kw < 10.0) {
    final_power_kw = 10.0;
  }
  if (final_energy_kwh < 20.0) {
    final_energy_kwh = 20.0;
  }

  console.log("Final sizing after buffer:", { final_power_kw, final_energy_kwh });

  return {
    calculated_power_kw: final_power_kw,
    calculated_energy_kwh: final_energy_kwh
  };
}

/**
 * Apply indivisible module rule to BESS sizing
 * @param power_kw - The calculated power in kW
 * @param energy_kwh - The calculated energy in kWh
 * @returns The adjusted power and energy based on indivisible module sizes
 */
export function applyIndivisibleModuleRule(
  power_kw: number,
  energy_kwh: number
): BessSizeResult {
  // Calculate required number of modules (always round up to ensure capacity meets requirements)
  const modules_by_power = Math.ceil(power_kw / MODULE_POWER_KW);
  const modules_by_energy = Math.ceil(energy_kwh / MODULE_ENERGY_KWH);
  
  // Choose the larger number to ensure both power and energy requirements are met
  const required_modules = Math.max(modules_by_power, modules_by_energy);
  
  // Calculate final power and energy based on module count
  const adjusted_power_kw = required_modules * MODULE_POWER_KW;
  const adjusted_energy_kwh = required_modules * MODULE_ENERGY_KWH;
  
  console.log("Indivisible module sizing:", { 
    original_power_kw: power_kw, 
    original_energy_kwh: energy_kwh,
    modules_by_power,
    modules_by_energy,
    required_modules,
    adjusted_power_kw,
    adjusted_energy_kwh
  });
  
  return {
    calculated_power_kw: adjusted_power_kw,
    calculated_energy_kwh: adjusted_energy_kwh
  };
}
