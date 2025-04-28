
import { SimuladorFormValues } from "@/schemas/simuladorSchema";

export function generateCashFlowData(
  formValues: SimuladorFormValues, 
  calculatedEnergyKwh: number, 
  annualSavings?: number
) {
  const costPerKwh = formValues.bessInstallationCost || 1500;
  const totalInvestment = calculatedEnergyKwh * costPerKwh;
  const savings = annualSavings || 0;
  
  const yearlyData = [];
  let cumulativeCashFlow = -totalInvestment;
  
  for (let year = 0; year <= formValues.horizonYears; year++) {
    if (year === 0) {
      yearlyData.push({
        year,
        cashFlow: -totalInvestment,
        cumulative: cumulativeCashFlow
      });
      continue;
    }
    
    // Account for annual adjustments
    const yearlyInflationFactor = Math.pow(1 + formValues.annualTariffAdjustment/100, year-1);
    const yearlyCashFlow = savings * yearlyInflationFactor;
    cumulativeCashFlow += yearlyCashFlow;
    
    yearlyData.push({
      year,
      cashFlow: parseFloat(yearlyCashFlow.toFixed(2)),
      cumulative: parseFloat(cumulativeCashFlow.toFixed(2))
    });
  }
  
  return yearlyData;
}
