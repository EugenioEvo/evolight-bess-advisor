
import { SimuladorFormValues } from "@/schemas/simuladorSchema";

export function generatePowerData(formValues: SimuladorFormValues, batteryCap: number, batteryPower: number) {
  const hourlyData = [];
  const peakDemand = formValues.avgPeakDemandKw;
  const offpeakDemand = formValues.avgOffpeakDemandKw;
  const maxPeakDemand = formValues.maxPeakDemandKw;
  const maxOffpeakDemand = formValues.maxOffpeakDemandKw;
  const pvPower = formValues.hasPv ? formValues.pvPowerKwp : 0;
  const peakStartHour = formValues.peakStartHour;
  const peakEndHour = formValues.peakEndHour;
  
  for (let hour = 0; hour < 24; hour++) {
    // Determine if current hour is peak
    const isPeakHour = hour >= peakStartHour && hour <= peakEndHour;
    
    // Create synthetic load profile
    let loadKw;
    if (isPeakHour) {
      // Peak hours - use peak demand values
      loadKw = maxPeakDemand;
    } else if (hour >= 7 && hour < peakStartHour) {
      // Daytime hours - use a value between offpeak and peak
      const dayFactor = 0.7 + 0.3 * Math.sin((hour - 7) / (peakStartHour - 7) * Math.PI);
      loadKw = offpeakDemand + (peakDemand - offpeakDemand) * dayFactor;
    } else {
      // Night hours - use offpeak demand with some variation
      const nightFactor = 0.6 + 0.4 * Math.sin(hour / 24 * Math.PI);
      loadKw = offpeakDemand * nightFactor;
    }
    
    // Create synthetic PV profile (bell curve during day)
    let pvKw = 0;
    if (hour >= 6 && hour <= 18 && pvPower > 0) {
      pvKw = pvPower * Math.sin((hour - 6) / 12 * Math.PI);
    }
    
    // Create synthetic BESS profile (discharge during peak)
    let bessKw = 0;
    if (hour >= peakStartHour && hour <= peakEndHour && formValues.usePeakShaving) {
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
