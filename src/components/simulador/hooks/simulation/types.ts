
/**
 * Types for the simulation results and related data
 */

import { BessDispatchPoint } from "@/hooks/bessSimulation/types";

export type SimulationResults = {
  calculatedPowerKw: number;
  calculatedEnergyKwh: number;
  paybackYears?: number;
  annualSavings?: number;
  roi?: number;
  npv?: number;
  isViable?: boolean;
  dispatch24h?: BessDispatchPoint[];
};

export type SimulationResponse = {
  success: boolean;
  results?: SimulationResults;
  error?: Error | string | any;
};
