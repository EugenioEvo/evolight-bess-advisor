
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { calculateBessSize } from "./bess-sizing.ts";
import { RequestBody } from "./types.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Main function to handle the HTTP request
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      load_profile,
      pv_profile,
      tariff_structure,
      sizing_params,
      bess_technical_params,
      simulation_params 
    } = await req.json() as RequestBody;

    // Basic validation
    if (!load_profile || !Array.isArray(load_profile) || load_profile.length === 0) {
      throw new Error("Invalid load profile");
    }

    console.log("Received parameters:", { 
      sizing_params, 
      tariff_structure,
      load_profile_length: load_profile.length,
      pv_profile_present: pv_profile ? true : false,
      pv_profile_length: pv_profile?.length || 0
    });

    // Ensure pv_profile is an array if provided
    const validatedPvProfile = pv_profile && Array.isArray(pv_profile) ? pv_profile : [];

    // Calculate BESS size with proper validation
    const result = calculateBessSize(
      load_profile,
      validatedPvProfile,
      tariff_structure,
      sizing_params,
      bess_technical_params,
      simulation_params
    );

    // Validate result before returning
    const calculatedPowerKw = typeof result.final_power_kw === 'number' && isFinite(result.final_power_kw) 
      ? Math.round(result.final_power_kw * 10) / 10
      : 0;
      
    const calculatedEnergyKwh = typeof result.final_energy_kwh === 'number' && isFinite(result.final_energy_kwh) 
      ? Math.round(result.final_energy_kwh * 10) / 10
      : 0;
      
    console.log("Returning calculated values:", {
      calculated_power_kw: calculatedPowerKw,
      calculated_energy_kwh: calculatedEnergyKwh,
      original_result: result
    });

    return new Response(
      JSON.stringify({
        calculated_power_kw: calculatedPowerKw,
        calculated_energy_kwh: calculatedEnergyKwh
      }),
      { 
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders 
        } 
      }
    )

  } catch (error) {
    console.error("Error in calculate-bess-size function:", error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || "Unknown error in calculate-bess-size function",
        calculated_power_kw: 0,
        calculated_energy_kwh: 0
      }),
      { 
        status: 400, 
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders 
        } 
      }
    )
  }
})
