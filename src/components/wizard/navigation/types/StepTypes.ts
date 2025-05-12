
export type WizardStepInfo = {
  id: string;
  label: string;
  description: string;
};

export interface WizardStepsProps {
  horizontal?: boolean;
}

export const wizardStepsInfo: Record<string, WizardStepInfo> = {
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
