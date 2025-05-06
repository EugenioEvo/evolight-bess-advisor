
// Peak shaving functionality
import { PeakShavingConfig, PeakAnalysisResult, SizingParams, TariffStructure, PeakShavingResult } from "./types.ts";

// Calculate peak shaving configuration based on parameters
export function calculatePeakShavingConfig(
  tariff_structure?: TariffStructure,
  sizing_params?: SizingParams,
  load_profile?: number[]
): PeakShavingConfig {
  const peak_shaving_start_hour = sizing_params?.peak_shaving_start_hour !== undefined ? 
    sizing_params.peak_shaving_start_hour : 
    tariff_structure?.peak_start_hour ?? 18;

  const peak_shaving_end_hour = sizing_params?.peak_shaving_end_hour !== undefined ? 
    sizing_params.peak_shaving_end_hour : 
    tariff_structure?.peak_end_hour ?? 21;

  const peak_shaving_hours = peak_shaving_end_hour - peak_shaving_start_hour + 1;
  
  // Use specified duration if available, or use the calculated hours if not
  const peak_shaving_duration_hours = sizing_params?.peak_shaving_duration_hours !== undefined ? 
    sizing_params.peak_shaving_duration_hours : peak_shaving_hours;
  
  // Limit the duration to the available hours
  const effective_peak_shaving_hours = Math.min(peak_shaving_duration_hours, peak_shaving_hours);

  console.log("Peak shaving schedule:", {
    peak_shaving_start_hour,
    peak_shaving_end_hour, 
    peak_shaving_hours,
    peak_shaving_duration_hours,
    effective_peak_shaving_hours
  });

  return {
    peak_shaving_start_hour,
    peak_shaving_end_hour,
    peak_shaving_hours,
    effective_peak_shaving_hours,
    peak_shaving_duration_hours,
    peak_load_after_shaving: 0, // Will be updated later if needed
    power_peak_shave: 0, // Will be updated later if needed
    energy_peak_shave: 0 // Will be updated later if needed
  };
}

// Analyze the load profile to find peak period indices and statistics
export function analyzePeakPeriod(
  load_profile: number[],
  tariff_structure?: TariffStructure
): PeakAnalysisResult {
  const max_load = Math.max(...load_profile);
  let peakPeriodIndices: number[] = [];
  let peakHoursTotal = 0;
  let peakEnergyTotal = 0;

  // Default peak hours if tariff structure is undefined
  const peak_start_hour = tariff_structure?.peak_start_hour ?? 18;
  const peak_end_hour = tariff_structure?.peak_end_hour ?? 21;

  // Determine peak period hours
  for (let hour = 0; hour < load_profile.length; hour++) {
    if (hour >= peak_start_hour && hour <= peak_end_hour) {
      peakPeriodIndices.push(hour);
      peakHoursTotal++;
      peakEnergyTotal += load_profile[hour];
    }
  }

  const avg_peak_load = peakEnergyTotal / Math.max(peakHoursTotal, 1); // Avoid division by zero
  const max_peak_load = Math.max(...peakPeriodIndices.map(i => load_profile[i]), 0);

  return {
    peakPeriodIndices,
    peakHoursTotal,
    peakEnergyTotal,
    avg_peak_load,
    max_peak_load
  };
}

// Calculate peak shaving power and energy requirements
export function calculatePeakShavingSizing(
  load_profile: number[],
  sizing_params?: SizingParams,
  peakShavingConfig?: PeakShavingConfig,
  peakAnalysis?: PeakAnalysisResult,
  discharge_eff: number = 0.95
): PeakShavingResult {
  const max_load = Math.max(...load_profile);
  let power_peak_shave = 0;
  let energy_peak_shave = 0;
  let peak_load_after_shaving = max_load;

  // Determine how much power to shave
  if (sizing_params?.peak_reduction_kw && sizing_params.peak_reduction_kw > 0) {
    power_peak_shave = sizing_params.peak_reduction_kw;
    peak_load_after_shaving = max_load - power_peak_shave;
  } else if (sizing_params?.peak_shaving_target_kw && max_load > sizing_params.peak_shaving_target_kw) {
    power_peak_shave = max_load - sizing_params.peak_shaving_target_kw;
    peak_load_after_shaving = sizing_params.peak_shaving_target_kw;
  } else {
    // Default to 30% reduction if no target specified
    power_peak_shave = max_load * 0.3;
    peak_load_after_shaving = max_load * 0.7;
  }

  // Check if peak shaving is very high (>90% of max load)
  const peak_shaving_percentage = power_peak_shave / max_load * 100;
  const isHighPeakShaving = peak_shaving_percentage > 90;

  // Calculate energy needs for peak shaving
  if (isHighPeakShaving && peakAnalysis) {
    // For very high peak shaving, consider the entire peak energy
    energy_peak_shave = peakAnalysis.peakEnergyTotal / discharge_eff;
    console.log("High peak shaving (>90%) - using entire peak energy:", { energy_peak_shave });
  } else if (peakShavingConfig) {
    // Regular calculation - peak shave power * duration
    energy_peak_shave = (power_peak_shave * peakShavingConfig.effective_peak_shaving_hours) / discharge_eff;
  }

  // Update peakShavingConfig with calculated values if it exists
  if (peakShavingConfig) {
    peakShavingConfig.power_peak_shave = power_peak_shave;
    peakShavingConfig.energy_peak_shave = energy_peak_shave;
    peakShavingConfig.peak_load_after_shaving = peak_load_after_shaving;
  }

  return { 
    power_peak_shave, 
    energy_peak_shave,
    peak_shaving_percentage,
    isHighPeakShaving,
    max_load,
    peak_load_after_shaving
  };
}
