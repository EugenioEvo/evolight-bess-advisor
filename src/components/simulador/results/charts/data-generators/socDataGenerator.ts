import { SimuladorFormValues } from "@/schemas/simuladorSchema";

export function generateSoCData(formValues: SimuladorFormValues) {
  const hourlyData = [];
  let currentSoc = formValues.bessInitialSoc;
  const maxDod = formValues.bessMaxDod;
  const minSoc = 100 - maxDod;
  const bessCapacity = formValues.bessCapacityKwh;
  
  for (let hour = 0; hour < 24; hour++) {
    // SoC increases during off-peak hours (charging - BESS positivo)
    if (hour >= 1 && hour <= 5 && formValues.useArbitrage) {
      // Carregando a bateria durante horário fora de ponta (arbitragem)
      const chargePercent = 5 + (hour - 1) * 5; // 5% a 25% de carga por hora
      currentSoc += chargePercent;
    } 
    // SoC decreases during peak shaving hours (discharge - BESS negativo)
    else if (hour >= formValues.peakShavingStartHour && hour <= formValues.peakShavingEndHour && formValues.usePeakShaving) {
      // Taxa de descarga durante peak shaving
      let dischargePercent;
      
      if (formValues.peakShavingMethod === 'percentage') {
        // Estimar a descarga baseada no percentual de peak shaving
        dischargePercent = (formValues.peakShavingPercentage / 100) * 15;
      } else {
        // Estimar a descarga baseada no target de peak shaving
        dischargePercent = (formValues.peakShavingTarget / bessCapacity) * 100 * 0.4;
      }
      
      // Ajuste para tornar a descarga mais realista baseada na hora do peak shaving
      const hourPosition = hour - formValues.peakShavingStartHour;
      const peakShavingDuration = formValues.peakShavingEndHour - formValues.peakShavingStartHour + 1;
      
      // Descarga maior no meio do período de peak shaving
      const scaleFactor = 1 - Math.abs(hourPosition - peakShavingDuration/2) / (peakShavingDuration/2);
      dischargePercent *= (0.7 + 0.6 * scaleFactor);
      
      currentSoc -= dischargePercent;
    } 
    // Minimal self-discharge during other hours
    else {
      // Auto-descarga ao longo do dia
      currentSoc -= formValues.bessDailySelfdischarge / 24;
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
