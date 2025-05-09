
import { toast } from "sonner";
import { SimuladorFormValues } from "@/schemas/simuladorSchema";
import { generateLoadProfile, generatePvProfile } from "./loadProfileGenerator";
import { buildSizingParams } from "./simulationParamBuilder";
import { calculateFinancialMetrics } from "./financialCalculations";
import { SimulationResults, SimulationResponse } from "./types";

/**
 * Run the legacy simulation approach when the new BESS simulation fails
 */
export async function runLegacySimulation(
  values: SimuladorFormValues,
  calculateBessSize: Function,
  validateParams: Function
): Promise<SimulationResponse> {
  try {
    // Generate load and PV profiles
    const loadProfile = generateLoadProfile(values);
    const pvProfile = generatePvProfile(values);
    
    console.log("Generated profiles:", {
      loadProfile: loadProfile?.length,
      pvProfile: pvProfile?.length,
      hasPv: values.hasPv,
      pvPowerKwp: values.pvPowerKwp
    });
    
    if (!loadProfile || loadProfile.length === 0) {
      toast.error("Perfil de carga inválido", {
        description: "Não foi possível gerar o perfil de carga. Verifique os dados de entrada."
      });
      return { success: false, error: new Error("Perfil de carga inválido") };
    }
    
    // Build simulation parameters
    const simulationParams = buildSizingParams(values);
    simulationParams.load_profile = loadProfile;
    simulationParams.pv_profile = pvProfile || [];
    
    console.log("Sending to Edge Function:", simulationParams);
    
    // Validate parameters before sending to edge function
    if (!validateParams(simulationParams)) {
      const errorMessage = "Parâmetros inválidos. Verifique se pelo menos uma estratégia de dimensionamento está habilitada.";
      toast.error("Parâmetros inválidos", {
        description: "Verifique os dados de entrada e tente novamente"
      });
      return { success: false, error: new Error(errorMessage) };
    }

    // Call the sizing calculation endpoint
    let sizingResult;
    try {
      sizingResult = await calculateBessSize(simulationParams);
      console.log("Received sizing result:", sizingResult);
    } catch (callError) {
      console.error('Error calling BESS size calculation function:', callError);
      // Se falhar, use valores padrão mas informe ao usuário
      toast.warning("Usando dimensionamento padrão", {
        description: "Não foi possível calcular o dimensionamento. Usando valores padrão."
      });
      sizingResult = {
        calculated_power_kw: values.bessPowerKw || 108,
        calculated_energy_kwh: values.bessCapacityKwh || 215
      };
    }
    
    // Validate sizing result to ensure we have valid numerical values
    const calculatedPowerKw = typeof sizingResult.calculated_power_kw === 'number' && 
      !isNaN(sizingResult.calculated_power_kw) ? 
      sizingResult.calculated_power_kw : (values.bessPowerKw || 108);
      
    const calculatedEnergyKwh = typeof sizingResult.calculated_energy_kwh === 'number' && 
      !isNaN(sizingResult.calculated_energy_kwh) ? 
      sizingResult.calculated_energy_kwh : (values.bessCapacityKwh || 215);
    
    // Calculate financial metrics with validated values
    const financials = calculateFinancialMetrics(
      values, 
      calculatedPowerKw,
      calculatedEnergyKwh
    );
    
    // Build and set simulation results
    const results: SimulationResults = {
      calculatedPowerKw: calculatedPowerKw,
      calculatedEnergyKwh: calculatedEnergyKwh,
      paybackYears: financials.paybackYears,
      annualSavings: financials.annualSavings,
      roi: financials.roi,
      isViable: financials.isViable
    };
    
    console.log("Final simulation results:", results);
    
    toast.success("BESS dimensionado com sucesso!", {
      description: `Potência: ${calculatedPowerKw.toFixed(2)} kW, Capacidade: ${calculatedEnergyKwh.toFixed(2)} kWh`
    });
    
    return { success: true, results };
  } catch (error) {
    console.error("Error in legacy simulation:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error : new Error("Unknown error in legacy simulation") 
    };
  }
}
