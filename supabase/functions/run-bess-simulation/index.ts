
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Helper functions for the simulation calculations
function calculateGridCost(gridPowerKw: number, demandKw: number, tariffStructure: any, timeInfo: any): number {
  let cost = 0.0;
  const hour = timeInfo.hour;
  const isPeakHour = (
    hour >= tariffStructure.peak_start_hour &&
    hour < tariffStructure.peak_end_hour &&
    timeInfo.is_weekday
  );

  // Cost of Energy (kWh)
  const energyKwh = gridPowerKw * timeInfo.interval_hours;
  if (energyKwh > 0) { // Consumption from grid
    if (isPeakHour) {
      cost += energyKwh * tariffStructure.te_peak;
      cost += energyKwh * tariffStructure.tusd_peak_kwh;
    } else { // Off-peak
      cost += energyKwh * tariffStructure.te_offpeak;
      cost += energyKwh * tariffStructure.tusd_offpeak_kwh;
    }
  }

  return cost;
}

function calculateDieselCost(dieselPowerKw: number, dieselParams: any, timeInfo: any): number {
  if (dieselPowerKw <= 0) {
    return 0.0;
  }

  const kwhGenerated = dieselPowerKw * timeInfo.interval_hours;
  const fuelLiters = kwhGenerated * dieselParams.consumption_l_per_kwh;
  const fuelCost = fuelLiters * dieselParams.fuel_cost_per_liter;
  const omCost = (dieselParams.om_cost_per_hour || 0.0) * timeInfo.interval_hours;

  return fuelCost + omCost;
}

// Main simulation function (simplified version of the Python code)
function runBessSimulation(params: any) {
  // This is a simplified version for demonstration
  // In a real implementation, you would translate the full Python algorithm
  const {
    load_profile_kw,
    pv_profile_kw,
    bess_params,
    tariff_structure,
    diesel_params,
    simulation_params,
    financial_params,
    business_model_params,
    control_strategy
  } = params;

  // Simplified simulation - just returning a basic result structure
  // In a full implementation, this would run the entire simulation logic
  return {
    technical_summary: {
      bess_cycles_estimated: 250,
      annual_energy_throughput_mwh: 120.5,
      annual_solar_curtailment_mwh: 5.2
    },
    financial_summary: {
      annual_cost_base_case_r: 50000,
      annual_cost_with_bess_r: 35000,
      annual_gross_savings_r: 15000,
      npv_r: 45000,
      irr_percent: 15.2,
      payback_discounted_years: 5.3,
      cash_flow_r: [-bess_params.capacity_kwh * 1000, 15000, 15000, 15000, 15000, 15000, 15000, 15000, 15000, 15000, 15000]
    },
    input_summary: {
      bess_params,
      tariff_structure,
      diesel_params,
      financial_params,
      business_model: business_model_params.type
    }
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { method } = req;
    
    if (method === 'POST') {
      const params = await req.json();
      console.log('Running BESS simulation with parameters:', JSON.stringify(params));

      const results = runBessSimulation(params);
      console.log('Simulation results:', JSON.stringify(results));

      return new Response(JSON.stringify(results), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }
    
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 405,
    });
  } catch (error) {
    console.error('Error in run-bess-simulation function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
})
