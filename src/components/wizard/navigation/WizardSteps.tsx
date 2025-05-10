
import React from 'react';
import { useWizard } from '../context/WizardContext';
import { useFormContext } from 'react-hook-form';
import { cn } from '@/lib/utils';
import { CheckIcon } from 'lucide-react';

type StepInfo = {
  id: string;
  label: string;
  description: string;
};

interface WizardStepsProps {
  horizontal?: boolean;
}

export function WizardSteps({ horizontal = false }: WizardStepsProps) {
  const { currentStep, goToStep, steps } = useWizard();
  const { formState } = useFormContext();
  
  const stepsInfo: Record<string, StepInfo> = {
    site: {
      id: 'site',
      label: 'Contexto',
      description: 'Perfil do local',
    },
    strategy: {
      id: 'strategy',
      label: 'Objetivos',
      description: 'Estratégia energética',
    },
    constraints: {
      id: 'constraints',
      label: 'Restrições',
      description: 'Limitações técnicas',
    },
    tariff: {
      id: 'tariff',
      label: 'Tarifas',
      description: 'Estrutura tarifária',
    },
    profile: {
      id: 'profile',
      label: 'Perfil',
      description: 'Consumo e geração',
    },
    results: {
      id: 'results',
      label: 'Resultados',
      description: 'Solução BESS',
    },
  };
  
  // Function to determine if a step is complete
  const isStepComplete = (stepId: string) => {
    // This is a simplified check, you should enhance it based on your validation needs
    const stepIndex = steps.indexOf(stepId as any);
    const currentIndex = steps.indexOf(currentStep);
    return stepIndex < currentIndex;
  };
  
  if (horizontal) {
    return (
      <div className="flex justify-between w-full">
        {steps.map((step, index) => {
          const isActive = step === currentStep;
          const isComplete = isStepComplete(step);
          
          return (
            <div 
              key={step}
              className="flex flex-col items-center"
              onClick={() => isComplete && goToStep(step)}
            >
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center font-medium text-sm transition-colors",
                isActive && "bg-primary text-primary-foreground",
                isComplete && "bg-primary/80 text-primary-foreground",
                !isActive && !isComplete && "bg-muted text-muted-foreground"
              )}>
                {isComplete ? <CheckIcon className="h-4 w-4" /> : index + 1}
              </div>
              <div className="text-xs mt-1 text-center">{stepsInfo[step].label}</div>
            </div>
          );
        })}
      </div>
    );
  }
  
  return (
    <div className="space-y-1">
      {steps.map((step, index) => {
        const isActive = step === currentStep;
        const isComplete = isStepComplete(step);
        
        return (
          <button
            key={step}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
              isActive && "bg-primary/10 text-primary",
              isComplete && !isActive && "text-primary hover:bg-primary/5",
              !isActive && !isComplete && "text-muted-foreground hover:bg-muted/50",
              isComplete && "cursor-pointer",
              !isComplete && !isActive && "cursor-not-allowed"
            )}
            onClick={() => isComplete && goToStep(step)}
            disabled={!isComplete && !isActive}
          >
            <div className={cn(
              "w-6 h-6 rounded-full flex items-center justify-center text-sm transition-colors",
              isActive && "bg-primary text-primary-foreground",
              isComplete && !isActive && "bg-primary/80 text-primary-foreground",
              !isActive && !isComplete && "bg-muted text-primary-foreground/50"
            )}>
              {isComplete ? <CheckIcon className="h-3 w-3" /> : index + 1}
            </div>
            <div className="flex flex-col items-start">
              <span>{stepsInfo[step].label}</span>
              <span className="text-xs text-muted-foreground">{stepsInfo[step].description}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
