
import React from 'react';
import { useWizard } from './context/WizardContext';
import { SiteContextStep } from './steps/SiteContextStep';
import { StrategyStep } from './steps/StrategyStep';
import { ConstraintsStep } from './steps/ConstraintsStep';
import { TariffStep } from './steps/TariffStep';
import { ProfileStep } from './steps/ProfileStep';
import { ResultsStep } from './steps/ResultsStep';

export function WizardContent() {
  const { currentStep } = useWizard();
  
  switch (currentStep) {
    case 'site':
      return <SiteContextStep />;
    case 'strategy':
      return <StrategyStep />;
    case 'constraints':
      return <ConstraintsStep />;
    case 'tariff':
      return <TariffStep />;
    case 'profile':
      return <ProfileStep />;
    case 'results':
      return <ResultsStep />;
    default:
      return <div>Etapa desconhecida</div>;
  }
}
