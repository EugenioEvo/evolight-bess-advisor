import { z } from "zod";

export const simuladorFormSchema = z.object({
  projectName: z.string().min(2, { message: "Nome do projeto deve ter no mínimo 2 caracteres" }),
  installationType: z.enum(["industrial", "commercial", "residential"]),
  
  bessCapacityKwh: z.coerce.number().min(1, { message: "Capacidade deve ser maior que 0" }),
  bessPowerKw: z.coerce.number().min(1, { message: "Potência deve ser maior que 0" }),
  bessEfficiency: z.coerce.number().min(50, { message: "Eficiência mínima é 50%" }).max(100, { message: "Eficiência máxima é 100%" }).default(90),
  bessMaxDod: z.coerce.number().min(1, { message: "DoD mínimo é 1%" }).max(100, { message: "DoD máximo é 100%" }).default(85),
  bessInitialSoc: z.coerce.number().min(0, { message: "SoC mínimo é 0%" }).max(100, { message: "SoC máximo é 100%" }).default(50),

  hasPv: z.boolean().default(false),
  pvPowerKwp: z.coerce.number().min(0).default(0),
  pvPolicy: z.enum(["inject", "grid_zero"]).default("inject"),
  
  tePeak: z.coerce.number().min(0, { message: "Valor deve ser maior ou igual a 0" }),
  teOffpeak: z.coerce.number().min(0, { message: "Valor deve ser maior ou igual a 0" }),
  tusdPeakKwh: z.coerce.number().min(0, { message: "Valor deve ser maior ou igual a 0" }),
  tusdOffpeakKwh: z.coerce.number().min(0, { message: "Valor deve ser maior ou igual a 0" }),
  tusdPeakKw: z.coerce.number().min(0, { message: "Valor deve ser maior ou igual a 0" }),
  tusdOffpeakKw: z.coerce.number().min(0, { message: "Valor deve ser maior ou igual a 0" }),
  peakStartHour: z.coerce.number().min(0, { message: "Valor deve estar entre 0 e 23" }).max(23, { message: "Valor deve estar entre 0 e 23" }).default(18),
  peakEndHour: z.coerce.number().min(0, { message: "Valor deve estar entre 0 e 23" }).max(23, { message: "Valor deve estar entre 0 e 23" }).default(21),
  
  hasDiesel: z.boolean().default(false),
  dieselPowerKw: z.coerce.number().min(0).default(0),
  dieselConsumption: z.coerce.number().min(0).default(0.3),
  dieselFuelCost: z.coerce.number().min(0).default(6.50),
  
  discountRate: z.coerce.number().min(0).default(10),
  horizonYears: z.coerce.number().min(1).default(10),
  businessModel: z.enum(["turnkey", "eaas"]).default("turnkey"),
  capexCost: z.coerce.number().min(0).default(0),
  annualOmCost: z.coerce.number().min(0).default(0),
  setupCost: z.coerce.number().min(0).default(0),
  annualServiceCost: z.coerce.number().min(0).default(0),
  
  usePeakShaving: z.boolean().default(true),
  useArbitrage: z.boolean().default(false),
  useBackup: z.boolean().default(false),
  usePvOptim: z.boolean().default(false),
  peakShavingTarget: z.coerce.number().min(0).default(0),
  
  avgPeakDemandKw: z.coerce.number()
    .min(0, { message: "Demanda média deve ser maior ou igual a 0" })
    .default(0),
  
  maxPeakDemandKw: z.coerce.number()
    .min(0, { message: "Demanda máxima deve ser maior ou igual a 0" })
    .default(0),
  
  avgDailyConsumptionKwh: z.coerce.number()
    .min(0, { message: "Consumo diário deve ser maior ou igual a 0" })
    .default(0),
  
  avgMonthlyConsumptionKwh: z.coerce.number()
    .min(0, { message: "Consumo mensal deve ser maior ou igual a 0" })
    .default(0),
  
  contractedPeakDemandKw: z.coerce.number()
    .min(0, { message: "Demanda contratada deve ser maior ou igual a 0" })
    .default(0),
  
  contractedOffpeakDemandKw: z.coerce.number()
    .min(0, { message: "Demanda contratada deve ser maior ou igual a 0" })
    .default(0),
});

export type SimuladorFormValues = z.infer<typeof simuladorFormSchema>;
