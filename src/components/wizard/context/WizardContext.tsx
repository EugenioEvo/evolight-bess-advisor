import React, { createContext, useContext, useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { wizardSchema, WizardFormValues } from '../schema';
import { useBessSimulation } from '@/hooks/bessSimulation';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

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
  isSaving: boolean;
  simulationResults: any;
  runSimulation: () => Promise<void>;
  saveProgress: () => Promise<void>;
  loadSavedSimulation: (id: string) => Promise<void>;
  goToStep: (step: WizardStep) => void;
  canProceed: boolean;
  setCanProceed: (can: boolean) => void;
  siteTypeOptions: { label: string; value: string; icon: string }[];
  tariffGroupOptions: { label: string; value: string; description: string }[];
  hasErrors: boolean;
  validationErrors: Record<string, string[]>;
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
  const [isSaving, setIsSaving] = useState(false);
  const [canProceed, setCanProceed] = useState(true);
  const [hasErrors, setHasErrors] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});
  const [currentSimulationId, setCurrentSimulationId] = useState<string | null>(null);
  
  const steps: WizardStep[] = ['site', 'strategy', 'constraints', 'tariff', 'profile', 'results'];
  
  const navigate = useNavigate();
  
  const methods = useForm<WizardFormValues>({
    resolver: zodResolver(wizardSchema),
    defaultValues,
    mode: 'onChange',
  });
  
  const { runSimulation, isSimulating, simulationResult } = useBessSimulation();
  
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
  
  // Options for dropdowns
  const siteTypeOptions = [
    { label: 'Industrial', value: 'industrial', icon: 'factory' },
    { label: 'Comercial', value: 'commercial', icon: 'building' },
    { label: 'Rural', value: 'rural', icon: 'home' },
    { label: 'Outro', value: 'other', icon: 'puzzle' },
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
  
  const handleRunSimulation = async () => {
    try {
      setIsLoading(true);
      
      const formData = methods.getValues();
      validateStepData(formData, 'profile');
      
      const result = await runSimulation(formData);
      
      // After simulation, move to results step and save the simulation
      setCurrentStep('results');
      saveProgress(false);
      
      return result;
    } catch (error) {
      console.error('Error running simulation:', error);
      toast.error('Erro na simulação', { 
        description: 'Ocorreu um erro ao processar a simulação. Por favor, verifique os dados e tente novamente.'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Função para salvar o progresso atual
  const saveProgress = async (showToast = true) => {
    try {
      setIsSaving(true);
      
      // Verifica se usuário está autenticado
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // Se não estiver autenticado, salvar apenas localmente
        const formData = methods.getValues();
        localStorage.setItem('wizardFormState', JSON.stringify(formData));
        
        if (showToast) {
          toast.info('Progresso salvo localmente', { 
            description: 'Para salvar permanentemente, faça login na sua conta.'
          });
        }
        return;
      }
      
      const formData = methods.getValues();
      const simulationName = formData.projectName || 'Nova Simulação';
      
      // Se já temos um ID de simulação, atualize; caso contrário, insira
      if (currentSimulationId) {
        const { error } = await supabase
          .from('saved_simulations')
          .update({ 
            input_values: formData,
            results: simulationResult,
            updated_at: new Date().toISOString()
          })
          .eq('id', currentSimulationId);
        
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('saved_simulations')
          .insert({ 
            name: simulationName,
            description: `Simulação de ${formData.siteType || 'BESS'}`,
            user_id: session.user.id,
            input_values: formData,
            results: simulationResult
          })
          .select();
        
        if (error) throw error;
        
        if (data && data[0]) {
          setCurrentSimulationId(data[0].id);
        }
      }
      
      if (showToast) {
        toast.success('Progresso salvo com sucesso', { 
          description: 'Você pode acessar esta simulação a qualquer momento.'
        });
      }
    } catch (error) {
      console.error('Error saving progress:', error);
      
      if (showToast) {
        toast.error('Erro ao salvar', { 
          description: 'Não foi possível salvar seu progresso. Os dados foram guardados localmente.'
        });
      }
      
      // Salvar localmente como fallback
      const formData = methods.getValues();
      localStorage.setItem('wizardFormState', JSON.stringify(formData));
    } finally {
      setIsSaving(false);
    }
  };
  
  // Função para carregar uma simulação salva
  const loadSavedSimulation = async (id: string) => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('saved_simulations')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      if (data) {
        setCurrentSimulationId(data.id);
        
        // Reset the form with saved values
        methods.reset(data.input_values);
        
        // If we have results, go to results step, otherwise go to the first step
        if (data.results) {
          // simulationResult = data.results;
          setCurrentStep('results');
        } else {
          setCurrentStep('site');
        }
        
        toast.success('Simulação carregada', { 
          description: 'A simulação foi carregada com sucesso.'
        });
      }
    } catch (error) {
      console.error('Error loading simulation:', error);
      toast.error('Erro ao carregar simulação', { 
        description: 'Não foi possível carregar a simulação selecionada.'
      });
      
      // Try to load from local storage as fallback
      const localData = localStorage.getItem('wizardFormState');
      if (localData) {
        try {
          const parsedData = JSON.parse(localData);
          methods.reset(parsedData);
          toast.info('Dados locais carregados', { 
            description: 'Carregamos os últimos dados salvos localmente.'
          });
        } catch (e) {
          console.error('Error parsing local data:', e);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  // Função para validar dados do passo atual
  const validateStepData = (data: WizardFormValues, step: WizardStep) => {
    // Validação específica para cada passo
    switch (step) {
      case 'site':
        if (!data.siteType || !data.tariffGroup) {
          throw new Error('Preencha o tipo de instalação e o grupo tarifário');
        }
        break;
      case 'strategy':
        if (!data.objectives || data.objectives.length === 0) {
          throw new Error('Selecione pelo menos um objetivo para o sistema BESS');
        }
        break;
      case 'profile':
        if (data.profileEntryMethod === 'hourly' && 
            (!data.hourlyDemandKw || !data.hourlyDemandKw.some(v => v > 0))) {
          throw new Error('Preencha pelo menos um valor de consumo horário');
        }
        break;
      default:
        // Validação genérica para os outros passos
        break;
    }
  };
  
  // Função para mapear campo a seu respectivo passo
  const mapFieldToStep = (field: string): WizardStep => {
    // Mapeamento simplificado, pode ser expandido conforme necessário
    if (field.startsWith('site') || field === 'hasPv' || field === 'hasDiesel') {
      return 'site';
    } else if (field.startsWith('objectives') || field === 'focusTechnical') {
      return 'strategy';
    } else if (field.includes('backup') || field.includes('transformer') || field.includes('Space')) {
      return 'constraints';
    } else if (field.includes('tariff') || field.includes('peak') || field.includes('offpeak')) {
      return 'tariff';
    } else if (field.includes('profile') || field.includes('hourly')) {
      return 'profile';
    }
    
    return 'site'; // Default
  };
  
  // Carregar dados salvos quando o componente é montado
  useEffect(() => {
    const loadLocalData = () => {
      const localData = localStorage.getItem('wizardFormState');
      if (localData) {
        try {
          const parsedData = JSON.parse(localData);
          methods.reset(parsedData);
        } catch (e) {
          console.error('Error parsing local data:', e);
        }
      }
    };
    
    loadLocalData();
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
        saveProgress,
        loadSavedSimulation,
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

// Adicionar propriedade de nome do projeto ao schema
// Isso é feito aqui para manter a compatibilidade com o código existente
wizardSchema.extend({
  projectName: z.string().optional().default('Nova Simulação BESS')
});
