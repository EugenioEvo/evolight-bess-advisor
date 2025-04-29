import { SimuladorFormValues } from "@/schemas/simuladorSchema";

/**
 * Calculate annual savings based on simulation parameters
 */
export function calculateAnnualSavings(values: SimuladorFormValues, peakReduction: number): number {
  let annualSavings = 0;
  
  // Peak shaving savings (simplified)
  if (values.usePeakShaving) {
    annualSavings += peakReduction * values.tusdPeakKw * 12; // Monthly demand savings * 12
  }
  
  // Arbitrage savings (simplified)
  if (values.useArbitrage) {
    // Calculate daily energy cycled based on average peak and off-peak consumption
    const dailyPeakEnergy = values.avgDailyPeakConsumptionKwh > 0 
      ? values.avgDailyPeakConsumptionKwh 
      : values.avgPeakDemandKw * (values.peakEndHour - values.peakStartHour + 1);
      
    const dailyCycleEnergy = Math.min(dailyPeakEnergy * 0.7, values.bessCapacityKwh * 0.85);
    
    const energyPriceDiff = (values.tePeak + values.tusdPeakKwh) - 
                           (values.teOffpeak + values.tusdOffpeakKwh);
                           
    annualSavings += dailyCycleEnergy * energyPriceDiff * 22 * 12; // 22 business days/month
  }
  
  return annualSavings;
}

/**
 * Calculate financial metrics based on simulation results
 */
export function calculateFinancialMetrics(
  values: SimuladorFormValues, 
  powerKw: number, 
  energyKwh: number
) {
  // Calculate peak reduction
  const peakReduction = values.peakShavingMethod === 'percentage' 
    ? values.maxPeakDemandKw * (values.peakShavingPercentage / 100)
    : values.peakShavingTarget || values.maxPeakDemandKw * 0.3;
  
  // Calculate number of BESS units required
  const rawUnitsRequired = powerKw / 108;
  const bessUnitsRequired = rawUnitsRequired < 1 ? 1 : Math.floor(rawUnitsRequired);
  
  // Calculate total investment
  let totalInvestment = 0;
  
  if (values.capexCost > 0) {
    // If provided a manual total cost, use that value
    totalInvestment = values.capexCost;
  } else if (values.bessUnitCost > 0) {
    // If provided a cost per BESS unit, calculate based on number of units
    totalInvestment = bessUnitsRequired * values.bessUnitCost;
  } else {
    // Otherwise, use cost per kWh
    totalInvestment = energyKwh * (values.bessInstallationCost || 1500);
  }
  
  // Calculate annual savings
  const annualSavings = calculateAnnualSavings(values, peakReduction);
  
  // Calculate payback period
  const paybackYears = annualSavings > 0 ? totalInvestment / annualSavings : 0;
  
  // Calculate ROI
  const roi = (annualSavings * values.horizonYears) / totalInvestment * 100;
  
  // Determine if project is viable
  const isViable = paybackYears > 0 && paybackYears < values.horizonYears;
  
  return {
    paybackYears,
    annualSavings,
    roi,
    isViable,
    totalInvestment
  };
}
