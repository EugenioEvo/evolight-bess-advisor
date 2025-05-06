
/**
 * BESS module specifications
 * These constants define the standard size of battery modules used in the system
 */

// Standard module power in kilowatts (kW)
export const MODULE_POWER_KW = 108;

// Standard module energy in kilowatt-hours (kWh)
export const MODULE_ENERGY_KWH = 215;

// Calculate derived values
export const MODULE_RATIO = MODULE_ENERGY_KWH / MODULE_POWER_KW;

/**
 * Calculate the number of modules required based on power and energy requirements
 * @param powerKw - Required power in kW
 * @param energyKwh - Required energy in kWh
 * @returns The number of modules required
 */
export function calculateRequiredModules(powerKw: number, energyKwh: number): number {
  const modulesByPower = Math.ceil(powerKw / MODULE_POWER_KW);
  const modulesByEnergy = Math.ceil(energyKwh / MODULE_ENERGY_KWH);
  
  // Use the larger number of modules to ensure both power and energy requirements are met
  return Math.max(modulesByPower, modulesByEnergy, 1); // Ensure at least 1 module
}

/**
 * Calculate actual power and energy based on number of modules
 * @param modules - Number of BESS modules
 * @returns Object with actual power and energy values
 */
export function calculateActualCapacity(modules: number): { powerKw: number; energyKwh: number } {
  return {
    powerKw: modules * MODULE_POWER_KW,
    energyKwh: modules * MODULE_ENERGY_KWH
  };
}
