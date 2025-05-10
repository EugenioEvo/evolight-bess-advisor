
import { SimuladorFormValues } from "@/schemas/simuladorSchema";

/**
 * Maps form values to the simulation input format expected by the 'simulate-bess' edge function
 */
export function mapFormValuesToSimInput(formValues: SimuladorFormValues) {
  // Generate 24-hour load profile
  const load = Array.from({ length: 24 }).map((_, hour) => {
    if (formValues.loadEntryMethod === "hourly" && 
        Array.isArray(formValues.hourlyDemandKw) && 
        formValues.hourlyDemandKw.length > hour) {
      return formValues.hourlyDemandKw[hour] || 0;
    }
    
    // Synthetic profile
    const isPeakHour = hour >= (formValues.peakStartHour || 18) && hour <= (formValues.peakEndHour || 21);
    
    if (isPeakHour) {
      return formValues.maxPeakDemandKw || 150;
    } else {
      return formValues.maxOffpeakDemandKw || 100;
    }
  });
  
  // Generate PV profile if applicable
  let pv;
  if (formValues.hasPv && formValues.pvPowerKwp) {
    pv = Array.from({ length: 24 }).map((_, hour) => {
      if (hour >= 6 && hour <= 18) {
        // Simple bell curve for solar production
        return formValues.pvPowerKwp! * Math.sin((hour - 6) / 12 * Math.PI);
      }
      return 0;
    });
  }
  
  // Calculate chargeEff and dischargeEff based on roundtrip efficiency
  // Default roundtrip efficiency is 0.913 = 0.956 * 0.956
  const roundEff = formValues.bessRoundTripEff || 0.913;
  // Individual efficiency is the square root of roundtrip efficiency
  const singleEff = Math.sqrt(roundEff);
  
  return {
    // Load and PV profiles
    load,
    pv,
    
    // Peak window settings
    peakStart: formValues.peakStartHour || 18,
    peakEnd: formValues.peakEndHour || 21,
    
    // Tariff data
    tePeak: formValues.tariffEnergyPeakRate || 0.8,
    tusdPeak: formValues.tariffDemandPeakRate || 0.2,
    teOff: formValues.tariffEnergyOffpeakRate || 0.4,
    tusdOff: formValues.tariffDemandOffpeakRate || 0.1,
    tusdDemand: formValues.tariffDemandChargeRate || 50,
    
    // Control strategies
    usePS: formValues.usePeakShaving || false,
    psMode: formValues.peakShavingMethod === 'percentage' ? 'percent' : 
            formValues.peakShavingMethod === 'kw' ? 'kw' : 'target',
    psValue: formValues.peakShavingMethod === 'percentage' ? formValues.peakShavingPercentage || 30 : 
             formValues.peakShavingMethod === 'kw' ? formValues.peakShavingTarget || 45 : 
             formValues.peakShavingTarget || 100,
    useARB: formValues.useArbitrage || false,
    
    // BESS parameters - using individual efficiencies for charge and discharge
    modulePower: 108,
    moduleEnergy: 215,
    chargeEff: singleEff,
    dischargeEff: singleEff,
    roundEff: roundEff,
    maxSoC: 1.0,  // 100%
    minSoC: (100 - (formValues.bessMaxDod || 85)) / 100,  // Convert DoD to min SoC
    chargeWindow: [1, 5],
    
    // Incluindo a modalidade tarifária que estava faltando
    tariffModality: formValues.tariffModality || "green"
  };
}
