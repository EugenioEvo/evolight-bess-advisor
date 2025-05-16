
import { UseFormReturn } from 'react-hook-form';
import { WizardFormValues } from '../../schema';
import { useBessSimulation } from '@/hooks/bessSimulation';
import { toast } from 'sonner';
import { validateStepData } from '../WizardStepUtils';
import { WizardStep } from '../WizardTypes';

export function useWizardSimulation(
  methods: UseFormReturn<WizardFormValues>,
  setIsLoading: (isLoading: boolean) => void,
  setCurrentStep: (step: WizardStep) => void
) {
  const { runSimulation: runBessSimulation, isSimulating, simulationResult } = useBessSimulation();
  
  const runSimulation = async () => {
    try {
      setIsLoading(true);
      
      const formData = methods.getValues();
      validateStepData(formData, 'profile');
      
      const result = await runBessSimulation(formData);
      
      // After simulation, move to results step
      setCurrentStep('results');
      
      return result;
    } catch (error) {
      console.error('Error running simulation:', error);
      toast.error('Erro na simulação', { 
        description: 'Ocorreu um erro ao processar a simulação. Por favor, verifique os dados e tente novamente.'
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    runSimulation,
    isSimulating,
    simulationResult
  };
}
