
import { WizardStep } from '../context/WizardTypes';

/**
 * Determines if a step is complete based on the current step
 * @param stepId The step ID to check
 * @param currentStep The current active step
 * @param allSteps Array of all available steps
 * @returns boolean indicating if the step is complete
 */
export const isStepComplete = (
  stepId: string, 
  currentStep: WizardStep, 
  allSteps: WizardStep[]
): boolean => {
  const stepIndex = allSteps.indexOf(stepId as WizardStep);
  const currentIndex = allSteps.indexOf(currentStep);
  return stepIndex < currentIndex;
};
