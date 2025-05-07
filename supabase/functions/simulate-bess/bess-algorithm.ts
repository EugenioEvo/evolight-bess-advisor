// Helper functions
const sum = (arr: number[]): number => arr.reduce((a, b) => a + b, 0);
const range = (start: number, end: number): number[] => {
  const result = [];
  for (let i = start; i <= end; i++) {
    result.push(i);
  }
  return result;
};

// Interface as specified in the requirements
interface SimInput {
  /* PERFIL 24h */
  load: number[];            // kW por hora (0-23)
  pv?: number[];             // kW por hora (0-23), opcional

  /* Janelas e tarifas */
  peakStart: number;         // ex.: 18
  peakEnd: number;           // ex.: 21 (**inclusive**)
  tePeak: number;            // R$/kWh
  tusdPeak: number;          // R$/kWh
  teOff: number;             // R$/kWh
  tusdOff: number;           // R$/kWh
  tusdDemand: number;        // R$/kW·mês

  /* Peak-shaving */
  usePS: boolean;
  psMode: "percent" | "kw" | "target";
  psValue: number;           // 30 (%) OU 500 kW OU 650 kW alvo

  /* Arbitragem */
  useARB: boolean;

  /* BESS limites (módulo = 108 kW / 215 kWh) */
  modulePower: number;       // 108
  moduleEnergy: number;      // 215
  chargeEff: number;         // 0.956   (½ ciclo)
  dischargeEff: number;      // 0.956
  roundEff: number;          // 0.913
  maxSoC: number;            // 1.00
  minSoC: number;            // 0.10
  chargeWindow?: [number, number]; // Optional charge window for arbitrage, e.g. [1, 5]
}

// Dispatch point interface
interface DispatchPoint {
  hour: number;
  load: number;
  pv: number;
  diesel: number;
  charge: number;
  discharge: number;
  grid: number;
  soc: number;
  dieselRef: number; // Changed from optional to required
}

// Final output interface
interface SimResult {
  modules: number;
  bessPowerKw: number;
  bessEnergyKwh: number;
  kpiAnnual: number;
  dispatch24h: DispatchPoint[];
  needPower: number;
  needEnergy: number;
  psPower: number;
  arbPower: number;
  psEnergy: number;
  arbEnergy: number;
}

