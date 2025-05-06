
// Types and interfaces for BESS sizing calculation

export interface TariffStructure {
  peak_start_hour: number;
  peak_end_hour: number;
  modality: "blue" | "green" | "conventional";
}

export interface SizingParams {
  backup_required: boolean;
  critical_load_kw?: number;
  backup_duration_h?: number;
  peak_shaving_required: boolean;
  peak_shaving_target_kw?: number;
  peak_reduction_kw?: number;
  peak_shaving_start_hour?: number;
  peak_shaving_end_hour?: number;
  peak_shaving_duration_hours?: number;
  arbitrage_required: boolean;
  pv_optim_required: boolean;
  grid_zero: boolean;
  sizing_buffer_factor?: number;
}

export interface BessTechnicalParams {
  discharge_eff: number;
  charge_eff: number;
}

export interface SimulationParams {
  interval_minutes: number;
}

export interface RequestBody {
  load_profile: number[];
  pv_profile?: number[];
  tariff_structure: TariffStructure;
  sizing_params: SizingParams;
  bess_technical_params: BessTechnicalParams;
  simulation_params: SimulationParams;
}

export interface PeakShavingConfig {
  peak_shaving_start_hour: number;
  peak_shaving_end_hour: number;
  peak_shaving_hours: number;
  effective_peak_shaving_hours: number;
  peak_shaving_duration_hours: number;
  peak_load_after_shaving: number;
  power_peak_shave: number;
  energy_peak_shave: number;
}

export interface PeakAnalysisResult {
  peakPeriodIndices: number[];
  peakHoursTotal: number;
  peakEnergyTotal: number;
  avg_peak_load: number;
  max_peak_load: number;
}

export interface BessSizeResult {
  final_power_kw: number;
  final_energy_kwh: number;
}

export interface BackupResult {
  power_backup: number;
  energy_backup: number;
}

export interface PeakShavingResult {
  power_peak_shave: number;
  energy_peak_shave: number;
  peak_shaving_percentage: number;
  isHighPeakShaving: boolean;
  max_load: number;
  peak_load_after_shaving: number;
}

export interface ArbitrageResult {
  power_arbitrage: number;
  energy_arbitrage: number;
}

export interface PvArbitrageResult {
  power_arbitrage: number;
  energy_arbitrage: number;
}
