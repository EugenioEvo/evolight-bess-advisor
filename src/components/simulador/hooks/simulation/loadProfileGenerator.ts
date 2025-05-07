
import { SimuladorFormValues } from "@/schemas/simuladorSchema";

/**
 * Generate a synthetic load profile based on form values
 */
export function generateLoadProfile(values: SimuladorFormValues): number[] {
  // Se o método de entrada for horário, use esses dados diretamente
  if (values.loadEntryMethod === "hourly" && Array.isArray(values.hourlyDemandKw) && values.hourlyDemandKw.some(v => v > 0)) {
    console.log("Using hourly demand data:", values.hourlyDemandKw);
    return values.hourlyDemandKw;
  }

  console.log("Generating synthetic load profile");
  // Caso contrário, gere um perfil sintético baseado nos valores médios
  const profile = [];
  const peakLoad = typeof values.avgPeakDemandKw === 'number' && values.avgPeakDemandKw > 0 ? values.avgPeakDemandKw : 50;
  const offpeakLoad = typeof values.avgOffpeakDemandKw === 'number' && values.avgOffpeakDemandKw > 0 ? values.avgOffpeakDemandKw : 40;
  const maxPeakLoad = typeof values.maxPeakDemandKw === 'number' && values.maxPeakDemandKw > 0 ? values.maxPeakDemandKw : peakLoad * 1.5;
  const maxOffpeakLoad = typeof values.maxOffpeakDemandKw === 'number' && values.maxOffpeakDemandKw > 0 ? values.maxOffpeakDemandKw : offpeakLoad * 1.5;
  
  // Defina valores padrão para as horas de pico se não estiverem definidas
  const peakStartHour = typeof values.peakStartHour === 'number' ? values.peakStartHour : 18;
  const peakEndHour = typeof values.peakEndHour === 'number' ? values.peakEndHour : 21;
  
  for (let hour = 0; hour < 24; hour++) {
    if (hour >= peakStartHour && hour <= peakEndHour) {
      // Peak hours
      profile.push(maxPeakLoad);
    } else if (hour >= 7 && hour < peakStartHour) {
      // Daytime hours
      const daytimeFactor = 0.8 + 0.2 * Math.sin((hour - 7) / (peakStartHour - 7) * Math.PI);
      profile.push(offpeakLoad + (peakLoad - offpeakLoad) * daytimeFactor);
    } else {
      // Night hours
      const nightFactor = 0.6 + 0.4 * Math.cos(hour / 12 * Math.PI);
      profile.push(offpeakLoad * nightFactor);
    }
  }
  
  console.log("Generated load profile:", profile);
  return profile;
}

/**
 * Generate a synthetic PV profile based on form values
 * 
 * @returns An array of hourly PV generation values (kW). Returns an empty array if PV is not used.
 */
export function generatePvProfile(values: SimuladorFormValues): number[] {
  // Return empty array if PV is not used
  if (!values.hasPv || typeof values.pvPowerKwp !== 'number' || values.pvPowerKwp <= 0) {
    console.log("PV not enabled or power not set, returning empty array");
    return [];
  }
  
  console.log("Generating PV profile with power:", values.pvPowerKwp);
  // Generate a synthetic profile based on typical solar production curve
  const pvFactors = [0, 0, 0, 0, 0, 0.1, 0.3, 0.5, 0.7, 0.9, 1.0, 0.9, 0.8, 0.6, 0.4, 0.2, 0, 0, 0, 0, 0, 0, 0, 0];
  const pvProfile = pvFactors.map(v => v * values.pvPowerKwp);
  
  console.log("Generated PV profile:", pvProfile);
  return pvProfile;
}
