
import { BessSimulationResult } from "@/hooks/bessSimulation/types";
import { SimuladorFormValues } from "@/schemas/simuladorSchema";
import { SimulationResponse } from "./types";
import { MODULE_POWER_KW, MODULE_ENERGY_KWH, calculateRequiredModules } from "@/config/bessModuleConfig";

/**
 * Processes the BESS simulation results into the format expected by the application
 */
export function processBessSimulationResult(
  bessResult: BessSimulationResult, 
  formValues: SimuladorFormValues
): SimulationResponse {
  if (!bessResult.isSuccess || !bessResult) {
    return {
      success: false,
      error: bessResult.error || "Erro na simulação BESS",
    };
  }

  try {
    // Calculate required number of modules based on both power and energy requirements
    const bessUnitsRequired = calculateRequiredModules(
      bessResult.bessPowerKw,
      bessResult.bessEnergyKwh
    );
    
    // Calculate actual power and energy based on indivisible modules
    const actualPowerKw = bessUnitsRequired * MODULE_POWER_KW;
    const actualEnergyKwh = bessUnitsRequired * MODULE_ENERGY_KWH;
    
    // Cálculo do investimento total considerando unidades BESS indivisíveis
    let totalInvestment = 0;
    if (formValues.capexCost > 0) {
      totalInvestment = formValues.capexCost;
    } else if (formValues.bessUnitCost > 0) {
      totalInvestment = bessUnitsRequired * formValues.bessUnitCost;
    } else {
      totalInvestment = actualEnergyKwh * (formValues.bessInstallationCost || 1500);
    }
    
    // Cálculo do payback se tivermos economia anual
    const annualSavings = bessResult.kpiAnnual || totalInvestment / 5;
    const paybackYears = annualSavings > 0 ? totalInvestment / annualSavings : 0;
    
    return {
      success: true,
      results: {
        calculatedPowerKw: bessResult.bessPowerKw,
        calculatedEnergyKwh: bessResult.bessEnergyKwh,
        paybackYears,
        annualSavings,
        roi: (annualSavings * formValues.horizonYears) / totalInvestment * 100,
        npv: 0, // Simplified financial calculation
        isViable: paybackYears > 0 && paybackYears < formValues.horizonYears,
        dispatch24h: bessResult.dispatch24h || [], // Always provide an array, even if empty
      }
    };
  } catch (error) {
    console.error("Error processing BESS simulation result:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro ao processar resultado",
    };
  }
}
