
import { SimuladorFormValues } from "@/schemas/simuladorSchema";

export function generatePowerData(formValues: SimuladorFormValues, batteryCap: number, batteryPower: number) {
  const hourlyData = [];
  
  // Ensure all input parameters have valid values with proper fallbacks
  const useHourlyValues = formValues.loadEntryMethod === "hourly" && formValues.hourlyDemandKw.some(v => v > 0);
  const peakDemand = typeof formValues.avgPeakDemandKw === 'number' && formValues.avgPeakDemandKw > 0 
    ? formValues.avgPeakDemandKw : 50;
  const offpeakDemand = typeof formValues.avgOffpeakDemandKw === 'number' && formValues.avgOffpeakDemandKw > 0
    ? formValues.avgOffpeakDemandKw : 40;
  const maxPeakDemand = typeof formValues.maxPeakDemandKw === 'number' && formValues.maxPeakDemandKw > 0
    ? formValues.maxPeakDemandKw : peakDemand * 1.5;
  const maxOffpeakDemand = typeof formValues.maxOffpeakDemandKw === 'number' && formValues.maxOffpeakDemandKw > 0
    ? formValues.maxOffpeakDemandKw : offpeakDemand * 1.5;
  const minPeakDemand = typeof formValues.minPeakDemandKw === 'number' && formValues.minPeakDemandKw >= 0
    ? formValues.minPeakDemandKw : peakDemand * 0.5;
  const minOffpeakDemand = typeof formValues.minOffpeakDemandKw === 'number' && formValues.minOffpeakDemandKw >= 0
    ? formValues.minOffpeakDemandKw : offpeakDemand * 0.5;
    
  // Ensure PV power is always a valid number
  const pvPower = formValues.hasPv && typeof formValues.pvPowerKwp === 'number' && formValues.pvPowerKwp > 0
    ? formValues.pvPowerKwp : 0;
    
  const peakStartHour = typeof formValues.peakStartHour === 'number' ? formValues.peakStartHour : 18;
  const peakEndHour = typeof formValues.peakEndHour === 'number' ? formValues.peakEndHour : 21;
  const peakShavingStartHour = typeof formValues.peakShavingStartHour === 'number' 
    ? formValues.peakShavingStartHour : peakStartHour;
  const peakShavingEndHour = typeof formValues.peakShavingEndHour === 'number'
    ? formValues.peakShavingEndHour : peakEndHour;
    
  // Ensure diesel power is valid
  const dieselPower = formValues.hasDiesel && typeof formValues.dieselPowerKw === 'number' && formValues.dieselPowerKw > 0
    ? formValues.dieselPowerKw : 0;
  
  // Validate battery parameters
  const validBatteryPower = typeof batteryPower === 'number' && batteryPower > 0 ? batteryPower : 108;
  const validBatteryCap = typeof batteryCap === 'number' && batteryCap > 0 ? batteryCap : 215;
  
  for (let hour = 0; hour < 24; hour++) {
    // Determine if current hour is peak
    const isPeakHour = hour >= peakStartHour && hour <= peakEndHour;
    // Determine if current hour is in peak shaving period
    const isPeakShavingHour = hour >= peakShavingStartHour && hour <= peakShavingEndHour;
    
    // Determinar loadKw com base no método de entrada
    let loadKw = 0;
    
    if (useHourlyValues && Array.isArray(formValues.hourlyDemandKw) && formValues.hourlyDemandKw.length > hour) {
      // Use dados horários inseridos pelo usuário, com validação para evitar undefined
      loadKw = typeof formValues.hourlyDemandKw[hour] === 'number' ? formValues.hourlyDemandKw[hour] : 0;
    } else {
      // Use o perfil sintético calculado
      if (isPeakHour) {
        // Use a value between min and max peak demand based on hour within peak period
        const peakPosition = (hour - peakStartHour) / (peakEndHour - peakStartHour + 1);
        const peakShape = Math.sin(peakPosition * Math.PI); // Creates a bell curve within peak hours
        loadKw = minPeakDemand + (maxPeakDemand - minPeakDemand) * peakShape;
      } else if (hour >= 7 && hour < peakStartHour) {
        // Daytime hours - use a value between min and average offpeak 
        const dayFactor = 0.7 + 0.3 * Math.sin((hour - 7) / (peakStartHour - 7) * Math.PI);
        loadKw = minOffpeakDemand + (offpeakDemand - minOffpeakDemand) * dayFactor;
      } else {
        // Night hours - closer to minimum offpeak demand
        const nightFactor = 0.2 + 0.5 * Math.sin(hour / 24 * Math.PI);
        loadKw = minOffpeakDemand + (offpeakDemand - minOffpeakDemand) * nightFactor;
      }
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
      if (formValues.peakShavingMethod === 'percentage' && typeof formValues.peakShavingPercentage === 'number') {
        bessKw = -loadKw * formValues.peakShavingPercentage / 100;
      } else if (typeof formValues.peakShavingTarget === 'number') {
        bessKw = -formValues.peakShavingTarget;
      } else {
        // Fallback if no valid peak shaving parameters are provided
        bessKw = -loadKw * 0.3; // Default to 30% peak shaving
      }
      
      // Ensure discharge doesn't exceed battery power
      if (bessKw < -validBatteryPower) bessKw = -validBatteryPower;
    } else if (hour >= 1 && hour <= 5 && formValues.useArbitrage) {
      // Valor positivo para BESS carregando durante off-peak (consumindo da rede)
      bessKw = validBatteryPower * 0.8;
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
