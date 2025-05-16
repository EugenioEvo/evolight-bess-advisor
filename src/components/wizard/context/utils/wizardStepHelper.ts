
import { WizardFormValues } from '../../schema';
import { WizardStep } from '../WizardTypes';
import { isStepCompleted, mapFieldToStep } from '../WizardStepUtils';

/**
 * Gets the wizard form values specific to a given step
 * @param formValues The complete form values
 * @param step The wizard step
 * @returns Filtered form values containing only fields relevant to the specified step
 */
export const getStepData = (formValues: WizardFormValues, step: WizardStep): Partial<WizardFormValues> => {
  const stepData: Partial<WizardFormValues> = {};
  
  // Filter formValues to only include fields for the specified step
  Object.entries(formValues).forEach(([key, value]) => {
    if (mapFieldToStep(key) === step) {
      stepData[key as keyof WizardFormValues] = value as any;
    }
  });
  
  return stepData;
};

/**
 * Determines if a user can proceed to the next step
 * @param formValues The form values
 * @param currentStep The current wizard step
 * @returns Whether the user can proceed to the next step
 */
export const canProceedToNextStep = (formValues: WizardFormValues, currentStep: WizardStep): boolean => {
  // Check if current step is completed
  return isStepCompleted(formValues, currentStep);
};

/**
 * Gets the first incomplete step in the wizard
 * @param formValues The form values
 * @param steps Array of all wizard steps in order
 * @returns The first incomplete step, or null if all steps are complete
 */
export const getFirstIncompleteStep = (
  formValues: WizardFormValues, 
  steps: WizardStep[]
): WizardStep | null => {
  for (const step of steps) {
    if (!isStepCompleted(formValues, step)) {
      return step;
    }
  }
  return null;
};
