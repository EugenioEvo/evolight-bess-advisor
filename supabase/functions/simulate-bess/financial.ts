
/**
 * Financial calculations for BESS simulation
 */
import { SimulationInput } from "./types.ts";

/**
 * Calculate annual savings based on simulation results
 */
export function calculateAnnualSavings(input: SimulationInput, peakShavingPower: number): number {
  const { tariff, load_profile, pv_profile } = input;
  const { te_peak, tusd_peak, te_off, tusd_off, tusd_demand } = tariff;
  
  let annualSavings = 0;
  
  // If we have a demand charge (group A)
  if (tusd_demand > 0 && peakShavingPower > 0) {
    // Annual demand charge savings
    annualSavings += peakShavingPower * tusd_demand * 12;
    console.log(`Demand savings: ${peakShavingPower} kW * ${tusd_demand} R$/kW·month * 12 months = ${peakShavingPower * tusd_demand * 12} R$`);
  }
  
  // If we have PV, calculate energy saved
  if (pv_profile && pv_profile.some(v => v > 0)) {
    const dailyPvEnergy = sum(pv_profile);
    const dailyLoadEnergy = sum(load_profile);
    const usablePvEnergy = Math.min(dailyPvEnergy, dailyLoadEnergy);
    
    // Calculate weighted average energy price
    const peakHours = input.tariff.peak_end - input.tariff.peak_start + 1;
    const offPeakHours = 24 - peakHours;
    const avgEnergyPrice = ((te_peak + tusd_peak) * peakHours + 
                           (te_off + tusd_off) * offPeakHours) / 24;
    
    // Annual energy savings (assuming 365 days)
    const annualEnergyKWh = usablePvEnergy * 365;
    annualSavings += annualEnergyKWh * avgEnergyPrice;
    
    console.log(`Energy savings: ${annualEnergyKWh} kWh * ${avgEnergyPrice} R$/kWh = ${annualEnergyKWh * avgEnergyPrice} R$`);
  }
  
  return annualSavings;
}
