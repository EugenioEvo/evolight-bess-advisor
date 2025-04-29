
import { z } from "zod";

export const simuladorFormSchema = z.object({
  projectName: z.string().min(2, { message: "Nome do projeto deve ter no mínimo 2 caracteres" }),
  installationType: z.enum(["industrial", "commercial", "residential", "other"]),
  location: z.string().optional(),
  
  // Perfil de Consumo
  loadEntryMethod: z.enum(["average", "upload"]).default("average"),
  // Demanda
  avgPeakDemandKw: z.coerce.number()
    .min(0, { message: "Demanda média na ponta deve ser maior ou igual a 0" })
    .default(0),
  avgOffpeakDemandKw: z.coerce.number()
    .min(0, { message: "Demanda média fora de ponta deve ser maior ou igual a 0" })
    .default(0),
  maxPeakDemandKw: z.coerce.number()
    .min(0, { message: "Demanda máxima na ponta deve ser maior ou igual a 0" })
    .default(0),
  maxOffpeakDemandKw: z.coerce.number()
    .min(0, { message: "Demanda máxima fora de ponta deve ser maior ou igual a 0" })
    .default(0),
  // Consumo
  avgDailyPeakConsumptionKwh: z.coerce.number()
    .min(0, { message: "Consumo diário na ponta deve ser maior ou igual a 0" })
    .default(0),
  avgDailyOffpeakConsumptionKwh: z.coerce.number()
    .min(0, { message: "Consumo diário fora de ponta deve ser maior ou igual a 0" })
    .default(0),
  avgMonthlyPeakConsumptionKwh: z.coerce.number()
    .min(0, { message: "Consumo mensal na ponta deve ser maior ou igual a 0" })
    .default(0),
  avgMonthlyOffpeakConsumptionKwh: z.coerce.number()
    .min(0, { message: "Consumo mensal fora de ponta deve ser maior ou igual a 0" })
    .default(0),
  
  // Parâmetros BESS
  bessCapacityKwh: z.coerce.number().min(1, { message: "Capacidade deve ser maior que 0" }),
  bessPowerKw: z.coerce.number().min(1, { message: "Potência deve ser maior que 0" }),
  bessEfficiency: z.coerce.number().min(50, { message: "Eficiência mínima é 50%" }).max(100, { message: "Eficiência máxima é 100%" }).default(90),
  bessMaxDod: z.coerce.number().min(1, { message: "DoD mínimo é 1%" }).max(100, { message: "DoD máximo é 100%" }).default(85),
  bessInitialSoc: z.coerce.number().min(0, { message: "SoC mínimo é 0%" }).max(100, { message: "SoC máximo é 100%" }).default(50),
  bessTechnology: z.enum(["lfp", "nmc"]).default("lfp"),
  bessLifetime: z.coerce.number().min(1).max(30).default(10),
  bessAnnualDegradation: z.coerce.number().min(0).max(10).default(1),
  bessDailySelfdischarge: z.coerce.number().min(0).max(5).default(0.1),

  // Sistema Solar
  hasPv: z.boolean().default(false),
  pvDataEntryMethod: z.enum(["power", "upload"]).default("power"),
  pvPowerKwp: z.coerce.number().min(0).default(0),
  pvAnnualGeneration: z.coerce.number().min(0).default(0),
  pvPolicy: z.enum(["inject", "grid_zero"]).default("inject"),
  
  // Estrutura Tarifária
  tarifaryGroup: z.enum(["groupA", "groupB"]).default("groupA"),
  modalityA: z.enum(["blue", "green"]).default("blue"),
  tePeak: z.coerce.number().min(0, { message: "Valor deve ser maior ou igual a 0" }),
  teOffpeak: z.coerce.number().min(0, { message: "Valor deve ser maior ou igual a 0" }),
  teIntermediate: z.coerce.number().min(0, { message: "Valor deve ser maior ou igual a 0" }).default(0),
  tusdPeakKwh: z.coerce.number().min(0, { message: "Valor deve ser maior ou igual a 0" }),
  tusdOffpeakKwh: z.coerce.number().min(0, { message: "Valor deve ser maior ou igual a 0" }),
  tusdIntermediateKwh: z.coerce.number().min(0, { message: "Valor deve ser maior ou igual a 0" }).default(0),
  tusdPeakKw: z.coerce.number().min(0, { message: "Valor deve ser maior ou igual a 0" }),
  tusdOffpeakKw: z.coerce.number().min(0, { message: "Valor deve ser maior ou igual a 0" }),
  tariffB: z.coerce.number().min(0, { message: "Valor deve ser maior ou igual a 0" }).default(0),
  flagCost: z.coerce.number().min(0, { message: "Valor deve ser maior ou igual a 0" }).default(0),
  peakStartHour: z.coerce.number().min(0, { message: "Valor deve estar entre 0 e 23" }).max(23, { message: "Valor deve estar entre 0 e 23" }).default(18),
  peakEndHour: z.coerce.number().min(0, { message: "Valor deve estar entre 0 e 23" }).max(23, { message: "Valor deve estar entre 0 e 23" }).default(21),
  contractedPeakDemandKw: z.coerce.number()
    .min(0, { message: "Demanda contratada deve ser maior ou igual a 0" })
    .default(0),
  contractedOffpeakDemandKw: z.coerce.number()
    .min(0, { message: "Demanda contratada deve ser maior ou igual a 0" })
    .default(0),
  
  // Gerador Diesel
  hasDiesel: z.boolean().default(false),
  dieselPowerKw: z.coerce.number().min(0).default(0),
  dieselConsumption: z.coerce.number().min(0).default(0.3),
  dieselFuelCost: z.coerce.number().min(0).default(6.50),
  dieselOmCost: z.coerce.number().min(0).default(0),
  
  // Parâmetros Financeiros
  discountRate: z.coerce.number().min(0).default(10),
  horizonYears: z.coerce.number().min(1).default(10),
  businessModel: z.enum(["turnkey", "eaas"]).default("turnkey"),
  capexCost: z.coerce.number().min(0).default(0),
  bessInstallationCost: z.coerce.number().min(0).default(1500),
  bessUnitCost: z.coerce.number().min(0).default(300000),
  annualOmCost: z.coerce.number().min(0).default(2),
  setupCost: z.coerce.number().min(0).default(0),
  annualServiceCost: z.coerce.number().min(0).default(0),
  incentivesValue: z.coerce.number().min(0).default(0),
  annualLoadGrowth: z.coerce.number().min(0).default(0),
  annualTariffAdjustment: z.coerce.number().min(0).default(5),
  
  // Upgrade de Rede
  avoidsGridUpgrade: z.boolean().default(false),
  avoidedUpgradeCost: z.coerce.number().min(0).default(0),
  upgradeForeseeenYear: z.coerce.number().min(0).default(0),
  
  // Impostos
  considerTaxes: z.boolean().default(false),
  taxRate: z.coerce.number().min(0).max(100).default(34),
  
  // Estratégias de Controle
  usePeakShaving: z.boolean().default(true),
  useArbitrage: z.boolean().default(false),
  useBackup: z.boolean().default(false),
  usePvOptim: z.boolean().default(false),
  peakShavingMethod: z.enum(["percentage", "reduction", "target"]).default("percentage"),
  peakShavingTarget: z.coerce.number().min(0).default(0),
  peakShavingPercentage: z.coerce.number().min(0).max(100).default(30),
  peakShavingStartHour: z.coerce.number().min(0).max(23).default(18),  // Nova propriedade
  peakShavingEndHour: z.coerce.number().min(0).max(23).default(21),    // Nova propriedade
  peakShavingDurationHours: z.coerce.number().min(0).max(24).default(3), // Nova propriedade
  criticalLoadKw: z.coerce.number().min(0).default(0),
  backupDurationHours: z.coerce.number().min(0).default(2),
});

export type SimuladorFormValues = z.infer<typeof simuladorFormSchema>;
