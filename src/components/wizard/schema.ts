
import { z } from 'zod';

// Define schema for wizard form validation
export const wizardSchema = z.object({
  // Step 1 - Site context
  siteType: z.string().optional(),
  tariffGroup: z.string().optional(),
  hasPv: z.boolean().default(false),
  pvPowerKwp: z.number().min(0).default(0),
  hasDiesel: z.boolean().default(false),
  dieselPowerKw: z.number().min(0).default(0),
  
  // Step 2 - Strategy
  objectives: z.array(z.string()).default([]),
  hasBlackouts: z.boolean().default(false),
  canInjectToGrid: z.boolean().default(true),
  focusTechnical: z.boolean().default(false),
  
  // Step 3 - Constraints
  hasSpaceConstraints: z.boolean().default(false),
  hasTransformerConstraints: z.boolean().default(false),
  transformerLimitKva: z.number().min(0).default(0),
  needsBackup: z.boolean().default(false),
  criticalLoadKw: z.number().min(0).default(0),
  backupHours: z.number().min(0).default(0),
  
  // Step 4 - Tariff
  simpleTariff: z.number().min(0).default(0),
  tePeak: z.number().min(0).default(0),
  teOffpeak: z.number().min(0).default(0),
  tusdPeak: z.number().min(0).default(0),
  tusdOffpeak: z.number().min(0).default(0),
  peakStartHour: z.number().min(0).max(23).default(18),
  peakEndHour: z.number().min(0).max(23).default(21),
  peakDemandKw: z.number().min(0).default(0),
  offpeakDemandKw: z.number().min(0).default(0),
  peakContractedDemandKw: z.number().min(0).default(0),
  offpeakContractedDemandKw: z.number().min(0).default(0),
  demandCharge: z.number().min(0).default(0),
  
  // Step 5 - Profile
  profileEntryMethod: z.enum(['simple', 'hourly', 'upload']).default('simple'),
  hourlyDemandKw: z.array(z.number()).default(Array(24).fill(0)),
  profileType: z.enum(['daytime', 'nighttime', 'constant']).optional(),
  
  // PV profile
  pvProfileMethod: z.enum(['auto', 'upload']).default('auto'),
  hourlyPvKw: z.array(z.number()).default(Array(24).fill(0)),
});

export type WizardFormValues = z.infer<typeof wizardSchema>;

// Define objective options
export const OBJECTIVE_OPTIONS = [
  { 
    value: 'reduce_bill', 
    label: 'Economizar na conta de luz', 
    description: 'Reduzir o custo total com energia ao longo do mês',
    icon: 'dollar-sign'
  },
  { 
    value: 'peak_shaving', 
    label: 'Reduzir a demanda de ponta (Peak Shaving)', 
    description: 'Evitar cobranças por demanda contratada durante o horário de pico',
    icon: 'trending-down'
  },
  { 
    value: 'backup', 
    label: 'Backup para evitar perdas em caso de queda de energia', 
    description: 'Garantir operação de cargas críticas mesmo sem rede elétrica',
    icon: 'shield'
  },
  { 
    value: 'grid_zero', 
    label: 'Operar em modo autônomo (Grid Zero)', 
    description: 'Minimizar ou zerar a troca de energia com a concessionária',
    icon: 'grid'
  },
  { 
    value: 'pv_optim', 
    label: 'Usar melhor minha geração solar (Arbitragem Solar)', 
    description: 'Guardar excedente solar para usar à noite',
    icon: 'sun'
  }
];
