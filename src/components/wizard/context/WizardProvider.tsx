
import React, { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { WizardFormValues, wizardSchema } from '../schema';
import { useNavigate } from 'react-router-dom';

import { 
  WizardContextType, 
  WizardStep, 
  siteTypeOptions,
  tariffGroupOptions, 
  defaultWizardValues 
} from './WizardTypes';

import { validateStepData } from './WizardStepUtils';
import { saveWizardProgress, loadSavedWizardSimulation, loadLocalWizardData } from './WizardDataUtils';
import { WizardContext } from './WizardContext';
import { useWizardNavigation } from './hooks/useWizardNavigation';
import { useWizardSimulation } from './hooks/useWizardSimulation';

export function WizardProvider({ children }: { children: React.ReactNode }) {
  const [currentStep, setCurrentStep] = useState<WizardStep>('site');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [canProceed, setCanProceed] = useState(true);
  const [hasErrors, setHasErrors] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});
  const [currentSimulationId, setCurrentSimulationId] = useState<string | null>(null);
  
  const navigate = useNavigate();
  
  const methods = useForm<WizardFormValues>({
    resolver: zodResolver(wizardSchema),
    defaultValues: defaultWizardValues,
    mode: 'onChange',
  });
  
  // Import step navigation logic
  const { nextStep, prevStep, goToStep, isFirstStep, isLastStep, steps } = 
    useWizardNavigation(currentStep, setCurrentStep, handleSaveProgress);
  
  // Import simulation logic
  const { 
    runSimulation, 
    isSimulating, 
    simulationResult: simulationResults
  } = useWizardSimulation(methods, setIsLoading, setCurrentStep);
  
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

  // Function to save progress
  async function handleSaveProgress(showToast = true) {
    try {
      setIsSaving(true);
      
      const formData = methods.getValues();
      const newId = await saveWizardProgress(formData, currentSimulationId, simulationResults, showToast);
      
      if (newId && !currentSimulationId) {
        setCurrentSimulationId(newId);
      }
    } finally {
      setIsSaving(false);
    }
  }
  
  // Function to load a saved simulation
  async function handleLoadSavedSimulation(id: string) {
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
      }
    } finally {
      setIsLoading(false);
    }
  }
  
  // Load saved data when the component is mounted
  useEffect(() => {
    const localData = loadLocalWizardData();
    if (localData) {
      methods.reset(localData);
    }
  }, []);

  // Import from WizardStepUtils.ts
  function mapFieldToStep(field: string): WizardStep {
    // Simplified for now - this should come from WizardStepUtils
    return 'site';
  }

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
        simulationResults,
        runSimulation,
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
