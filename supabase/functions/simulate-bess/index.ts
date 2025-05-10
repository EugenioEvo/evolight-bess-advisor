
// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { simulateBESS } from "./bess-algorithm.ts";

console.log(`BESS simulation v3 function started.`);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const input = await req.json();
    
    console.log("Received simulation input:", {
      load_profile_length: input.load_profile?.length,
      pv_profile_length: input.pv_profile?.length,
      peak_shaving_required: input.sizing?.peak_shaving_required,
      arbitrage_required: input.sizing?.arbitrage_required,
      ps_mode: input.sizing?.ps_mode,
      ps_value: input.sizing?.ps_value,
    });
    
    // Run the simulation
    const result = simulateBESS(input);
    
    console.log("Simulation results:", {
      modules: result.modules,
      bessPowerKw: result.bessPowerKw,
      bessEnergyKwh: result.bessEnergyKwh,
      annualSavingsR$: result.annualSavingsR$,
      chartData_length: result.chartData?.length,
    });
    
    // Return the result
    return new Response(
      JSON.stringify(result),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200 
      }
    );
  } catch (error) {
    console.error("Error in BESS simulation:", error);
    
    // Return error message with fallback values for the UI
    return new Response(
      JSON.stringify({ 
        error: error.message,
        modules: 1,
        bessPowerKw: 108,
        bessEnergyKwh: 215,
        annualSavingsR$: 0,
        chartData: Array(24).fill(0).map((_, hour) => ({
          hour,
          load: 0,
          grid: 0,
          charge: 0,
          diesel: 0,
          negDis: 0,
          soc: 50,
          dieselRef: 0
        }))
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200  // Still return 200 to prevent UI failures
      }
    );
  }
});