export function simulateBess(input: SimInput): SimResult {
  // Ensure we have valid data with defaults
  const {
    load = Array(24).fill(100),
    pv = Array(24).fill(0),
    peakStart = 18,
    peakEnd = 21,
    tePeak = 0.8,
    tusdPeak = 0.2,
    teOff = 0.4,
    tusdOff = 0.1,
    tusdDemand = 50,
    usePS = true,
    psMode = "percent",
    psValue = 30,
    useARB = false,
    modulePower = 108,
    moduleEnergy = 215,
    chargeEff = 0.956,
    dischargeEff = 0.956,
    roundEff = 0.913,
    maxSoC = 1.0,
    minSoC = 0.1,
    chargeWindow = [1, 5]
  } = input;
  
  // Initialize variables
  let psPower = 0;
  let psEnergy = 0;
  let psEnergyBatt = 0;
  let arbPower = 0;
  let arbEnergyBatt = 0;

  // Define peak hours
  const peakHours = range(peakStart, peakEnd);
  const effectiveHours = peakHours.length;
  
  // Calculate max load in peak hours
  const peakLoads = peakHours.map(h => load[h] || 0);
  const maxLoad = Math.max(...peakLoads);
  
  // Step 2: Peak-Shaving v2
  if (usePS) {
    /* 2.1 Potência a shaving */
    switch (psMode) {
      case "percent": psPower = maxLoad * psValue/100; break;
      case "kw": psPower = psValue; break;
      case "target": psPower = Math.max(0, maxLoad - psValue); break;
    }
    
    /* 2.2 Potência ≯ maxLoad */
    psPower = Math.min(psPower, maxLoad);
    
    /* 2.3 Energia de pico */
    psEnergy = psPower * effectiveHours;  // kWh
    
    /* 2.4 Percentual de redução */
    const pct = psPower / maxLoad;
    if (pct > 0.90) {
      // Caso extremo
      psEnergy = sum(peakHours.map(h => load[h] || 0)); // toda a energia
    }
    
    /* 2.5 Ajuste de eficiência */
    psEnergyBatt = psEnergy / dischargeEff;
    
    console.log("Peak Shaving Calculation:", {
      psPower,
      psEnergy,
      psEnergyBatt,
      pct,
      maxLoad,
      peakHours
    });
  }
  
  // Step 3: Arbitragem v2
  if (useARB) {
    /* 3.1 Se já existe PS, reutiliza psPower */
    if (usePS) {
      arbPower = psPower;
      const peakEnergyAfterPS = sum(peakHours.map(h => load[h] || 0)) - psEnergy; // kWh
      arbEnergyBatt = peakEnergyAfterPS / dischargeEff;
    } else {
      const avgPeakLoad = sum(peakHours.map(h => load[h] || 0)) / Math.max(1, effectiveHours);
      arbPower = avgPeakLoad * 0.8; // regra 80%
      arbEnergyBatt = arbPower * effectiveHours / dischargeEff;
    }
    
    /* 3.2 Excedente PV diário */
    if (pv && pv.length > 0) {
      const dailyPVexcess = sum(pv) - sum(load);  // kWh
      if (dailyPVexcess > 0) {
        arbEnergyBatt = Math.max(arbEnergyBatt, dailyPVexcess / chargeEff);
      }
    }
    
    console.log("Arbitrage Calculation:", {
      arbPower,
      arbEnergyBatt
    });
  }
  
  // Step 4: Dimensionamento modular
  const needPower = Math.max(psPower, arbPower);
  const needEnergy = Math.max(psEnergyBatt, arbEnergyBatt);
  
  /* Buffer 10% */
  const bufPower = needPower * 1.10;
  const bufEnergy = needEnergy * 1.10;
  
  /* N.º de módulos indivisíveis */
  const nByPower = Math.ceil(bufPower / modulePower);
  const nByEnergy = Math.ceil(bufEnergy / moduleEnergy);
  const nModules = Math.max(nByPower, nByEnergy, 1); // At least 1 module
  
  /* Capacidade final instalada */
  const bessPowerKw = nModules * modulePower;
  const bessEnergyKwh = nModules * moduleEnergy;
  
  // Step 5: Economia anual
  const energyPriceDiff = (tePeak + tusdPeak) - (teOff + tusdOff);
  let annualSavings = 0;
  
  if (usePS) {
    annualSavings += psPower * tusdDemand * 12;
  }
  
  if (useARB) {
    const dailyCycleKWh = Math.min(
      bessEnergyKwh * 0.85, // 85% utilizável
      sum(peakHours.map(h => load[h] || 0)) * 0.7
    );
    annualSavings += dailyCycleKWh * energyPriceDiff * 22 * 12; // 22 dias úteis
  }
  
  // Step 6: Generate dispatch data for the chart
  const dispatch24h: DispatchPoint[] = [];
  let currentSoc = (maxSoC + minSoC) / 2 * 100; // Start at middle SoC in percentage
  
  // Generate dispatch data for a 24-hour period
  for (let hour = 0; hour < 24; hour++) {
    const pvValue = pv[hour] || 0;
    const loadValue = load[hour] || 0;
    
    // Initialize values
    let chargeValue = 0;
    let dischargeValue = 0;
    let gridValue = 0;
    let dieselValue = 0;
    let dieselRef = 0;
    
    // Discharge during peak hours for peak shaving
    if (usePS && peakHours.includes(hour)) {
      dischargeValue = Math.min(psPower, loadValue);
      // Mark reference diesel value (what would have been used without BESS)
      dieselRef = loadValue;
    }
    
    // Charge during charge window for arbitrage
    if (useARB && hour >= chargeWindow[0] && hour <= chargeWindow[1]) {
      // Only charge if there's room and not already discharging
      if (dischargeValue === 0 && currentSoc < maxSoC * 100) {
        // Estimate charge based on remaining capacity
        const roomForCharge = (maxSoC * 100 - currentSoc) / 100 * bessEnergyKwh;
        chargeValue = Math.min(bessPowerKw, roomForCharge);
      }
    }
    
    // Calculate grid consumption (after accounting for PV, BESS charge/discharge)
    gridValue = Math.max(0, loadValue + chargeValue - pvValue - dischargeValue);
    
    // Update SoC based on charge/discharge
    if (chargeValue > 0) {
      // Add energy to battery with efficiency
      currentSoc += (chargeValue * chargeEff) / bessEnergyKwh * 100;
    }
    if (dischargeValue > 0) {
      // Remove energy from battery with efficiency
      currentSoc -= (dischargeValue / dischargeEff) / bessEnergyKwh * 100;
    }
    
    // Ensure SoC stays within bounds
    currentSoc = Math.max(minSoC * 100, Math.min(maxSoC * 100, currentSoc));
    
    // Add data point to dispatch
    dispatch24h.push({
      hour,
      load: loadValue,
      pv: pvValue,
      diesel: dieselValue,
      charge: chargeValue,
      discharge: dischargeValue,
      grid: gridValue,
      soc: currentSoc,
      dieselRef
    });
  }
  
  return {
    modules: nModules,
    bessPowerKw,
    bessEnergyKwh,
    kpiAnnual: annualSavings,
    dispatch24h,
    needPower,
    needEnergy,
    psPower,
    arbPower,
    psEnergy: psEnergyBatt,
    arbEnergy: arbEnergyBatt
  };
}
