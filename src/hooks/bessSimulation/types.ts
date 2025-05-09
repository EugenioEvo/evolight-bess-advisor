
/**
 * Types for BESS simulation data structures
 */

export interface BessDispatchPoint {
  hour: number;
  load: number;
  pv: number;
  diesel: number;
  charge: number;
  discharge: number;
  grid: number;
  soc: number;
  dieselRef: number;
}

export interface BessSimulationResult {
  modules: number;
  bessPowerKw: number;
  bessEnergyKwh: number;
  kpiAnnual: number;
  dispatch24h: BessDispatchPoint[];
  needPower: number;
  needEnergy: number;
  psPower: number;
  arbPower: number;
  psEnergy: number;
  arbEnergy: number;
  isSuccess: boolean;
  error?: string;
}

export interface BessSimulationInput {
  load: number[];
  pv?: number[];
  peakStart: number;
  peakEnd: number;
  tePeak: number;
  tusdPeak: number;
  teOff: number;
  tusdOff: number;
  tusdDemand: number;
  usePS: boolean;
  psMode: "percent" | "kw" | "target";
  psValue: number;
  useARB: boolean;
  modulePower: number;
  moduleEnergy: number;
  chargeEff: number;
  dischargeEff: number;
  roundEff: number;
  maxSoC: number;
  minSoC: number;
  chargeWindow: number[];
}
