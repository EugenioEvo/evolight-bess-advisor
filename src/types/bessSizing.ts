
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
  roundtrip_eff?: number;
}

export interface SimulationParams {
  interval_minutes: number;
}

export interface CalculateBessSizeParams {
  load_profile: number[];
  pv_profile?: number[];
  tariff_structure: TariffStructure;
  sizing_params: SizingParams;
  bess_technical_params: BessTechnicalParams;
  simulation_params: SimulationParams;
}

export interface BessSizeResult {
  calculated_power_kw: number;
  calculated_energy_kwh: number;
}
