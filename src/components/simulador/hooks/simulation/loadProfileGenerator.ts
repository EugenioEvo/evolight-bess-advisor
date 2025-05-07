
import { SimuladorFormValues } from "@/schemas/simuladorSchema";

/**
 * Generate a synthetic load profile based on form values
 */
export function generateLoadProfile(values: SimuladorFormValues): number[] {
  // Se o método de entrada for horário, use esses dados diretamente
  if (values.loadEntryMethod === "hourly" && values.hourlyDemandKw.some(v => v > 0)) {
    return values.hourlyDemandKw;
  }

  // Caso contrário, gere um perfil sintético baseado nos valores médios
  const profile = [];
  const peakLoad = values.avgPeakDemandKw > 0 ? values.avgPeakDemandKw : 50;
  const offpeakLoad = values.avgOffpeakDemandKw > 0 ? values.avgOffpeakDemandKw : 40;
  const maxPeakLoad = values.maxPeakDemandKw > 0 ? values.maxPeakDemandKw : peakLoad * 1.5;
  const maxOffpeakLoad = values.maxOffpeakDemandKw > 0 ? values.maxOffpeakDemandKw : offpeakLoad * 1.5;
  
  for (let hour = 0; hour < 24; hour++) {
    if (hour >= values.peakStartHour && hour <= values.peakEndHour) {
      // Peak hours
      profile.push(maxPeakLoad);
    } else if (hour >= 7 && hour < values.peakStartHour) {
      // Daytime hours
      const daytimeFactor = 0.8 + 0.2 * Math.sin((hour - 7) / (values.peakStartHour - 7) * Math.PI);
      profile.push(offpeakLoad + (peakLoad - offpeakLoad) * daytimeFactor);
    } else {
      // Night hours
      const nightFactor = 0.6 + 0.4 * Math.cos(hour / 12 * Math.PI);
      profile.push(offpeakLoad * nightFactor);
    }
  }
  
  return profile;
}

/**
 * Generate a synthetic PV profile based on form values
 * 
 * @returns An array of hourly PV generation values (kW). Returns an empty array if PV is not used.
 */
export function generatePvProfile(values: SimuladorFormValues): number[] {
  // Important fix: Return empty array instead of undefined when PV is not used
  if (!values.hasPv || values.pvPowerKwp <= 0) {
    return [];
  }
  
  // Generate a synthetic profile based on typical solar production curve
  return [0, 0, 0, 0, 0, 0.1, 0.3, 0.5, 0.7, 0.9, 1.0, 0.9, 0.8, 0.6, 0.4, 0.2, 0, 0, 0, 0, 0, 0, 0, 0]
    .map(v => v * values.pvPowerKwp);
}
