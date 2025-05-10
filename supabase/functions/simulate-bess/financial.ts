
/**
 * Financial calculations for BESS simulation
 */
import { SimulationInput, ChartDataPoint } from "./types.ts";
import { sum } from "./utils.ts";

/**
 * Calculate annual savings based on simulation results
 */
export function calculateAnnualSavings(
  input: SimulationInput, 
  peakShavingPowerKw: number,
  arbitrageReqs?: { energyKwh: number }, // Optional arbitrage requirements
  bessEnergyKwh?: number,               // Optional BESS energy capacity
  chargeEff?: number,                    // Optional charging efficiency
  dischargeEff?: number,                 // Optional discharging efficiency
  chartData?: ChartDataPoint[]           // Optional chart data for detailed calculations
): number {
  const { tariff, load_profile, pv_profile } = input;
  const { te_peak, tusd_peak, te_off, tusd_off, tusd_demand } = tariff;
  const { pv_optim_required, peak_shaving_required, arbitrage_required } = input.sizing;
  const operationalDays = input.diesel_params?.dieselOperationalDays || 365; // Use consistent operational days
  
  let annualSavings = 0;
  
  // 1. If we have a demand charge (group A)
  if (tusd_demand > 0 && peakShavingPowerKw > 0 && peak_shaving_required) {
    // Annual demand charge savings
    annualSavings += peakShavingPowerKw * tusd_demand * 12;
    console.log(`Demand savings: ${peakShavingPowerKw} kW * ${tusd_demand} R$/kW·month * 12 months = ${peakShavingPowerKw * tusd_demand * 12} R$`);
  }
  
  // 2. If we have PV, calculate energy saved
  if (pv_optim_required && pv_profile && pv_profile.some(v => v > 0)) {
    // Calculate hourly energy costs with and without PV
    let dailyGridEnergyCostWithoutPv = 0;
    let dailyGridEnergyCostWithPv = 0;
    
    for (let hour = 0; hour < 24; hour++) {
      const isPeakHour = hour >= input.tariff.peak_start && hour <= input.tariff.peak_end;
      const hourlyTariff = isPeakHour ? (te_peak + tusd_peak) : (te_off + tusd_off);
      
      dailyGridEnergyCostWithoutPv += Math.max(0, load_profile[hour]) * hourlyTariff;
      dailyGridEnergyCostWithPv += Math.max(0, load_profile[hour] - (pv_profile[hour] || 0)) * hourlyTariff;
    }
    
    const dailyPvSavings = dailyGridEnergyCostWithoutPv - dailyGridEnergyCostWithPv;
    annualSavings += dailyPvSavings * operationalDays;
    
    console.log(`PV energy savings: ${dailyPvSavings.toFixed(2)} R$/day * ${operationalDays} days = ${(dailyPvSavings * operationalDays).toFixed(2)} R$`);
  }
  
  // 3. Arbitrage Savings
  if (arbitrage_required && arbitrageReqs && bessEnergyKwh && chargeEff && dischargeEff) {
    const roundTripEff = chargeEff * dischargeEff;
    const costToChargeKwh = te_off + tusd_off; // Assuming charging happens at off-peak
    const valueOfDischargedKwh = te_peak + tusd_peak; // Assuming discharging at peak
    
    // Daily energy cycled (limited by BESS capacity and strategy)
    const dailyArbitrageEnergy = Math.min(
      arbitrageReqs.energyKwh, 
      bessEnergyKwh * 0.8 // Limiting to 80% of capacity as a practical constraint
    );
    
    // Profit per kWh effectively discharged for arbitrage
    const profitPerEffectiveKwhArbitrage = valueOfDischargedKwh - (costToChargeKwh / roundTripEff);
    
    if (profitPerEffectiveKwhArbitrage > 0) {
      const dailyArbitrageSavings = dailyArbitrageEnergy * profitPerEffectiveKwhArbitrage;
      annualSavings += dailyArbitrageSavings * operationalDays;
      
      console.log("Arbitrage Savings:", {
        dailyArbitrageEnergy: dailyArbitrageEnergy.toFixed(2) + " kWh",
        costToChargeKwh: costToChargeKwh.toFixed(2) + " R$/kWh",
        valueOfDischargedKwh: valueOfDischargedKwh.toFixed(2) + " R$/kWh",
        roundTripEff: roundTripEff.toFixed(2),
        profitPerEffectiveKwhArbitrage: profitPerEffectiveKwhArbitrage.toFixed(2) + " R$/kWh",
        dailyArbitrageSavings: dailyArbitrageSavings.toFixed(2) + " R$",
        annualArbitrageSavings: (dailyArbitrageSavings * operationalDays).toFixed(2) + " R$"
      });
    }
  }
  
  console.log(`Total annual savings: ${annualSavings.toFixed(2)} R$`);
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
  
  // Estimate BESS operational costs for diesel replacement
  const { te_off, tusd_off } = input.tariff;
  const gridCostOffpeak = te_off + tusd_off; // R$/kWh
  const roundTripEff = (input.tech.charge_eff || 0.95) * (input.tech.discharge_eff || 0.95);
  const chargingCost = annualDieselEnergyAvoided * (gridCostOffpeak / roundTripEff); // R$/year
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
