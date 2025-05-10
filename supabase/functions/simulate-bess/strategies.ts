/**
 * BESS sizing strategies calculations
 */
import { sum, range } from "./utils.ts";
import { SimulationInput, StrategyRequirements } from "./types.ts";

/**
 * Calculate backup strategy requirements
 */
export function calculateBackupRequirements(input: SimulationInput): StrategyRequirements {
  const { discharge_eff } = input.tech;
  const { critical_load_kw, backup_duration_h, backup_required } = input.sizing;

  if (!backup_required || critical_load_kw <= 0) {
    return { powerKw: 0, energyKwh: 0 };
  }

  const powerKw = critical_load_kw;
  const energyKwh = powerKw * backup_duration_h / discharge_eff;

  console.log("Backup sizing:", { powerKw, energyKwh });
  
  return { powerKw, energyKwh };
}

/**
 * Calculate peak shaving strategy requirements
 */
export function calculatePeakShavingRequirements(
  input: SimulationInput,
  peakHours: number[],
  peakLoads: number[],
  maxLoad: number
): StrategyRequirements {
  const { discharge_eff } = input.tech;
  const { peak_shaving_required, ps_mode, ps_value } = input.sizing;

  if (!peak_shaving_required) {
    return { powerKw: 0, energyKwh: 0 };
  }

  // Calculate peak shaving power based on mode
  let powerKw = 0;
  
  switch (ps_mode) {
    case "percent":
      powerKw = maxLoad * ps_value / 100;
      break;
    case "kw":
      powerKw = ps_value;
      break;
    case "target":
      powerKw = Math.max(0, maxLoad - ps_value);
      break;
  }

  // Ensure power doesn't exceed max_load
  powerKw = Math.min(powerKw, maxLoad);

  // Calculate energy needed for peak shaving
  const pctReduction = powerKw / maxLoad;
  
  let energyKwh;
  if (pctReduction > 0.9) {
    // If reduction is very high, use total peak energy
    energyKwh = sum(peakLoads) / discharge_eff;
  } else {
    // Otherwise use power * hours approach
    energyKwh = powerKw * peakHours.length / discharge_eff;
  }

  console.log("Peak shaving sizing:", { powerKw, energyKwh, pctReduction });
  
  return { powerKw, energyKwh };
}

/**
 * Calculate arbitrage strategy requirements
 */
export function calculateArbitrageRequirements(
  input: SimulationInput,
  peakHours: number[],
  peakLoads: number[],
  avgLoad: number,
  peakShavingReqs: StrategyRequirements
): StrategyRequirements {
  const { discharge_eff, charge_eff } = input.tech;
  const { arbitrage_required, peak_shaving_required, pv_optim_required } = input.sizing;
  const pv_profile = input.pv_profile || Array(24).fill(0);
  
  if (!arbitrage_required) {
    return { powerKw: 0, energyKwh: 0 };
  }

  let powerKw = 0;
  let energyKwh = 0;

  if (peak_shaving_required) {
    // If peak shaving is active, use its power capacity
    powerKw = peakShavingReqs.powerKw;

    // Calculate remaining peak energy after peak shaving
    const peakEnergy = sum(peakLoads);
    const peakShavingEnergy = peakShavingReqs.powerKw * peakHours.length;
    const remainingEnergy = Math.max(0, peakEnergy - peakShavingEnergy);

    // Energy needed for arbitrage (considering discharge efficiency)
    energyKwh = remainingEnergy / discharge_eff;
  } else {
    // If no peak shaving, use 80% of average peak load
    powerKw = avgLoad * 0.8;
    energyKwh = powerKw * peakHours.length / discharge_eff;
  }

  console.log("Arbitrage basic sizing:", { powerKw, energyKwh });

  // PV optimization (if enabled)
  if (pv_optim_required && input.pv_profile) {
    const totalPv = sum(pv_profile);
    const totalLoad = sum(input.load_profile);
    const surplus = Math.max(0, totalPv - totalLoad);

    if (surplus > 0) {
      // Energy needed to store surplus (considering charge efficiency)
      const surplusEnergy = surplus / charge_eff;

      // Update arbitrage requirements if surplus is larger
      if (surplusEnergy > energyKwh) {
        energyKwh = surplusEnergy;
        // Assume surplus distributed over 4 hours minimum
        powerKw = Math.max(powerKw, surplus / 4);
      }

      console.log("PV optimization sizing:", { surplus, surplusEnergy });
    }
  }

  return { powerKw, energyKwh };
}
