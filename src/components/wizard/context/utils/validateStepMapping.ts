
import { mapFieldToStep } from '../WizardStepUtils';
import { WizardFormValues } from '../../schema';
import { WizardStep } from '../WizardTypes';

/**
 * Utility to validate field-to-step mapping completeness
 * Use this function for development and testing
 */
export const validateStepMappingCompleteness = () => {
  // Create a sample object with all form field keys
  const sampleForm = {} as WizardFormValues;
  
  // Get all keys from the form type
  const formKeys = Object.keys(sampleForm) as Array<keyof WizardFormValues>;
  
  // Track unmapped fields
  const unmappedFields: string[] = [];
  
  // Check each field's mapping
  formKeys.forEach(key => {
    const step = mapFieldToStep(key as string);
    if (step === 'site' && key !== 'siteType' && key !== 'tariffGroup' && key !== 'hasPv' && 
        key !== 'pvPowerKwp' && key !== 'hasDiesel' && key !== 'dieselPowerKw' && key !== 'projectName') {
      unmappedFields.push(key as string);
    }
  });
  
  // Log results
  if (unmappedFields.length > 0) {
    console.warn('The following fields do not have explicit mappings:', unmappedFields);
  } else {
    console.log('All form fields have valid step mappings');
  }
  
  // Collect step statistics
  const stepCounts: Record<WizardStep, number> = {
    site: 0,
    strategy: 0,
    constraints: 0,
    tariff: 0,
    profile: 0,
    results: 0
  };
  
  formKeys.forEach(key => {
    const step = mapFieldToStep(key as string);
    stepCounts[step]++;
  });
  
  // Log step distribution
  console.log('Field distribution by step:', stepCounts);
  
  return {
    unmappedFields,
    stepCounts
  };
};
