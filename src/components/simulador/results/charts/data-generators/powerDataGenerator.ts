
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
    
    // Make sure we're working with numbers before using toFixed
    // Add safety checks to ensure we're dealing with numbers
    const loadKwNumber = typeof loadKw === 'number' ? loadKw : 0;
    const pvKwNumber = typeof pvKw === 'number' ? pvKw : 0;
    const bessKwNumber = typeof bessKw === 'number' ? bessKw : 0;
    const netGridKwNumber = typeof netGridKw === 'number' ? netGridKw : 0;
    
    hourlyData.push({
      hour: `${hour}:00`,
      loadKw: parseFloat(loadKwNumber.toFixed(1)),
      pvKw: parseFloat(pvKwNumber.toFixed(1)),
      bessKw: parseFloat(bessKwNumber.toFixed(1)),
      gridKw: parseFloat(netGridKwNumber.toFixed(1)),
    });
  }
  
  return hourlyData;
}
