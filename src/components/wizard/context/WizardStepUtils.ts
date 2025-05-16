
import { WizardStep } from './WizardTypes';
import { WizardFormValues } from '../schema';

// Define mapping of form fields to wizard steps for better organization
const FIELD_TO_STEP_MAP: Record<string, WizardStep> = {
  // Site step fields
  siteType: 'site',
  tariffGroup: 'site',
  hasPv: 'site',
  pvPowerKwp: 'site',
  hasDiesel: 'site',
  dieselPowerKw: 'site',
  
  // Strategy step fields
  objectives: 'strategy',
  hasBlackouts: 'strategy',
  canInjectToGrid: 'strategy',
  focusTechnical: 'strategy',
  
  // Constraints step fields
  hasSpaceConstraints: 'constraints',
  hasTransformerConstraints: 'constraints',
  transformerLimitKva: 'constraints',
  needsBackup: 'constraints',
  criticalLoadKw: 'constraints',
  backupHours: 'constraints',
  
  // Tariff step fields
  simpleTariff: 'tariff',
  tePeak: 'tariff',
  teOffpeak: 'tariff',
  tusdPeak: 'tariff',
  tusdOffpeak: 'tariff',
  peakStartHour: 'tariff',
  peakEndHour: 'tariff',
  peakDemandKw: 'tariff',
  offpeakDemandKw: 'tariff',
  peakContractedDemandKw: 'tariff',
  offpeakContractedDemandKw: 'tariff',
  demandCharge: 'tariff',
  
  // Profile step fields
  profileEntryMethod: 'profile',
  hourlyDemandKw: 'profile',
  profileType: 'profile',
  pvProfileMethod: 'profile',
  hourlyPvKw: 'profile',
  
  // Project information
  projectName: 'site'
};

/**
 * Maps a form field name to the corresponding wizard step
 * @param field The form field name
 * @returns The corresponding wizard step
 */
export const mapFieldToStep = (field: string): WizardStep => {
  // Check for exact field matches
  if (field in FIELD_TO_STEP_MAP) {
    return FIELD_TO_STEP_MAP[field as keyof typeof FIELD_TO_STEP_MAP];
  }
  
  // Handle array field notation (e.g., objectives[0], hourlyDemandKw[5])
  const baseField = field.split('[')[0];
  if (baseField in FIELD_TO_STEP_MAP) {
    return FIELD_TO_STEP_MAP[baseField as keyof typeof FIELD_TO_STEP_MAP];
  }
  
  // Check for partial matches for nested fields or dynamic fields
  for (const [key, step] of Object.entries(FIELD_TO_STEP_MAP)) {
    if (field.startsWith(key)) {
      return step;
    }
  }
  
  // Fallback to site step if no match found
  console.warn(`No step mapping found for field: ${field}, defaulting to 'site'`);
  return 'site';
};

/**
 * Validates form data for a specific step
 * @param data The form data
 * @param step The wizard step to validate
 * @throws Error if validation fails
 */
export const validateStepData = (data: WizardFormValues, step: WizardStep) => {
  switch (step) {
    case 'site':
      if (!data.siteType || !data.tariffGroup) {
        throw new Error('Preencha o tipo de instalação e o grupo tarifário');
      }
      break;
      
    case 'strategy':
      if (!data.objectives || data.objectives.length === 0) {
        throw new Error('Selecione pelo menos um objetivo para o sistema BESS');
      }
      break;
      
    case 'constraints':
      if (data.needsBackup && (!data.criticalLoadKw || !data.backupHours)) {
        throw new Error('Para backup, defina a carga crítica e duração desejada');
      }
      if (data.hasTransformerConstraints && !data.transformerLimitKva) {
        throw new Error('Defina o limite do transformador');
      }
      break;
      
    case 'tariff':
      if (data.tariffGroup === 'groupA') {
        if (!data.tePeak || !data.teOffpeak || !data.tusdPeak || !data.tusdOffpeak) {
          throw new Error('Preencha as tarifas TE e TUSD para ponta e fora de ponta');
        }
      } else if (data.tariffGroup === 'groupB' && !data.simpleTariff) {
        throw new Error('Preencha a tarifa única para o Grupo B');
      }
      break;
      
    case 'profile':
      if (data.profileEntryMethod === 'hourly' && 
          (!data.hourlyDemandKw || !data.hourlyDemandKw.some(v => v > 0))) {
        throw new Error('Preencha pelo menos um valor de consumo horário');
      }
      
      if (data.hasPv && data.pvProfileMethod === 'hourly' && 
          (!data.hourlyPvKw || !data.hourlyPvKw.some(v => v > 0))) {
        throw new Error('Preencha pelo menos um valor de geração solar horária');
      }
      break;
      
    case 'results':
      // Results step doesn't need validation as it's the final display step
      break;
  }
};

/**
 * Checks if a step is completed based on the form data
 * @param data The form data
 * @param step The wizard step to check
 * @returns Whether the step is completed
 */
export const isStepCompleted = (data: WizardFormValues, step: WizardStep): boolean => {
  try {
    validateStepData(data, step);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Finds fields with errors for a specific step
 * @param errors Object containing form errors
 * @param step The wizard step
 * @returns Array of field names with errors for the given step
 */
export const getStepErrorFields = (errors: Record<string, any>, step: WizardStep): string[] => {
  return Object.keys(errors).filter(field => mapFieldToStep(field) === step);
};

