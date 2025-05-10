
/**
 * Type definitions for BESS simulation
 */

export interface SimulationInput {
  load_profile: number[];            // kW por hora (0-23)
  pv_profile: number[] | null;       // kW por hora (0-23), opcional
  tariff: {
    peak_start: number;              // ex.: 18
    peak_end: number;                // ex.: 21 (**inclusive**)
    te_peak: number;                 // R$/kWh
    tusd_peak: number;               // R$/kWh
    te_off: number;                  // R$/kWh
    tusd_off: number;                // R$/kWh
    tusd_demand: number;             // R$/kW·mês
  };
  sizing: {
    backup_required: boolean;
    critical_load_kw: number;
    backup_duration_h: number;

    peak_shaving_required: boolean;
    ps_mode: "percent" | "kw" | "target";
    ps_value: number;                // 30 (%) OU 500 kW OU 650 kW alvo

    arbitrage_required: boolean;
    pv_optim_required: boolean;
    grid_zero: boolean;

    buffer_factor: number;           // default 1.10
  };
  tech: {
    charge_eff: number;              // 0.95
    discharge_eff: number;           // 0.95
    max_soc: number;                 // 1.00
    min_soc: number;                 // 0.10
  };
  min_peak_demand_kw?: number;       // Demanda mínima na ponta
  min_offpeak_demand_kw?: number;    // Demanda mínima fora de ponta
  diesel_params?: {                  // Parameters for diesel replacement scenario
    dieselCostPerLiter: number;       // R$/litro
    dieselSpecificConsumption: number; // liters/kWh
    dieselCO2EmissionFactor: number;   // kgCO2/liter
    dieselOperationalDays?: number;   // days per year, default 365
  };
}

export interface StrategyRequirements {
  powerKw: number;
  energyKwh: number;
}

export interface ChartDataPoint {
  hour: number;
  load: number;
  grid: number;
  charge: number;
  diesel: number;
  negDis: number;  // Important: must be negative for chart stacking
  soc: number;
  dieselRef?: number;
  pv?: number;
}

export interface SimulationResults {
  modules: number;
  bessPowerKw: number;
  bessEnergyKwh: number;
  annualSavingsR$: number;
  chartData: ChartDataPoint[];
  // KPIs for diesel replacement scenario
  dieselConsumptionAvoidedAnnual_liters?: number;
  dieselCostAvoidedAnnual_R$?: number;
  dieselCO2EmissionsAvoidedAnnual_kg?: number;
  bessOpCostForDieselReplacementAnnual_R$?: number;
  netSavingsDieselReplacementAnnual_R$?: number;
}
