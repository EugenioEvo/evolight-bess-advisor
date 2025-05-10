
/**
 * Configuration for BESS modules and capacity
 */

// BESS module specifications
export const MODULE_POWER_KW = 108;
export const MODULE_ENERGY_KWH = 215;

/**
 * Calculate the number of BESS modules required based on power and energy requirements
 */
export function calculateRequiredModules(powerKw: number, energyKwh: number): number {
  if (powerKw <= 0 || energyKwh <= 0) {
    return 1; // Minimum is one module
  }
  
  const byPower = Math.ceil(powerKw / MODULE_POWER_KW);
  const byEnergy = Math.ceil(energyKwh / MODULE_ENERGY_KWH);
  
  return Math.max(byPower, byEnergy);
}

/**
 * Calculate the actual power and energy capacity based on the number of modules
 */
export function calculateActualCapacity(modules: number) {
  return {
    powerKw: modules * MODULE_POWER_KW,
    energyKwh: modules * MODULE_ENERGY_KWH
  };
}
