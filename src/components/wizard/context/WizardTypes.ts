
import { z } from 'zod';
import { WizardFormValues, wizardSchema } from '../schema';

export type WizardStep = 'site' | 'strategy' | 'constraints' | 'tariff' | 'profile' | 'results';

export interface WizardContextType {
  currentStep: WizardStep;
  setCurrentStep: (step: WizardStep) => void;
  steps: WizardStep[];
  nextStep: () => void;
  prevStep: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  isLoading: boolean;
  isSimulating: boolean;
  isSaving: boolean;
  simulationResults: any;
  runSimulation: () => Promise<any>;
  saveProgress: () => Promise<void>;
  loadSavedSimulation: (id: string) => Promise<void>;
  goToStep: (step: WizardStep) => void;
  canProceed: boolean;
  setCanProceed: (can: boolean) => void;
  siteTypeOptions: { label: string; value: string; icon: string }[];
  tariffGroupOptions: { label: string; value: string; description: string }[];
  hasErrors: boolean;
  validationErrors: Record<string, string[]>;
}

// Define options for various dropdowns
export const siteTypeOptions = [
  { label: 'Industrial', value: 'industrial', icon: 'factory' },
  { label: 'Comercial', value: 'commercial', icon: 'building' },
  { label: 'Rural', value: 'rural', icon: 'home' },
  { label: 'Outro', value: 'other', icon: 'puzzle' },
];

export const tariffGroupOptions = [
  { 
    label: 'Grupo A', 
    value: 'groupA',
    description: 'Alta tensão com demanda contratada (indústrias e grandes comércios)'
  },
  { 
    label: 'Grupo B', 
    value: 'groupB',
    description: 'Baixa tensão com tarifa única (pequenos comércios e residências)'
  },
  { 
    label: 'Não sei', 
    value: 'unknown',
    description: 'Posso verificar minha fatura de energia'
  },
];

// Default form values
export const defaultWizardValues: WizardFormValues = {
  // Site context
  siteType: undefined,
  tariffGroup: undefined,
  hasPv: false,
  pvPowerKwp: 0,
  hasDiesel: false,
  dieselPowerKw: 0,
  
  // Strategy
  objectives: [],
  hasBlackouts: false,
  canInjectToGrid: true,
  focusTechnical: false,
  
  // Constraints
  hasSpaceConstraints: false,
  hasTransformerConstraints: false,
  transformerLimitKva: 0,
  needsBackup: false,
  criticalLoadKw: 0,
  backupHours: 0,
  
  // Tariff
  simpleTariff: 0,
  tePeak: 0,
  teOffpeak: 0,
  tusdPeak: 0,
  tusdOffpeak: 0,
  peakStartHour: 18,
  peakEndHour: 21,
  peakDemandKw: 0,
  offpeakDemandKw: 0,
  peakContractedDemandKw: 0,
  offpeakContractedDemandKw: 0,
  demandCharge: 0,
  
  // Profile
  profileEntryMethod: 'simple',
  hourlyDemandKw: Array(24).fill(0),
  profileType: 'daytime',
  
  // PV profile
  pvProfileMethod: 'auto',
  hourlyPvKw: Array(24).fill(0),
  
  // Project name
  projectName: 'Nova Simulação BESS'
};

// Adding projectName to the schema
wizardSchema.extend({
  projectName: z.string().optional().default('Nova Simulação BESS')
});
