
import React from 'react';
import { useWizard } from '../context/WizardContext';
import { WizardStepsProps, wizardStepsInfo } from './types/StepTypes';
import { WizardStep } from './WizardStep';
import { isStepComplete } from './StepStatusUtils';

export function WizardSteps({ horizontal = false }: WizardStepsProps) {
  const { currentStep, goToStep, steps } = useWizard();
  
  if (horizontal) {
    return (
      <div className="flex justify-between w-full">
        {steps.map((step, index) => {
          const isActive = step === currentStep;
          const isComplete = isStepComplete(step, currentStep, steps);
          
          return (
            <WizardStep 
              key={step}
              stepInfo={wizardStepsInfo[step]}
              isActive={isActive}
              isComplete={isComplete}
              index={index}
              onClick={() => isComplete && goToStep(step)}
              horizontal={true}
            />
          );
        })}
      </div>
    );
  }
  
  return (
    <div className="space-y-1">
      {steps.map((step, index) => {
        const isActive = step === currentStep;
        const isComplete = isStepComplete(step, currentStep, steps);
        
        return (
          <WizardStep 
            key={step}
            stepInfo={wizardStepsInfo[step]}
            isActive={isActive}
            isComplete={isComplete}
            index={index}
            onClick={() => isComplete && goToStep(step)}
          />
        );
      })}
    </div>
  );
}
