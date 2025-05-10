
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { wizardSchema, WizardFormValues } from '../schema';
import { useBessSimulation } from '@/hooks/bessSimulation';
import { toast } from 'sonner';

export type WizardStep = 'site' | 'strategy' | 'constraints' | 'tariff' | 'profile' | 'results';

interface WizardContextType {
  currentStep: WizardStep;
  setCurrentStep: (step: WizardStep) => void;
  steps: WizardStep[];
  nextStep: () => void;
  prevStep: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  isLoading: boolean;
  isSimulating: boolean;
  simulationResults: any;
  runSimulation: () => Promise<void>;
  goToStep: (step: WizardStep) => void;
  canProceed: boolean;
  setCanProceed: (can: boolean) => void;
  siteTypeOptions: { label: string; value: string; icon: string }[];
  tariffGroupOptions: { label: string; value: string; description: string }[];
}

const defaultValues: WizardFormValues = {
  // Site context
  siteType: undefined,
  tariffGroup: undefined,
  hasPv: false,
  pvPowerKwp: 0,
  hasDiesel: false,
  dieselPowerKw: 0,
  
  // Strategy
  objectives: [],
  hasBlackouts: false,
  canInjectToGrid: true,
  focusTechnical: false,
  
  // Constraints
  hasSpaceConstraints: false,
  hasTransformerConstraints: false,
  transformerLimitKva: 0,
  needsBackup: false,
  criticalLoadKw: 0,
  backupHours: 0,
  
  // Tariff
  simpleTariff: 0,
  tePeak: 0,
  teOffpeak: 0,
  tusdPeak: 0,
  tusdOffpeak: 0,
  peakStartHour: 18,
  peakEndHour: 21,
  peakDemandKw: 0,
  offpeakDemandKw: 0,
  peakContractedDemandKw: 0,
  offpeakContractedDemandKw: 0,
  demandCharge: 0,
  
  // Profile
  profileEntryMethod: 'simple',
  hourlyDemandKw: Array(24).fill(0),
  profileType: 'daytime',
  
  // PV profile
  pvProfileMethod: 'auto',
  hourlyPvKw: Array(24).fill(0),
};

export const WizardContext = createContext<WizardContextType>({} as WizardContextType);

export function WizardProvider({ children }: { children: React.ReactNode }) {
  const [currentStep, setCurrentStep] = useState<WizardStep>('site');
  const [isLoading, setIsLoading] = useState(false);
  const [canProceed, setCanProceed] = useState(true);
  
  const steps: WizardStep[] = ['site', 'strategy', 'constraints', 'tariff', 'profile', 'results'];
  
  const methods = useForm<WizardFormValues>({
    resolver: zodResolver(wizardSchema),
    defaultValues,
    mode: 'onChange',
  });
  
  const { runSimulation, isSimulating, simulationResult } = useBessSimulation();
  
  // Options for dropdowns
  const siteTypeOptions = [
    { label: 'Industrial', value: 'industrial', icon: 'industry' },
    { label: 'Comercial', value: 'commercial', icon: 'building' },
    { label: 'Rural', value: 'rural', icon: 'home' },
    { label: 'Outro', value: 'other', icon: 'other' },
  ];
  
  const tariffGroupOptions = [
    { 
      label: 'Grupo A', 
      value: 'groupA',
      description: 'Alta tensão com demanda contratada (indústrias e grandes comércios)'
    },
    { 
      label: 'Grupo B', 
      value: 'groupB',
      description: 'Baixa tensão com tarifa única (pequenos comércios e residências)'
    },
    { 
      label: 'Não sei', 
      value: 'unknown',
      description: 'Posso verificar minha fatura de energia'
    },
  ];

  const isFirstStep = currentStep === steps[0];
  const isLastStep = currentStep === steps[steps.length - 1];

  const nextStep = () => {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
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
      // Will be implemented with the actual simulation logic
      const formData = methods.getValues();
      await runSimulation(formData);
      
      // After simulation, move to results step
      setCurrentStep('results');
    } catch (error) {
      console.error('Error running simulation:', error);
      toast.error('Erro na simulação', { 
        description: 'Ocorreu um erro ao processar a simulação. Por favor, verifique os dados e tente novamente.'
      });
    } finally {
      setIsLoading(false);
    }
  };

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
        simulationResults: simulationResult,
        runSimulation: handleRunSimulation,
        goToStep,
        canProceed,
        setCanProceed,
        siteTypeOptions,
        tariffGroupOptions,
      }}
    >
      <FormProvider {...methods}>
        {children}
      </FormProvider>
    </WizardContext.Provider>
  );
}

export const useWizard = () => useContext(WizardContext);
