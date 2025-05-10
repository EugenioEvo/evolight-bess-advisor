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
    
    // Ensure we always have some dispatch data
    const dispatch24h = Array.isArray(bessResult.dispatch24h) && bessResult.dispatch24h.length > 0
      ? bessResult.dispatch24h
      : generateDefaultDispatchData(bessResult.bessPowerKw, bessResult.bessEnergyKwh);
    
    console.log("Processed BESS simulation result with dispatch data:", dispatch24h);
    
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
        dispatch24h: dispatch24h, 
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

/**
 * Generates default dispatch data if the simulation doesn't provide any
 */
function generateDefaultDispatchData(powerKw: number, energyKwh: number) {
  const dispatchData = [];
  let soc = 50; // Start at 50% SoC
  
  for (let hour = 0; hour < 24; hour++) {
    // Generate a synthetic load profile with peaks in the afternoon
    let loadProfile = 100 + Math.sin((hour - 6) * Math.PI / 12) * 50;
    loadProfile = Math.max(50, loadProfile);
    
    // More load during business hours (8am-6pm)
    if (hour >= 8 && hour <= 18) {
      loadProfile *= 1.3;
    }
    
    let discharge = 0;
    let charge = 0;
    let diesel = 0;
    let grid = loadProfile;
    let dieselRef = 0;
    let pv = 0;
    
    // Add some PV generation during daylight hours (6am-6pm)
    if (hour >= 6 && hour <= 18) {
      pv = Math.sin((hour - 6) * Math.PI / 12) * (powerKw * 0.8);
      pv = Math.max(0, pv);
      grid -= pv;
    }
    
    // Discharge during peak hours (6pm-9pm)
    if (hour >= 18 && hour <= 21) {
      discharge = Math.min(powerKw * 0.9, loadProfile * 0.6);
      grid -= discharge;
      soc -= (discharge / energyKwh) * 100;
      dieselRef = loadProfile * 0.6; // What would have been used by diesel
    }
    
    // Charge during off-peak hours (midnight-5am)
    if (hour >= 0 && hour <= 5) {
      charge = Math.min(powerKw * 0.7, (100 - soc) / 100 * energyKwh);
      grid += charge;
      soc += (charge / energyKwh) * 80; // 80% efficiency
    }
    
    // Ensure SoC stays within bounds
    soc = Math.max(10, Math.min(100, soc));
    
    dispatchData.push({
      hour,
      load: loadProfile,
      pv,
      diesel,
      charge,
      discharge,
      grid: Math.max(0, grid),
      soc,
      dieselRef
    });
  }
  
  return dispatchData;
}
