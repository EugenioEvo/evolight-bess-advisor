
import { SimuladorFormValues } from "@/schemas/simuladorSchema";
import { BessSimulationInput } from "./types";

/**
 * Maps form values from the simulator to the input format required by the BESS simulation
 */
export function mapFormValuesToSimInput(formValues: SimuladorFormValues): BessSimulationInput {
  // Generate load profile
  let loadProfile: number[];
  if (formValues.loadEntryMethod === "hourly" && Array.isArray(formValues.hourlyDemandKw)) {
    loadProfile = formValues.hourlyDemandKw;
  } else {
    loadProfile = Array(24).fill(0).map((_, i) => {
      if (i >= (formValues.peakStartHour || 18) && i <= (formValues.peakEndHour || 21)) {
        return formValues.maxPeakDemandKw || formValues.avgPeakDemandKw || 100;
      }
      if (i >= 8 && i <= 17) {
        return formValues.avgOffpeakDemandKw || 80;
      }
      return (formValues.avgOffpeakDemandKw || 80) * 0.5;
    });
  }

  // Generate PV profile if enabled
  let pvProfile: number[] = Array(24).fill(0);
  if (formValues.hasPv && formValues.pvPowerKwp > 0) {
    // Simple bell curve for PV generation (peak at noon)
    const pvFactors = [0, 0, 0, 0, 0, 0.1, 0.3, 0.5, 0.7, 0.9, 1.0, 0.9, 0.8, 0.6, 0.4, 0.2, 0, 0, 0, 0, 0, 0, 0, 0];
    pvProfile = pvFactors.map(v => v * formValues.pvPowerKwp);
  }

  // Map peak shaving mode
  let psMode: "percent" | "kw" | "target" = "percent";
  if (formValues.peakShavingMethod === "target") {
    psMode = "target";
  } else if (formValues.peakShavingMethod === "reduction") {
    psMode = "kw";
  }

  // Map peak shaving value
  let psValue = formValues.peakShavingPercentage || 30;
  if (formValues.peakShavingMethod === "target" || formValues.peakShavingMethod === "reduction") {
    psValue = formValues.peakShavingTarget || 0;
  }

  // Calculate roundtrip efficiency from charge and discharge efficiencies
  const chargeEff = (formValues.chargeEff || 95) / 100;
  const dischargeEff = (formValues.dischargeEff || 95) / 100;
  const roundEff = chargeEff * dischargeEff;

  return {
    load: loadProfile,
    pv: formValues.hasPv ? pvProfile : undefined,
    peakStart: formValues.peakStartHour || 18,
    peakEnd: formValues.peakEndHour || 21,
    tePeak: formValues.tePeak || 0.80,
    tusdPeak: formValues.tusdPeakKwh || 0.20,
    teOff: formValues.teOffpeak || 0.40,
    tusdOff: formValues.tusdOffpeakKwh || 0.10,
    tusdDemand: formValues.tusdPeakKw || 50.0,
    usePS: formValues.usePeakShaving,
    psMode,
    psValue,
    useARB: formValues.useArbitrage,
    modulePower: 108,
    moduleEnergy: 215,
    chargeEff,
    dischargeEff,
    roundEff,
    maxSoC: 1.0,
    minSoC: 1.0 - (formValues.bessMaxDod || 85) / 100,
    chargeWindow: [1, 5] // Default charging window for arbitrage (early morning)
  };
}
