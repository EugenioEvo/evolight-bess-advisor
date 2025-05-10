
/**
 * Constants for BESS simulation
 */

// BESS module specifications
export const MODULE_POWER_KW = 108;
export const MODULE_ENERGY_KWH = 215;

// Minimum BESS size
export const MIN_POWER_KW = MODULE_POWER_KW;
export const MIN_ENERGY_KWH = MODULE_ENERGY_KWH;

// Default diesel generator parameters
export const DEFAULT_DIESEL_COST_PER_LITER = 5.5;       // R$/liter
export const DEFAULT_DIESEL_SPECIFIC_CONSUMPTION = 0.28; // liters/kWh (typical diesel generator)
export const DEFAULT_DIESEL_CO2_EMISSION_FACTOR = 2.68;  // kgCO2/liter
export const DEFAULT_DIESEL_OPERATIONAL_DAYS = 220;      // days/year (weekdays)
