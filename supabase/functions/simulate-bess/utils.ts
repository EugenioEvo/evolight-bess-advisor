
/**
 * Utility functions for BESS simulation
 */

/**
 * Calculate sum of array values
 */
export function sum(array: number[]): number {
  return array.reduce((total, current) => total + current, 0);
}

/**
 * Generate an inclusive range of numbers
 */
export function range(start: number, end: number): number[] {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

/**
 * Calculate the number of modules required based on power and energy needs
 */
export function calculateModules(
  powerKw: number,
  energyKwh: number,
  modulePowerKw: number,
  moduleEnergyKwh: number
): number {
  const byPower = Math.ceil(powerKw / modulePowerKw);
  const byEnergy = Math.ceil(energyKwh / moduleEnergyKwh);
  return Math.max(byPower, byEnergy);
}
