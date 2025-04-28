
import { SimuladorFormValues } from "@/schemas/simuladorSchema";

export function generatePowerData(formValues: SimuladorFormValues, batteryCap: number, batteryPower: number) {
  const hourlyData = [];
  const peakDemand = formValues.avgPeakDemandKw;
  const maxPeakDemand = formValues.maxPeakDemandKw;
  const pvPower = formValues.hasPv ? formValues.pvPowerKwp : 0;
  
  for (let hour = 0; hour < 24; hour++) {
    // Create synthetic load profile
    const baseLoad = peakDemand * (0.7 + 0.3 * Math.sin(hour / 24 * Math.PI));
    let loadKw = hour >= 18 && hour <= 21 ? maxPeakDemand : baseLoad;
    
    // Create synthetic PV profile (bell curve during day)
    let pvKw = 0;
    if (hour >= 6 && hour <= 18 && pvPower > 0) {
      pvKw = pvPower * Math.sin((hour - 6) / 12 * Math.PI);
    }
    
    // Create synthetic BESS profile (discharge during peak)
    let bessKw = 0;
    if (hour >= formValues.peakStartHour && hour <= formValues.peakEndHour && formValues.usePeakShaving) {
      bessKw = formValues.peakShavingMethod === 'percentage' 
        ? maxPeakDemand * formValues.peakShavingPercentage / 100
        : formValues.peakShavingTarget;
      if (bessKw > batteryPower) bessKw = batteryPower;
    } else if (hour >= 1 && hour <= 5 && formValues.useArbitrage) {
      // Charging during off-peak
      bessKw = -batteryPower * 0.8;
    }
    
    // Calculate net grid consumption
    const netGridKw = loadKw - pvKw - bessKw;
    
    hourlyData.push({
      hour: `${hour}:00`,
      loadKw: parseFloat(loadKw.toFixed(1)),
      pvKw: parseFloat(pvKw.toFixed(1)),
      bessKw: parseFloat(bessKw.toFixed(1)),
      gridKw: parseFloat(netGridKw.toFixed(1)),
    });
  }
  
  return hourlyData;
}
