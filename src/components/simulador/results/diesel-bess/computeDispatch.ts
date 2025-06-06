
/*
  inData = { profile:[kW…24], params:{ ... } }
  out    = { chartData:[{hour,…}], kpi:{dieselSavedKWh, dieselSavedLiters, gridKWh, costBaseline, costReal, economy} }
*/

export interface ComputeDispatchParams {
  chargePower: number;
  dischargePower: number;
  bessEnergy: number;
  bessEff: number;
  soc0: number;
  socMin: number;
  chargeWindow: [number, number];
  dischargeWindow: [number, number];
  dieselCost: number;
  dieselYield: number;
  gridCostFora: number;
  gridCostPonta: number;
}

export function computeDispatch(inData: {
  profile: number[],
  params: ComputeDispatchParams
}) {
  const { profile, params: p } = inData;
  const H = 24;
  const load = profile.slice(0, H);
  const dieselBaseline = Array(H).fill(0);
  
  // Find peak hours diesel load (baseline)
  for(let h = 18; h < 21; h++) {
    if (h < load.length) {
      dieselBaseline[h] = load[h];
    }
  }

  const r = [];
  let energy = p.soc0 * p.bessEnergy;

  const toKWh = (arr: number[]) => arr.reduce((s, v) => s + v, 0);

  const charge = Array(H).fill(0),
        discharge = Array(H).fill(0),
        diesel = Array(H).fill(0),
        grid = Array(H).fill(0),
        soc = Array(H).fill(0),
        pv = Array(H).fill(0); // Added PV array for future use

  for(let h = 0; h < H; h++) {
    let l = load[h] || 0;

    /* --- DESCARGA BESS (18-21 h) --- */
    if(h >= 18 && h < 21 && energy > p.bessEnergy * p.socMin) {
      const eAvail = Math.max(0, energy - p.bessEnergy * p.socMin);
      const pAvail = Math.min(p.dischargePower, eAvail);
      discharge[h] = Math.min(l, pAvail);
      energy -= discharge[h] / p.bessEff;
      l -= discharge[h];
    }

    /* --- DIESEL (somente após BESS) --- */
    if(h >= 18 && h < 21) {
      diesel[h] = l;            // cobre 100 % do saldo
      l = 0;
    }

    /* --- GRID --- */
    grid[h] = l;                // fora da ponta ou se BESS+diesel não cobriram

    /* --- CARGA BESS de madrugada --- */
    if(h >= p.chargeWindow[0] && h < p.chargeWindow[1] && energy < p.bessEnergy) {
      const room = p.bessEnergy - energy;
      const pRoom = Math.min(p.chargePower, room);
      charge[h] = pRoom;
      energy += charge[h] * p.bessEff;
      grid[h] += charge[h];     // potência extra da rede
    }

    soc[h] = (energy / p.bessEnergy) * 100;

    r.push({
      hour: h,
      load: load[h] || 0,
      grid: grid[h],
      diesel: diesel[h],
      charge: charge[h],
      discharge: discharge[h],
      soc: soc[h],
      dieselRef: dieselBaseline[h],
      pv: pv[h] // Added PV field (currently always 0)
    });
  }

  /* --- KPIs --- */
  const dieselSavedKWh = toKWh(dieselBaseline) - toKWh(diesel);
  const dieselSavedLiters = dieselSavedKWh / p.dieselYield;
  
  const costBaseline = toKWh(dieselBaseline) * p.dieselCost / p.dieselYield;
  
  const gridPonta = grid.slice(18, 21);
  const gridFora = [...grid.slice(0, 18), ...grid.slice(21)];
  const costReal = toKWh(diesel) * p.dieselCost / p.dieselYield +
                   toKWh(gridPonta) * p.gridCostPonta +
                   toKWh(gridFora) * p.gridCostFora;
  
  const economy = costBaseline - costReal;

  return {
    chartData: r,
    kpi: {
      dieselSavedKWh,
      dieselSavedLiters,
      costBaseline,
      costReal,
      economy
    }
  };
}

// New function that uses the results from the new simulation
export function processSimulationResults(simulationResult: {
  dispatch24h: Array<{
    hour: number;
    load: number;
    pv: number;
    diesel: number;
    charge: number;
    discharge: number;
    grid: number;
    soc: number;
    dieselRef?: number;
  }>;
  kpiAnnual: number;
  dieselConsumptionAvoidedAnnual_liters?: number;
  dieselCostAvoidedAnnual_R$?: number;
  dieselCO2EmissionsAvoidedAnnual_kg?: number;
  bessOpCostForDieselReplacementAnnual_R$?: number;
  netSavingsDieselReplacementAnnual_R$?: number;
}, params: {
  dieselCost: number;
  dieselYield: number;
}) {
  if (!simulationResult || !simulationResult.dispatch24h || !Array.isArray(simulationResult.dispatch24h)) {
    console.error("Invalid simulation result for processing", simulationResult);
    return {
      chartData: [],
      kpi: {
        dieselSavedKWh: 0,
        dieselSavedLiters: 0,
        costBaseline: 0,
        costReal: 0,
        economy: 0,
        co2Reduction: 0,
        bessOpCost: 0
      }
    };
  }
  
  // Extract data from simulation result and ensure dieselRef is always defined
  const dispatch = simulationResult.dispatch24h.map(point => ({
    ...point,
    dieselRef: point.dieselRef ?? 0 // Ensure dieselRef is always defined
  }));
  
  // Calculate KPIs
  const dieselBaselineKWh = dispatch.reduce((sum, point) => sum + (point.dieselRef || 0), 0);
  const dieselRealKWh = dispatch.reduce((sum, point) => sum + (point.diesel || 0), 0);
  const dieselSavedKWh = dieselBaselineKWh - dieselRealKWh;
  const dieselSavedLiters = dieselSavedKWh / params.dieselYield;
  
  // Calculate costs
  const costBaseline = dieselBaselineKWh * params.dieselCost / params.dieselYield;
  
  // Get the current cost from the simulation or calculate it
  const costReal = dieselRealKWh * params.dieselCost / params.dieselYield;
  
  // Calculate economy
  const economy = costBaseline - costReal;
  
  // Add CO2 reduction and BESS operational cost metrics if available from simulation
  const co2Reduction = simulationResult.dieselCO2EmissionsAvoidedAnnual_kg || 0;
  const bessOpCost = simulationResult.bessOpCostForDieselReplacementAnnual_R$ || 0;
  
  return {
    chartData: dispatch,
    kpi: {
      dieselSavedKWh,
      dieselSavedLiters,
      costBaseline,
      costReal,
      economy: simulationResult.netSavingsDieselReplacementAnnual_R$ || economy,
      co2Reduction,
      bessOpCost
    }
  };
}
