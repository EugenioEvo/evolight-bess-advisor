
/**
 * Helper utility functions for BESS simulation
 */

// Helper functions for array calculations
export const sum = (arr: number[]): number => arr.reduce((a, b) => a + b, 0);

export const range = (start: number, end: number): number[] => {
  const result = [];
  for (let i = start; i <= end; i++) {
    result.push(i);
  }
  return result;
};

// Calculates required number of modules based on power and energy requirements
export const calculateModules = (
  powerNeeded: number, 
  energyNeeded: number, 
  modulePowerKw: number, 
  moduleEnergyKwh: number
): number => {
  const modulesByPower = Math.ceil(powerNeeded / modulePowerKw);
  const modulesByEnergy = Math.ceil(energyNeeded / moduleEnergyKwh);
  return Math.max(modulesByPower, modulesByEnergy, 1); // At least 1 module
};
