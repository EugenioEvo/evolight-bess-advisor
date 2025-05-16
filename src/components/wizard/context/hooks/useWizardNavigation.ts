
import { WizardStep } from '../WizardTypes';

export function useWizardNavigation(
  currentStep: WizardStep,
  setCurrentStep: (step: WizardStep) => void,
  saveProgress: (showToast?: boolean) => Promise<void>
) {
  const steps: WizardStep[] = ['site', 'strategy', 'constraints', 'tariff', 'profile', 'results'];
  
  const isFirstStep = currentStep === steps[0];
  const isLastStep = currentStep === steps[steps.length - 1];

  const nextStep = () => {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
      
      // Auto-save progress when moving to the next step
      saveProgress(false);
    }
  };

  const prevStep = () => {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };
  
  const goToStep = (step: WizardStep) => {
    if (steps.includes(step)) {
      setCurrentStep(step);
    }
  };

  return {
    steps,
    nextStep,
    prevStep,
    goToStep,
    isFirstStep,
    isLastStep
  };
}
