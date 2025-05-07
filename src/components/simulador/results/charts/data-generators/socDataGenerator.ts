
import { SimuladorFormValues } from "@/schemas/simuladorSchema";

export function generateSoCData(formValues: SimuladorFormValues) {
  const hourlyData = [];
  
  // Validate input parameters and provide fallbacks
  const initialSoc = typeof formValues.bessInitialSoc === 'number' && formValues.bessInitialSoc >= 0
    ? formValues.bessInitialSoc : 50;
    
  const maxDod = typeof formValues.bessMaxDod === 'number' && formValues.bessMaxDod > 0
    ? formValues.bessMaxDod : 85;
    
  const peakShavingStartHour = typeof formValues.peakShavingStartHour === 'number' 
    ? formValues.peakShavingStartHour : 18;
    
  const peakShavingEndHour = typeof formValues.peakShavingEndHour === 'number'
    ? formValues.peakShavingEndHour : 21;
    
  const bessCapacity = typeof formValues.bessCapacityKwh === 'number' && formValues.bessCapacityKwh > 0
    ? formValues.bessCapacityKwh : 215;
    
  const dailySelfDischarge = typeof formValues.bessDailySelfdischarge === 'number' && formValues.bessDailySelfdischarge > 0
    ? formValues.bessDailySelfdischarge : 0.1;
  
  let currentSoc = initialSoc;
  const minSoc = 100 - maxDod;
  
  for (let hour = 0; hour < 24; hour++) {
    // SoC increases during off-peak hours (charging - BESS positivo)
    if (hour >= 1 && hour <= 5 && formValues.useArbitrage) {
      // Carregando a bateria durante horário fora de ponta (arbitragem)
      const chargePercent = 5 + (hour - 1) * 5; // 5% a 25% de carga por hora
      currentSoc += chargePercent;
    } 
    // SoC decreases during peak shaving hours (discharge - BESS negativo)
    else if (hour >= peakShavingStartHour && hour <= peakShavingEndHour && formValues.usePeakShaving) {
      // Taxa de descarga durante peak shaving
      let dischargePercent;
      
      if (formValues.peakShavingMethod === 'percentage' && typeof formValues.peakShavingPercentage === 'number') {
        // Estimar a descarga baseada no percentual de peak shaving
        dischargePercent = (formValues.peakShavingPercentage / 100) * 15;
      } else if (typeof formValues.peakShavingTarget === 'number') {
        // Estimar a descarga baseada no target de peak shaving
        dischargePercent = (formValues.peakShavingTarget / bessCapacity) * 100 * 0.4;
      } else {
        // Fallback if no valid peak shaving parameters are provided
        dischargePercent = 15; // Default to 15% discharge per hour
      }
      
      // Ajuste para tornar a descarga mais realista baseada na hora do peak shaving
      const hourPosition = hour - peakShavingStartHour;
      const peakShavingDuration = peakShavingEndHour - peakShavingStartHour + 1;
      
      // Descarga maior no meio do período de peak shaving
      const scaleFactor = peakShavingDuration > 0 
        ? 1 - Math.abs(hourPosition - peakShavingDuration/2) / (peakShavingDuration/2) 
        : 1;
        
      dischargePercent *= (0.7 + 0.6 * scaleFactor);
      
      currentSoc -= dischargePercent;
    } 
    // Minimal self-discharge during other hours
    else {
      // Auto-descarga ao longo do dia
      currentSoc -= dailySelfDischarge / 24;
    }
    
    // Keep within limits
    currentSoc = Math.max(minSoc, Math.min(100, currentSoc));
    
    hourlyData.push({
      hour: `${hour}:00`,
      soc: parseFloat(currentSoc.toFixed(1))
    });
  }
  
  return hourlyData;
}
