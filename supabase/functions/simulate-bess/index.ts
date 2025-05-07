
// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { simulateBess } from "./bess-algorithm.ts";

console.log(`BESS simulation v2 function started.`);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const input = await req.json();
    
    console.log("Received simulation input:", {
      load_length: input.load?.length,
      pv_length: input.pv?.length,
      usePS: input.usePS,
      useARB: input.useARB,
      psMode: input.psMode,
      psValue: input.psValue,
    });
    
    // Run the simulation
    const result = simulateBess(input);
    
    console.log("Simulation results:", {
      modules: result.modules,
      bessPowerKw: result.bessPowerKw,
      bessEnergyKwh: result.bessEnergyKwh,
      kpiAnnual: result.kpiAnnual,
      dispatch_length: result.dispatch24h?.length,
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
    
    // Return error message
    return new Response(
      JSON.stringify({ 
        error: error.message,
        modules: 1,
        bessPowerKw: 108,
        bessEnergyKwh: 215,
        kpiAnnual: 0,
        dispatch24h: []
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200  // Still return 200 to prevent UI failures
      }
    );
  }
});
