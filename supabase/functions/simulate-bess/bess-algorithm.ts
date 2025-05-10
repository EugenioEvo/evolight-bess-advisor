// Helper functions
const sum = (arr: number[]): number => arr.reduce((a, b) => a + b, 0);
const range = (start: number, end: number): number[] => {
  const result = [];
  for (let i = start; i <= end; i++) {
    result.push(i);
  }
  return result;
};

// Module specifications
const MODULE_POWER_KW = 108;
const MODULE_ENERGY_KWH = 215;

interface SimulationInput {
  load_profile: number[];            // kW por hora (0-23)
  pv_profile: number[] | null;        // kW por hora (0-23), opcional
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
}

interface SimulationResults {
  modules: number;
  bessPowerKw: number;
  bessEnergyKwh: number;
  annualSavingsR$: number;
  chartData: Array<{
    hour: number;
    load: number;
    grid: number;
    charge: number;
    diesel: number;
    negDis: number;
    soc: number;
    dieselRef?: number;
  }>;
}

export function simulateBESS(input: SimulationInput): SimulationResults {
  // 1. Set up default values
  const load_profile = input.load_profile || Array(24).fill(100);
  const pv_profile = input.pv_profile || Array(24).fill(0);
  const peak_start = input.tariff.peak_start || 18;
  const peak_end = input.tariff.peak_end || 21;
  const te_peak = input.tariff.te_peak || 0.8;
  const tusd_peak = input.tariff.tusd_peak || 0;
  const te_off = input.tariff.te_off || 0.4;
  const tusd_off = input.tariff.tusd_off || 0;
  const tusd_demand = input.tariff.tusd_demand || 0;
  const charge_eff = input.tech.charge_eff || 0.95;
  const discharge_eff = input.tech.discharge_eff || 0.95;
  const max_soc = input.tech.max_soc || 1.0;
  const min_soc = input.tech.min_soc || 0.1;
  
  // 2. Identify peak hours and calculate max load during peak hours
  const peak_hours = range(peak_start, peak_end);
  const peak_loads = peak_hours.map(hour => load_profile[hour] || 0);
  const max_load = Math.max(...peak_loads);
  const avg_load = sum(peak_loads) / peak_loads.length;
  
  // 3. Calculate individual strategy requirements
  let p_backup = 0;
  let e_backup = 0;
  let p_ps = 0;
  let e_ps = 0;
  let p_arb = 0;
  let e_arb = 0;
  
  // 3.1 Backup strategy
  if (input.sizing.backup_required && input.sizing.critical_load_kw > 0) {
    p_backup = input.sizing.critical_load_kw;
    e_backup = p_backup * input.sizing.backup_duration_h / discharge_eff;
    console.log("Backup sizing:", { p_backup, e_backup });
  }
  
  // 3.2 Peak Shaving strategy
  if (input.sizing.peak_shaving_required) {
    // Calculate peak shaving power based on mode
    switch (input.sizing.ps_mode) {
      case "percent":
        p_ps = max_load * input.sizing.ps_value / 100;
        break;
      case "kw":
        p_ps = input.sizing.ps_value;
        break;
      case "target":
        p_ps = Math.max(0, max_load - input.sizing.ps_value);
        break;
    }
    
    // Ensure p_ps doesn't exceed max_load
    p_ps = Math.min(p_ps, max_load);
    
    // Calculate energy needed for peak shaving
    const pct_reduction = p_ps / max_load;
    if (pct_reduction > 0.9) {
      // If reduction is very high, use total peak energy
      e_ps = sum(peak_loads) / discharge_eff;
    } else {
      // Otherwise use power * hours approach
      e_ps = p_ps * peak_hours.length / discharge_eff;
    }
    
    console.log("Peak shaving sizing:", { p_ps, e_ps, pct_reduction });
  }
  
  // 3.3 Arbitrage strategy
  if (input.sizing.arbitrage_required) {
    if (input.sizing.peak_shaving_required) {
      // If peak shaving is active, use its power capacity
      p_arb = p_ps;
      
      // Calculate remaining peak energy after peak shaving
      const peak_energy = sum(peak_loads);
      const peak_shaving_energy = p_ps * peak_hours.length;
      const remaining_energy = Math.max(0, peak_energy - peak_shaving_energy);
      
      // Energy needed for arbitrage (considering discharge efficiency)
      e_arb = remaining_energy / discharge_eff;
    } else {
      // If no peak shaving, use 80% of average peak load
      p_arb = avg_load * 0.8;
      e_arb = p_arb * peak_hours.length / discharge_eff;
    }
    
    console.log("Arbitrage basic sizing:", { p_arb, e_arb });
  }
  
  // 3.4 PV optimization
  if (input.sizing.pv_optim_required && input.pv_profile) {
    const total_pv = sum(pv_profile);
    const total_load = sum(load_profile);
    const surplus = Math.max(0, total_pv - total_load);
    
    if (surplus > 0) {
      // Energy needed to store surplus (considering charge efficiency)
      const surplus_energy = surplus / charge_eff;
      
      // Update arbitrage requirements if surplus is larger
      if (surplus_energy > e_arb) {
        e_arb = surplus_energy;
        // Assume surplus distributed over 4 hours minimum
        p_arb = Math.max(p_arb, surplus / 4);
      }
      
      console.log("PV optimization sizing:", { surplus, surplus_energy });
    }
  }
  
  // 4. Calculate envelope (maximum requirements)
  const power_need = Math.max(p_backup, p_ps, p_arb);
  const energy_need = Math.max(e_backup, e_ps, e_arb);
  
  console.log("Combined requirements:", { power_need, energy_need });
  
  // 5. Apply buffer and minimum sizes
  const buffer_factor = input.sizing.buffer_factor || 1.1;
  const power_buf = Math.max(power_need * buffer_factor, 10); // Minimum 10 kW
  const energy_buf = Math.max(energy_need * buffer_factor, 20); // Minimum 20 kWh
  
  console.log("After buffer:", { power_buf, energy_buf });
  
  // 6. Calculate number of modules needed
  const n_modules_by_power = Math.ceil(power_buf / MODULE_POWER_KW);
  const n_modules_by_energy = Math.ceil(energy_buf / MODULE_ENERGY_KWH);
  const n_modules = Math.max(n_modules_by_power, n_modules_by_energy, 1); // At least 1 module
  
  // 7. Calculate final BESS power and energy
  const bess_power_kw = n_modules * MODULE_POWER_KW;
  const bess_energy_kwh = n_modules * MODULE_ENERGY_KWH;
  
  console.log("Final BESS sizing:", { 
    n_modules, 
    bess_power_kw, 
    bess_energy_kwh, 
    by_power: n_modules_by_power,
    by_energy: n_modules_by_energy
  });
  
  // 8. Calculate financial KPIs
  let annual_savings = 0;
  
  // 8.1 Energy cost savings
  if (input.sizing.pv_optim_required && input.pv_profile) {
    // Calculate self-consumed PV energy
    const pv_self_consumption = Math.min(sum(pv_profile), sum(load_profile));
    const grid_energy_reduction = pv_self_consumption;
    annual_savings += grid_energy_reduction * te_peak * 365; // Simplified calculation
  }
  
  // 8.2 Demand charge savings (Group A tariffs)
  if (tusd_demand > 0 && input.sizing.peak_shaving_required) {
    annual_savings += p_ps * tusd_demand * 12; // Monthly demand charge savings over a year
  }
  
  console.log("Annual savings:", { annual_savings });
  
  // 9. Generate 24h dispatch data for chart
  const chartData = [];
  let soc = 50; // Start at 50% SoC for simulation
  const useable_capacity = bess_energy_kwh * (max_soc - min_soc);
  
  for (let hour = 0; hour < 24; hour++) {
    const load = load_profile[hour];
    const pv = pv_profile ? pv_profile[hour] : 0;
    let charge = 0;
    let discharge = 0;
    let diesel = 0;
    const dieselRef = 0; // Not using diesel in this simulation
    
    // Peak shaving: discharge during peak hours
    const is_peak_hour = hour >= peak_start && hour <= peak_end;
    
    if (is_peak_hour && input.sizing.peak_shaving_required) {
      // Calculate how much we need to shave
      const target_load = input.sizing.ps_mode === 'target' ? 
        input.sizing.ps_value : 
        max_load - p_ps;
      
      // Apply minimum peak demand if specified
      const min_peak_demand = input.min_peak_demand_kw || 0;
      const effective_target = Math.max(target_load, min_peak_demand);
      
      // Calculate discharge amount
      if (load > effective_target) {
        discharge = Math.min(load - effective_target, bess_power_kw);
      }
    }
    
    // Charging logic: charge during early morning hours (0-5) for next day
    const is_charge_hour = hour >= 0 && hour <= 5;
    if (is_charge_hour && input.sizing.arbitrage_required) {
      const soc_pct = soc / 100;
      const room_left = max_soc - soc_pct;
      
      if (room_left > 0.05) { // Only charge if we have room (>5% headroom)
        charge = Math.min(bess_power_kw, pv);  // First try to use available PV
        
        // If we still have charging capacity, use grid
        if (charge < bess_power_kw) {
          charge += Math.min(bess_power_kw - charge, bess_power_kw * 0.8);  // Limit to 80% of capacity
        }
      }
    }
    
    // Calculate grid consumption
    let grid = 0;
    if (input.sizing.grid_zero) {
      // Grid-zero operation tries to minimize grid consumption
      grid = Math.max(0, load + charge - discharge - pv);
    } else {
      // Normal operation
      grid = Math.max(0, load + charge - discharge - pv);
      
      // Apply minimum offpeak demand if applicable and not in peak hours
      if (!is_peak_hour && input.min_offpeak_demand_kw) {
        grid = Math.max(grid, input.min_offpeak_demand_kw);
      }
    }
    
    // Update SoC based on charge/discharge
    if (discharge > 0) {
      // Decrease SoC when discharging (considering efficiency)
      soc -= (discharge / discharge_eff) / bess_energy_kwh * 100;
    }
    
    if (charge > 0) {
      // Increase SoC when charging (considering efficiency)
      soc += (charge * charge_eff) / bess_energy_kwh * 100;
    }
    
    // Constrain SoC to valid range
    soc = Math.max(min_soc * 100, Math.min(max_soc * 100, soc));
    
    // For chart display purposes, discharge is represented as negative
    const negDis = -discharge;
    
    chartData.push({
      hour,
      load,
      pv,
      grid,
      charge,
      diesel,
      negDis,
      soc,
      dieselRef
    });
  }
  
  return {
    modules: n_modules,
    bessPowerKw: bess_power_kw,
    bessEnergyKwh: bess_energy_kwh,
    annualSavingsR$: annual_savings,
    chartData
  };
}
