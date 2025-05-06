
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

    console.log("Received parameters:", { sizing_params, tariff_structure });

    // Calculate BESS size
    const result = calculateBessSize(
      load_profile,
      pv_profile,
      tariff_structure,
      sizing_params,
      bess_technical_params,
      simulation_params
    );

    return new Response(
      JSON.stringify({
        calculated_power_kw: Math.round(result.final_power_kw * 10) / 10,
        calculated_energy_kwh: Math.round(result.final_energy_kwh * 10) / 10
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
      JSON.stringify({ error: error.message || "Unknown error in calculate-bess-size function" }),
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
