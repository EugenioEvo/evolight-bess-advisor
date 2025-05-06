
import { SimuladorFormValues } from "@/schemas/simuladorSchema";

/**
 * Build tariff structure parameters
 */
function buildTariffStructureParams(values: SimuladorFormValues) {
  // Determine the tariff modality based on form values
  const modality: "blue" | "green" | "conventional" = values.tarifaryGroup === "groupA" 
    ? (values.modalityA as "blue" | "green")
    : "conventional";
    
  return {
    peak_start_hour: values.peakStartHour,
    peak_end_hour: values.peakEndHour,
    modality: modality
  };
}

/**
 * Build peak shaving parameters
 */
function buildPeakShavingParams(values: SimuladorFormValues) {
  let peakShavingTarget = 0;
  let peakReductionKw = 0;
  
  if (values.usePeakShaving) {
    if (values.peakShavingMethod === 'percentage') {
      peakReductionKw = values.maxPeakDemandKw * (values.peakShavingPercentage / 100);
    } else if (values.peakShavingMethod === 'reduction') {
      peakReductionKw = values.peakShavingTarget;
    } else if (values.peakShavingMethod === 'target') {
      peakShavingTarget = values.peakShavingTarget;
    }
  }

  return {
    peak_shaving_required: values.usePeakShaving,
    peak_shaving_target_kw: peakShavingTarget > 0 ? peakShavingTarget : undefined,
    peak_reduction_kw: peakReductionKw > 0 ? peakReductionKw : undefined,
    peak_shaving_start_hour: values.peakShavingStartHour,
    peak_shaving_end_hour: values.peakShavingEndHour,
    peak_shaving_duration_hours: values.peakShavingDurationHours,
  };
}

/**
 * Build backup parameters
 */
function buildBackupParams(values: SimuladorFormValues) {
  let criticalLoadKw = undefined;
  let backupDurationH = undefined;
  
  if (values.useBackup) {
    criticalLoadKw = values.criticalLoadKw > 0 ? values.criticalLoadKw : values.avgPeakDemandKw * 0.5;
    backupDurationH = values.backupDurationHours > 0 ? values.backupDurationHours : 2;
  }

  return {
    backup_required: values.useBackup,
    critical_load_kw: criticalLoadKw,
    backup_duration_h: backupDurationH,
  };
}

/**
 * Build BESS technical parameters
 */
function buildBessTechnicalParams(values: SimuladorFormValues) {
  return {
    discharge_eff: Math.sqrt(values.bessEfficiency / 100),
    charge_eff: Math.sqrt(values.bessEfficiency / 100)
  };
}

/**
 * Build optimization strategy parameters
 */
function buildOptimizationParams(values: SimuladorFormValues) {
  return {
    arbitrage_required: values.useArbitrage,
    pv_optim_required: values.usePvOptim,
    grid_zero: values.pvPolicy === 'grid_zero',
    sizing_buffer_factor: 1.1
  };
}

/**
 * Build the parameters required for BESS sizing calculation
 */
export function buildSizingParams(values: SimuladorFormValues) {
  const tariffStructure = buildTariffStructureParams(values);
  const peakShavingParams = buildPeakShavingParams(values);
  const backupParams = buildBackupParams(values);
  const bessTechnicalParams = buildBessTechnicalParams(values);
  const optimizationParams = buildOptimizationParams(values);
  
  // Build and return the full parameter object
  return {
    load_profile: undefined, // Will be filled separately
    pv_profile: undefined, // Will be filled separately
    tariff_structure: tariffStructure,
    sizing_params: {
      ...backupParams,
      ...peakShavingParams,
      ...optimizationParams
    },
    bess_technical_params: bessTechnicalParams,
    simulation_params: {
      interval_minutes: 60
    }
  };
}
