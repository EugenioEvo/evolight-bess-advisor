
import { SimuladorFormValues } from "@/schemas/simuladorSchema";

/**
 * Build tariff structure parameters
 */
function buildTariffStructureParams(values: SimuladorFormValues) {
  // Determine the tariff modality based on form values
  const modality: "blue" | "green" | "conventional" = values.tarifaryGroup === "groupA" 
    ? (values.modalityA as "blue" | "green")
    : "conventional";
    
  // Garanta valores padrão para as horas de pico
  const peakStartHour = typeof values.peakStartHour === 'number' ? values.peakStartHour : 18;
  const peakEndHour = typeof values.peakEndHour === 'number' ? values.peakEndHour : 21;
    
  return {
    peak_start_hour: peakStartHour,
    peak_end_hour: peakEndHour,
    modality: modality
  };
}

/**
 * Build peak shaving parameters
 */
function buildPeakShavingParams(values: SimuladorFormValues) {
  let peakShavingTarget = 0;
  let peakReductionKw = 0;
  
  // Garanta valores padrão para as horas de peak shaving
  const peakShavingStartHour = typeof values.peakShavingStartHour === 'number' ? values.peakShavingStartHour : 18;
  const peakShavingEndHour = typeof values.peakShavingEndHour === 'number' ? values.peakShavingEndHour : 21;
  const peakShavingDurationHours = typeof values.peakShavingDurationHours === 'number' ? values.peakShavingDurationHours : 3;
  
  if (values.usePeakShaving) {
    // Para garantir que temos um valor válido para maxPeakDemandKw
    const maxPeakDemand = typeof values.maxPeakDemandKw === 'number' && values.maxPeakDemandKw > 0 
      ? values.maxPeakDemandKw 
      : (typeof values.avgPeakDemandKw === 'number' ? values.avgPeakDemandKw * 1.5 : 100);
      
    if (values.peakShavingMethod === 'percentage' && typeof values.peakShavingPercentage === 'number') {
      peakReductionKw = maxPeakDemand * (values.peakShavingPercentage / 100);
    } else if (values.peakShavingMethod === 'reduction' && typeof values.peakShavingTarget === 'number') {
      peakReductionKw = values.peakShavingTarget;
    } else if (values.peakShavingMethod === 'target' && typeof values.peakShavingTarget === 'number') {
      peakShavingTarget = values.peakShavingTarget;
    } else {
      // Valor padrão se nenhum método for especificado
      peakReductionKw = maxPeakDemand * 0.3; // 30% de redução por padrão
    }
  }

  return {
    peak_shaving_required: values.usePeakShaving,
    peak_shaving_target_kw: peakShavingTarget > 0 ? peakShavingTarget : undefined,
    peak_reduction_kw: peakReductionKw > 0 ? peakReductionKw : undefined,
    peak_shaving_start_hour: peakShavingStartHour,
    peak_shaving_end_hour: peakShavingEndHour,
    peak_shaving_duration_hours: peakShavingDurationHours,
  };
}

/**
 * Build backup parameters
 */
function buildBackupParams(values: SimuladorFormValues) {
  let criticalLoadKw = undefined;
  let backupDurationH = undefined;
  
  if (values.useBackup) {
    // Garanta valores padrão para carga crítica
    criticalLoadKw = typeof values.criticalLoadKw === 'number' && values.criticalLoadKw > 0 
      ? values.criticalLoadKw 
      : (typeof values.avgPeakDemandKw === 'number' ? values.avgPeakDemandKw * 0.5 : 50);
      
    // Garanta valores padrão para duração de backup
    backupDurationH = typeof values.backupDurationHours === 'number' && values.backupDurationHours > 0 
      ? values.backupDurationHours 
      : 2;
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
  // Calculate charge and discharge efficiencies separately
  // 95% default for each direction (charging and discharging)
  const ηc = values.chargeEff ?? 0.95;
  const ηd = values.dischargeEff ?? 0.95;
  const ηrt = ηc * ηd; // ~0.903 roundtrip efficiency
  
  return {
    discharge_eff: ηd,
    charge_eff: ηc,
    roundtrip_eff: ηrt
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
  
  // Certifique-se de que pelo menos uma estratégia está habilitada
  if (!values.usePeakShaving && !values.useArbitrage && !values.useBackup && !values.usePvOptim) {
    console.warn("Nenhuma estratégia de controle habilitada. Habilitando peak shaving por padrão.");
    peakShavingParams.peak_shaving_required = true;
    
    // Configurar valores padrão para peak shaving
    if (!peakShavingParams.peak_reduction_kw) {
      const defaultPeakDemand = typeof values.maxPeakDemandKw === 'number' && values.maxPeakDemandKw > 0 
        ? values.maxPeakDemandKw 
        : 100;
      peakShavingParams.peak_reduction_kw = defaultPeakDemand * 0.3; // 30% de redução
    }
  }
  
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
