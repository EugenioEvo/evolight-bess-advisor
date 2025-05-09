
/**
 * Types for the simulation results and related data
 */

export type SimulationResults = {
  calculatedPowerKw: number;
  calculatedEnergyKwh: number;
  paybackYears?: number;
  annualSavings?: number;
  roi?: number;
  npv?: number;
  isViable?: boolean;
  dispatch24h?: any[];
};

export type SimulationResponse = {
  success: boolean;
  results?: SimulationResults;
  error?: Error;
};
