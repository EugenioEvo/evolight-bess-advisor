
import { DispatchPoint } from '../EnergyDispatchChartTypes';

interface PowerDataPoint {
  hour: string;
  loadKw: number;
  pvKw: number;
  bessKw: number;
  gridKw: number;
  dieselKw: number;
}

interface SocDataPoint {
  hour: string;
  soc: number;
}

export function generateEnergyDispatchData(
  powerData: PowerDataPoint[],
  socData: SocDataPoint[]
): DispatchPoint[] {
  return powerData.map((point, index) => {
    // Extract hour from string like "0:00" to get just the number
    const hourStr = point.hour.split(':')[0];
    const hour = parseInt(hourStr, 10) as DispatchPoint['hour'];
    
    // Get BESS values (positive = charge, negative = discharge)
    const bessValue = point.bessKw;
    let charge = 0;
    let discharge = 0;
    
    // Determine if BESS is charging or discharging
    if (bessValue > 0) {
      charge = bessValue;
    } else if (bessValue < 0) {
      discharge = Math.abs(bessValue);
    }
    
    // Calculate grid based on other values
    // If grid is negative (injection), set to 0 as we don't consider injection in this chart
    let gridValue = Math.max(0, point.gridKw);
    
    // Find SoC data for this hour
    const socValue = socData.find(socPoint => socPoint.hour === point.hour)?.soc || 50;
    
    return {
      hour,
      load: point.loadKw,
      pv: point.pvKw,
      diesel: point.dieselKw,
      charge,
      discharge,
      grid: gridValue,
      soc: socValue
    };
  });
}
