
import React, { useState, useEffect } from 'react';
import { WizardProvider } from './context/WizardContext';
import { WizardNavigation } from './navigation/WizardNavigation';
import { WizardSteps } from './navigation/WizardSteps';
import { WizardContent } from './WizardContent';
import { WizardHome } from './WizardHome';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';

export function BessWizard() {
  const { simulationId, action } = useParams();
  const [showWizard, setShowWizard] = useState(false);
  
  // Determinar se devemos mostrar o wizard ou a página inicial
  useEffect(() => {
    if (simulationId === 'new' || simulationId || action === 'template') {
      setShowWizard(true);
    } else {
      setShowWizard(false);
    }
  }, [simulationId, action]);
  
  // Carregar template se especificado
  useEffect(() => {
    if (action === 'template' && simulationId) {
      // Aqui carregaríamos os dados do template
      toast.info('Template carregado', {
        description: `Configurando simulação com base no caso de uso: ${simulationId}`
      });
    }
  }, [action, simulationId]);
  
  // Se não estamos no modo wizard, mostrar a página inicial
  if (!showWizard) {
    return <WizardHome />;
  }
  
  return (
    <WizardProvider>
      <div className="flex flex-col space-y-6">
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
