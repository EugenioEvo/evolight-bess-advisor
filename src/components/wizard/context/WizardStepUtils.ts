
import { WizardStep } from './WizardTypes';
import { WizardFormValues } from '../schema';

// Function to map field to step
export const mapFieldToStep = (field: string): WizardStep => {
  // Mapeamento simplificado, pode ser expandido conforme necessário
  if (field.startsWith('site') || field === 'hasPv' || field === 'hasDiesel') {
    return 'site';
  } else if (field.startsWith('objectives') || field === 'focusTechnical') {
    return 'strategy';
  } else if (field.includes('backup') || field.includes('transformer') || field.includes('Space')) {
    return 'constraints';
  } else if (field.includes('tariff') || field.includes('peak') || field.includes('offpeak')) {
    return 'tariff';
  } else if (field.includes('profile') || field.includes('hourly')) {
    return 'profile';
  }
  
  return 'site'; // Default
};

// Validate data for specific step
export const validateStepData = (data: WizardFormValues, step: WizardStep) => {
  // Validação específica para cada passo
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
    case 'profile':
      if (data.profileEntryMethod === 'hourly' && 
          (!data.hourlyDemandKw || !data.hourlyDemandKw.some(v => v > 0))) {
        throw new Error('Preencha pelo menos um valor de consumo horário');
      }
      break;
    default:
      // Validação genérica para os outros passos
      break;
  }
};
