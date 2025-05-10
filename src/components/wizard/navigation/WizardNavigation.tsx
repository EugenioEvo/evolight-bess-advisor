
import React from 'react';
import { Button } from '@/components/ui/button';
import { useWizard } from '../context/WizardContext';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';

export function WizardNavigation() {
  const { 
    nextStep, 
    prevStep, 
    isFirstStep, 
    isLastStep, 
    isLoading, 
    runSimulation, 
    currentStep, 
    canProceed 
  } = useWizard();
  
  const handleNext = () => {
    // If we're on the profile step and moving to results, run the simulation
    if (currentStep === 'profile') {
      runSimulation();
    } else {
      nextStep();
    }
  };
  
  return (
    <div className="flex justify-between items-center w-full">
      <Button
        variant="outline"
        onClick={prevStep}
        disabled={isFirstStep || isLoading}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar
      </Button>
      
      {isLastStep ? (
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => runSimulation()}
            disabled={isLoading}
          >
            Recalcular
          </Button>
          <Button>Baixar Relatório</Button>
        </div>
      ) : (
        <Button
          onClick={handleNext}
          disabled={isLoading || !canProceed}
          className="flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {currentStep === 'profile' ? 'Simulando...' : 'Carregando...'}
            </>
          ) : (
            <>
              {currentStep === 'profile' ? 'Simular' : 'Avançar'}
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      )}
    </div>
  );
}
