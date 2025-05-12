
import React from 'react';
import { Button } from '@/components/ui/button';
import { useWizard } from '../context/WizardContext';
import { ArrowLeft, ArrowRight, Loader2, Download, Save } from 'lucide-react';
import { toast } from 'sonner';

export function WizardNavigation() {
  const { 
    nextStep, 
    prevStep, 
    isFirstStep, 
    isLastStep, 
    isLoading, 
    runSimulation, 
    currentStep, 
    canProceed,
    saveProgress,
    isSaving
  } = useWizard();
  
  const handleNext = () => {
    // If we're on the profile step and moving to results, run the simulation
    if (currentStep === 'profile') {
      runSimulation();
    } else {
      nextStep();
      toast.success('Etapa salva', {
        description: 'Seus dados foram salvos automaticamente.'
      });
    }
  };
  
  const handleSaveProgress = () => {
    saveProgress();
    toast.success('Progresso salvo', {
      description: 'Você pode retomar este dimensionamento mais tarde.'
    });
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
      
      <div className="flex gap-2">
        {!isFirstStep && !isLoading && (
          <Button
            variant="outline"
            onClick={handleSaveProgress}
            disabled={isSaving}
            className="flex items-center gap-2"
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Salvar
          </Button>
        )}
      </div>
      
      {isLastStep ? (
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => runSimulation()}
            disabled={isLoading}
          >
            Recalcular
          </Button>
          <Button 
            onClick={() => {
              toast.success('Relatório gerado', {
                description: 'O download do PDF começará em instantes.'
              });
            }}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Baixar Relatório
          </Button>
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
