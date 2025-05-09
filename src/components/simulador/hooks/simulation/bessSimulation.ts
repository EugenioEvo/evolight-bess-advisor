
import { toast } from "sonner";
import { SimuladorFormValues } from "@/schemas/simuladorSchema";
import { BessSimulationResult } from "@/hooks/bessSimulation/types";
import { SimulationResults, SimulationResponse } from "./types";

/**
 * Process the results of the BESS simulation to generate financial metrics and simulation results
 */
export function processBessSimulationResult(
  bessResult: BessSimulationResult,
  values: SimuladorFormValues
): SimulationResponse {
  try {
    const calculatedPowerKw = bessResult.bessPowerKw;
    const calculatedEnergyKwh = bessResult.bessEnergyKwh;
    const annualSavings = bessResult.kpiAnnual;
    
    // Calculate additional financial metrics
    let totalInvestment = 0;
    if (values.capexCost > 0) {
      // If provided a manual total cost, use that value
      totalInvestment = values.capexCost;
    } else if (values.bessUnitCost > 0) {
      // If provided a cost per BESS unit, calculate based on number of units
      totalInvestment = bessResult.modules * values.bessUnitCost;
    } else {
      // Otherwise, use cost per kWh based on actual energy capacity
      totalInvestment = calculatedEnergyKwh * (values.bessInstallationCost || 1500);
    }
    
    // Calculate payback and ROI
    const paybackYears = annualSavings > 0 ? totalInvestment / annualSavings : 0;
    const roi = (annualSavings * values.horizonYears) / totalInvestment * 100;
    const isViable = paybackYears > 0 && paybackYears < values.horizonYears;
    
    // Build simulation results
    const results: SimulationResults = {
      calculatedPowerKw: calculatedPowerKw,
      calculatedEnergyKwh: calculatedEnergyKwh,
      paybackYears,
      annualSavings,
      roi,
      isViable,
      dispatch24h: bessResult.dispatch24h
    };
    
    console.log("Final simulation results (v2):", results);
    
    toast.success("BESS dimensionado com sucesso!", {
      description: `Potência: ${calculatedPowerKw.toFixed(2)} kW, Capacidade: ${calculatedEnergyKwh.toFixed(2)} kWh`
    });
    
    return { success: true, results };
  } catch (error) {
    console.error("Error processing BESS simulation result:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error : new Error("Error processing BESS simulation result") 
    };
  }
}
