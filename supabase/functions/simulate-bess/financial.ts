
/**
 * Financial calculations for BESS simulation
 */
import { SimulationInput } from "./types.ts";
import { sum } from "./utils.ts";

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

/**
 * Calculate diesel replacement savings
 */
export function calculateDieselReplacementSavings(
  input: SimulationInput,
  dailyDieselAvoided: number // kWh per day
): {
  consumptionAvoided: number; // liters per year
  costAvoided: number; // R$ per year
  co2Avoided: number; // kg per year
  bessOpCost: number; // R$ per year
  netSavings: number; // R$ per year
} {
  const dieselParams = input.diesel_params;
  if (!dieselParams) {
    return {
      consumptionAvoided: 0,
      costAvoided: 0,
      co2Avoided: 0,
      bessOpCost: 0,
      netSavings: 0
    };
  }
  
  const {
    dieselCostPerLiter,
    dieselSpecificConsumption, // liters/kWh
    dieselCO2EmissionFactor, // kgCO2/liter
    dieselOperationalDays = 365
  } = dieselParams;
  
  // Calculate annual values
  const annualDieselEnergyAvoided = dailyDieselAvoided * dieselOperationalDays; // kWh/year
  const annualConsumptionAvoided = annualDieselEnergyAvoided * dieselSpecificConsumption; // liters/year
  const annualCostAvoided = annualConsumptionAvoided * dieselCostPerLiter; // R$/year
  const annualCO2Avoided = annualConsumptionAvoided * dieselCO2EmissionFactor; // kgCO2/year
  
  // Estimate BESS operational costs for diesel replacement (simplified)
  // Assuming grid electricity cost for charging and maintenance
  const { te_off, tusd_off } = input.tariff;
  const gridCostOffpeak = te_off + tusd_off; // R$/kWh
  const chargingCost = annualDieselEnergyAvoided * gridCostOffpeak; // R$/year
  const maintenanceCost = annualDieselEnergyAvoided * 0.01; // R$/year (1% of energy value)
  const bessOpCost = chargingCost + maintenanceCost; // R$/year
  
  // Calculate net savings
  const netSavings = annualCostAvoided - bessOpCost; // R$/year
  
  return {
    consumptionAvoided: annualConsumptionAvoided,
    costAvoided: annualCostAvoided,
    co2Avoided: annualCO2Avoided,
    bessOpCost,
    netSavings
  };
}
