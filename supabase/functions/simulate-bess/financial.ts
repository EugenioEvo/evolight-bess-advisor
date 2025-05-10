
/**
 * Financial calculations for BESS simulations
 */
import { sum } from "./utils.ts";
import { SimulationInput } from "./types.ts";

/**
 * Calculate annual savings from BESS installation
 */
export function calculateAnnualSavings(
  input: SimulationInput,
  peakShavingPowerKw: number
): number {
  const { te_peak, tusd_demand } = input.tariff;
  const { pv_optim_required, peak_shaving_required } = input.sizing;
  const pv_profile = input.pv_profile || Array(24).fill(0);
  const load_profile = input.load_profile;
  
  let annualSavings = 0;

  // 1. Energy cost savings from PV self-consumption
  if (pv_optim_required && input.pv_profile) {
    // Calculate self-consumed PV energy
    const pvSelfConsumption = Math.min(sum(pv_profile), sum(load_profile));
    const gridEnergyReduction = pvSelfConsumption;
    annualSavings += gridEnergyReduction * te_peak * 365; // Simplified calculation
  }

  // 2. Demand charge savings (Group A tariffs)
  if (tusd_demand > 0 && peak_shaving_required) {
    annualSavings += peakShavingPowerKw * tusd_demand * 12; // Monthly demand charge savings over a year
  }

  console.log("Annual savings:", { annualSavings });
  
  return annualSavings;
}
