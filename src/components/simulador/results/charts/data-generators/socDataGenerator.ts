import { SimuladorFormValues } from "@/schemas/simuladorSchema";

export function generateSoCData(formValues: SimuladorFormValues) {
  const hourlyData = [];
  let currentSoc = formValues.bessInitialSoc;
  
  for (let hour = 0; hour < 24; hour++) {
    // SoC decreases during peak shaving hours (discharge)
    if (hour >= formValues.peakShavingStartHour && hour <= formValues.peakShavingEndHour && formValues.usePeakShaving) {
      currentSoc -= 10;
    } 
    // SoC increases during off-peak hours (charging)
    else if (hour >= 1 && hour <= 5 && formValues.useArbitrage) {
      currentSoc += 8;
    } 
    // Minimal self-discharge
    else {
      currentSoc -= 0.2;
    }
    
    // Keep within limits
    currentSoc = Math.max(100 - formValues.bessMaxDod, Math.min(100, currentSoc));
    
    hourlyData.push({
      hour: `${hour}:00`,
      soc: parseFloat(currentSoc.toFixed(1))
    });
  }
  
  return hourlyData;
}
