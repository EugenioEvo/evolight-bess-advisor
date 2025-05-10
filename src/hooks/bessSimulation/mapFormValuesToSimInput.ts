
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
  
  // Calculate charge/discharge efficiency based on roundtrip efficiency
  const chargeEff = formValues.chargeEff ? formValues.chargeEff / 100 : 0.95;
  const dischargeEff = formValues.dischargeEff ? formValues.dischargeEff / 100 : 0.95;
  const roundEff = chargeEff * dischargeEff;
  
  // Calculate min SoC from DoD setting
  const minSoC = (100 - (formValues.bessMaxDod || 85)) / 100;
  
  // Format input structure according to the required format
  return {
    // Load and PV profiles
    load_profile: load,
    pv_profile: pv || null,
    
    // Tariff structure
    tariff: {
      peak_start: formValues.peakStartHour || 18,
      peak_end: formValues.peakEndHour || 21,
      te_peak: formValues.tePeak || 0.8,
      tusd_peak: formValues.tusdPeakKwh || 0,
      te_off: formValues.teOffpeak || 0.4,
      tusd_off: formValues.tusdOffpeakKwh || 0,
      tusd_demand: formValues.tusdPeakKw || 0
    },
    
    // Sizing parameters
    sizing: {
      backup_required: formValues.useBackup || false,
      critical_load_kw: formValues.criticalLoadKw || 0,
      backup_duration_h: formValues.backupDurationHours || 0,
      
      peak_shaving_required: formValues.usePeakShaving || false,
      ps_mode: formValues.peakShavingMethod === 'percentage' ? 'percent' : 
              formValues.peakShavingMethod === 'reduction' ? 'kw' : 'target',
      ps_value: formValues.peakShavingMethod === 'percentage' ? formValues.peakShavingPercentage || 30 : 
               formValues.peakShavingMethod === 'reduction' ? formValues.peakShavingTarget || 45 : 
               formValues.peakShavingTarget || 100,
      
      arbitrage_required: formValues.useArbitrage || false,
      pv_optim_required: formValues.usePvOptim || false,
      grid_zero: false,  // Default to false
      
      buffer_factor: 1.1  // Default buffer factor
    },
    
    // Technical parameters
    tech: {
      charge_eff: chargeEff,
      discharge_eff: dischargeEff,
      max_soc: 1.0,  // 100%
      min_soc: minSoC  // Convert DoD to min SoC
    },
    
    // Minimum demand settings
    min_peak_demand_kw: formValues.minPeakDemandKw || 0,
    min_offpeak_demand_kw: formValues.minOffpeakDemandKw || 0,
  };
}
