import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { WizardFormValues } from '../schema';

// Function to save progress to Supabase
export const saveWizardProgress = async (
  formData: WizardFormValues, 
  currentSimulationId: string | null, 
  simulationResult: any,
  showToast = true
) => {
  try {
    // Verifies if user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      // If not authenticated, save only locally
      localStorage.setItem('wizardFormState', JSON.stringify(formData));
      
      if (showToast) {
        toast.info('Progresso salvo localmente', { 
          description: 'Para salvar permanentemente, faça login na sua conta.'
        });
      }
      return null;
    }
    
    const simulationName = formData.projectName || 'Nova Simulação';
    
    // If we already have a simulation ID, update it
    if (currentSimulationId) {
      const { error } = await supabase
        .from('saved_simulations')
        .update({ 
          input_values: formData as any,
          results: simulationResult as any,
          updated_at: new Date().toISOString()
        })
        .eq('id', currentSimulationId);
      
      if (error) throw error;
      return currentSimulationId;
    } else {
      // Otherwise create a new simulation
      const { data, error } = await supabase
        .from('saved_simulations')
        .insert({ 
          name: simulationName,
          description: `Simulação de ${formData.siteType || 'BESS'}`,
          user_id: session.user.id,
          input_values: formData as any,
          results: simulationResult as any
        })
        .select();
      
      if (error) throw error;
      
      if (data && data[0]) {
        if (showToast) {
          toast.success('Progresso salvo com sucesso', { 
            description: 'Você pode acessar esta simulação a qualquer momento.'
          });
        }
        return data[0].id;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error saving progress:', error);
    
    if (showToast) {
      toast.error('Erro ao salvar', { 
        description: 'Não foi possível salvar seu progresso. Os dados foram guardados localmente.'
      });
    }
    
    // Save locally as fallback
    localStorage.setItem('wizardFormState', JSON.stringify(formData));
    return null;
  }
};

// Function to load saved simulation from Supabase
export const loadSavedWizardSimulation = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('saved_simulations')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    if (data) {
      toast.success('Simulação carregada', { 
        description: 'A simulação foi carregada com sucesso.'
      });
      
      return {
        simulationId: data.id,
        inputValues: data.input_values as WizardFormValues,
        results: data.results,
        hasResults: !!data.results
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error loading simulation:', error);
    toast.error('Erro ao carregar simulação', { 
      description: 'Não foi possível carregar a simulação selecionada.'
    });
    
    return null;
  }
};

// Function to load local data from localStorage
export const loadLocalWizardData = (): WizardFormValues | null => {
  const localData = localStorage.getItem('wizardFormState');
  if (localData) {
    try {
      return JSON.parse(localData) as WizardFormValues;
    } catch (e) {
      console.error('Error parsing local data:', e);
    }
  }
  return null;
};
