
import React, { createContext, useContext } from 'react';
import { WizardContextType } from './WizardTypes';
import { WizardProvider } from './WizardProvider';

// Create context with empty default value
export const WizardContext = createContext<WizardContextType>({} as WizardContextType);

// Re-export the provider component
export { WizardProvider };

// Custom hook for consuming the context
export const useWizard = () => useContext(WizardContext);
