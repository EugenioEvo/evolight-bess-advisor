
import React, { useState } from 'react';
import { WizardProvider } from './context/WizardContext';
import { WizardNavigation } from './navigation/WizardNavigation';
import { WizardSteps } from './navigation/WizardSteps';
import { WizardContent } from './WizardContent';

export function BessWizard() {
  return (
    <WizardProvider>
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold">BESS Advisor</h1>
          <p className="text-muted-foreground">
            Configure seu sistema de armazenamento de energia de forma simples e intuitiva.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar with steps on larger screens */}
          <div className="hidden lg:block lg:col-span-3">
            <WizardSteps />
          </div>
          
          {/* Main content area */}
          <div className="col-span-1 lg:col-span-9">
            <div className="rounded-lg border bg-card shadow">
              <div className="lg:hidden p-4 border-b">
                <WizardSteps horizontal />
              </div>
              
              <div className="p-6">
                <WizardContent />
              </div>
              
              <div className="p-4 border-t bg-muted/50">
                <WizardNavigation />
              </div>
            </div>
          </div>
        </div>
      </div>
    </WizardProvider>
  );
}
