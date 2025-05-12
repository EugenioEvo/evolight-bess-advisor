
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { WizardFormValues, wizardSchema } from '../schema';
import { useBessSimulation } from '@/hooks/bessSimulation';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

import { 
  WizardContextType, 
  WizardStep, 
  siteTypeOptions,
  tariffGroupOptions, 
  defaultWizardValues 
} from './WizardTypes';

import { validateStepData, mapFieldToStep } from './WizardStepUtils';
import { saveWizardProgress, loadSavedWizardSimulation, loadLocalWizardData } from './WizardDataUtils';

export const WizardContext = createContext<WizardContextType>({} as WizardContextType);

export function WizardProvider({ children }: { children: React.ReactNode }) {
  const [currentStep, setCurrentStep] = useState<WizardStep>('site');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [canProceed, setCanProceed] = useState(true);
  const [hasErrors, setHasErrors] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});
  const [currentSimulationId, setCurrentSimulationId] = useState<string | null>(null);
  
  const steps: WizardStep[] = ['site', 'strategy', 'constraints', 'tariff', 'profile', 'results'];
  
  const navigate = useNavigate();
  
  const methods = useForm<WizardFormValues>({
    resolver: zodResolver(wizardSchema),
    defaultValues: defaultWizardValues,
    mode: 'onChange',
  });
  
  const { runSimulation: runBessSimulation, isSimulating, simulationResult } = useBessSimulation();
  
  // Check for form errors on field change
  useEffect(() => {
    const subscription = methods.formState.isSubmitted && 
      methods.watch((value, { name, type }) => {
        const errors = methods.formState.errors;
        setHasErrors(Object.keys(errors).length > 0);
        
        // Organize errors by step for better feedback
        const errorsByStep: Record<string, string[]> = {};
        
        Object.entries(errors).forEach(([field, error]) => {
          // Logic to map each field to its corresponding step
          const step = mapFieldToStep(field);
          if (!errorsByStep[step]) {
            errorsByStep[step] = [];
          }
          if (error.message) {
            errorsByStep[step].push(error.message);
          }
        });
        
        setValidationErrors(errorsByStep);
      });
    
    return () => subscription.unsubscribe();
  }, [methods]);

  const isFirstStep = currentStep === steps[0];
  const isLastStep = currentStep === steps[steps.length - 1];

  const nextStep = () => {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
      
      // Auto-save progress when moving to the next step
      handleSaveProgress(false);
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
  
  const handleRunSimulation = async () => {
    try {
      setIsLoading(true);
      
      const formData = methods.getValues();
      validateStepData(formData, 'profile');
      
      const result = await runBessSimulation(formData);
      
      // After simulation, move to results step and save the simulation
      setCurrentStep('results');
      handleSaveProgress(false);
      
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
  
  // Function to save progress
  const handleSaveProgress = async (showToast = true) => {
    try {
      setIsSaving(true);
      
      const formData = methods.getValues();
      const newId = await saveWizardProgress(formData, currentSimulationId, simulationResult, showToast);
      
      if (newId && !currentSimulationId) {
        setCurrentSimulationId(newId);
      }
    } finally {
      setIsSaving(false);
    }
  };
  
  // Function to load a saved simulation
  const handleLoadSavedSimulation = async (id: string) => {
    try {
      setIsLoading(true);
      
      const result = await loadSavedWizardSimulation(id);
      
      if (result) {
        setCurrentSimulationId(result.simulationId);
        
        // Reset the form with saved values
        methods.reset(result.inputValues);
        
        // If we have results, go to results step, otherwise go to the first step
        if (result.hasResults) {
          setCurrentStep('results');
        } else {
          setCurrentStep('site');
        }
      }
    } catch (error) {
      console.error('Error loading simulation:', error);
      
      // Try to load from local storage as fallback
      const localData = loadLocalWizardData();
      if (localData) {
        methods.reset(localData);
        toast.info('Dados locais carregados', { 
          description: 'Carregamos os últimos dados salvos localmente.'
        });
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  // Load saved data when the component is mounted
  useEffect(() => {
    const localData = loadLocalWizardData();
    if (localData) {
      methods.reset(localData);
    }
  }, []);

  return (
    <WizardContext.Provider
      value={{
        currentStep,
        setCurrentStep,
        steps,
        nextStep,
        prevStep,
        isFirstStep,
        isLastStep,
        isLoading,
        isSimulating,
        isSaving,
        simulationResults: simulationResult,
        runSimulation: handleRunSimulation,
        saveProgress: handleSaveProgress,
        loadSavedSimulation: handleLoadSavedSimulation,
        goToStep,
        canProceed,
        setCanProceed,
        siteTypeOptions,
        tariffGroupOptions,
        hasErrors,
        validationErrors,
      }}
    >
      <FormProvider {...methods}>
        {children}
      </FormProvider>
    </WizardContext.Provider>
  );
}

export const useWizard = () => useContext(WizardContext);
