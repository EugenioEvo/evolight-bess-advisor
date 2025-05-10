
/**
 * Generate 24-hour dispatch data for visualization
 */
import { SimulationInput, ChartDataPoint } from "./types.ts";

/**
 * Generate 24-hour dispatch data for the chart
 */
export function generateDispatchData(
  input: SimulationInput, 
  bessPowerKw: number,
  bessEnergyKwh: number
): ChartDataPoint[] {
  const { load_profile, tariff, sizing, tech, min_peak_demand_kw, min_offpeak_demand_kw } = input;
  const pv_profile = input.pv_profile || Array(24).fill(0);
  const { peak_start, peak_end } = tariff;
  const { grid_zero, peak_shaving_required, ps_mode, ps_value } = sizing;
  const { max_soc, min_soc, charge_eff, discharge_eff } = tech;
  
  const chartData: ChartDataPoint[] = [];
  let soc = 50; // Start at 50% SoC for simulation
  const usableCapacity = bessEnergyKwh * (max_soc - min_soc);
  
  // Calculate peak load reference for peak shaving
  const peakLoads = load_profile.slice(peak_start, peak_end + 1);
  const maxLoad = Math.max(...peakLoads);
  
  // Calculate target load for peak shaving
  let targetLoad = maxLoad;
  if (peak_shaving_required) {
    if (ps_mode === 'target') {
      targetLoad = ps_value;
    } else {
      // For percent or kw modes
      const psValue = ps_mode === 'percent' ? maxLoad * ps_value / 100 : ps_value;
      targetLoad = maxLoad - psValue;
    }
  }
  
  for (let hour = 0; hour < 24; hour++) {
    const load = load_profile[hour];
    const pv = pv_profile[hour];
    let charge = 0;
    let discharge = 0;
    let diesel = 0;
    const dieselRef = 0; // Not using diesel in this simulation
    
    // Peak shaving: discharge during peak hours
    const isPeakHour = hour >= peak_start && hour <= peak_end;
    
    if (isPeakHour && peak_shaving_required) {
      // Apply minimum peak demand if specified
      const minPeakDemand = min_peak_demand_kw || 0;
      const effectiveTarget = Math.max(targetLoad, minPeakDemand);
      
      // Calculate discharge amount
      if (load > effectiveTarget) {
        discharge = Math.min(load - effectiveTarget, bessPowerKw);
      }
    }
    
    // Charging logic: charge during early morning hours (0-5) for next day
    const isChargeHour = hour >= 0 && hour <= 5;
    if (isChargeHour && sizing.arbitrage_required) {
      const socPct = soc / 100;
      const roomLeft = max_soc - socPct;
      
      if (roomLeft > 0.05) { // Only charge if we have room (>5% headroom)
        charge = Math.min(bessPowerKw, pv);  // First try to use available PV
        
        // If we still have charging capacity, use grid
        if (charge < bessPowerKw) {
          charge += Math.min(bessPowerKw - charge, bessPowerKw * 0.8);  // Limit to 80% of capacity
        }
      }
    }
    
    // Calculate grid consumption
    let grid = 0;
    if (grid_zero) {
      // Grid-zero operation tries to minimize grid consumption
      grid = Math.max(0, load + charge - discharge - pv);
    } else {
      // Normal operation
      grid = Math.max(0, load + charge - discharge - pv);
      
      // Apply minimum offpeak demand if applicable and not in peak hours
      if (!isPeakHour && min_offpeak_demand_kw) {
        grid = Math.max(grid, min_offpeak_demand_kw);
      }
    }
    
    // Update SoC based on charge/discharge
    if (discharge > 0) {
      // Decrease SoC when discharging (considering efficiency)
      soc -= (discharge / discharge_eff) / bessEnergyKwh * 100;
    }
    
    if (charge > 0) {
      // Increase SoC when charging (considering efficiency)
      soc += (charge * charge_eff) / bessEnergyKwh * 100;
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
  
  return chartData;
}
