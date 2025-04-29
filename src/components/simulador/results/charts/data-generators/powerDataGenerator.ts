
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
  const peakShavingStartHour = formValues.peakShavingStartHour;
  const peakShavingEndHour = formValues.peakShavingEndHour;
  const dieselPower = formValues.hasDiesel ? formValues.dieselPowerKw : 0;
  
  for (let hour = 0; hour < 24; hour++) {
    // Determine if current hour is peak
    const isPeakHour = hour >= peakStartHour && hour <= peakEndHour;
    // Determine if current hour is in peak shaving period
    const isPeakShavingHour = hour >= peakShavingStartHour && hour <= peakShavingEndHour;
    
    // Create synthetic load profile
    let loadKw = 0; // Initialize with a default numeric value
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
    
    // Create synthetic Diesel Generator profile
    // Generator runs during peak shaving if diesel is enabled
    let dieselKw = 0;
    if (isPeakShavingHour && formValues.hasDiesel) {
      dieselKw = Math.min(dieselPower, loadKw * 0.3); // Generator provides up to 30% of load during peak shaving
    }
    
    // Create synthetic BESS profile
    // IMPORTANTE: VALORES INVERTIDOS CONFORME SOLICITADO
    // Valores negativos = descarga (fornecendo energia)
    // Valores positivos = carga (consumindo energia)
    let bessKw = 0;
    if (isPeakShavingHour && formValues.usePeakShaving) {
      // Valor negativo para BESS descarregando durante peak shaving (apoiando a rede)
      if (formValues.peakShavingMethod === 'percentage') {
        bessKw = -maxPeakDemand * formValues.peakShavingPercentage / 100;
      } else {
        bessKw = -formValues.peakShavingTarget;
      }
      
      // Ensure discharge doesn't exceed battery power
      if (bessKw < -batteryPower) bessKw = -batteryPower;
    } else if (hour >= 1 && hour <= 5 && formValues.useArbitrage) {
      // Valor positivo para BESS carregando durante off-peak (consumindo da rede)
      bessKw = batteryPower * 0.8;
    }
    
    // Calculate grid power - remaining load after accounting for PV, BESS, and diesel
    // Valores positivos = consumo da rede
    // Valores negativos = injeção na rede
    const gridKw = loadKw + bessKw - pvKw - dieselKw;
    
    // Ensure all values are numbers before calling toFixed
    const loadKwFinal = typeof loadKw === 'number' ? parseFloat(loadKw.toFixed(1)) : 0;
    const pvKwFinal = typeof pvKw === 'number' ? parseFloat(pvKw.toFixed(1)) : 0;
    const bessKwFinal = typeof bessKw === 'number' ? parseFloat(bessKw.toFixed(1)) : 0;
    const gridKwFinal = typeof gridKw === 'number' ? parseFloat(gridKw.toFixed(1)) : 0;
    const dieselKwFinal = typeof dieselKw === 'number' ? parseFloat(dieselKw.toFixed(1)) : 0;
    
    hourlyData.push({
      hour: `${hour}:00`,
      loadKw: loadKwFinal,
      pvKw: pvKwFinal,
      bessKw: bessKwFinal,
      gridKw: gridKwFinal,
      dieselKw: dieselKwFinal,
    });
  }
  
  return hourlyData;
}
