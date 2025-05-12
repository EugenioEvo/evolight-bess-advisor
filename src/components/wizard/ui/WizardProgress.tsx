
import React from 'react';
import { useWizard } from '../context/WizardContext';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export function WizardProgress() {
  const { currentStep, steps, validationErrors, hasErrors } = useWizard();
  
  // Calculate progress percentage
  const currentStepIndex = steps.indexOf(currentStep);
  const progressPercentage = ((currentStepIndex + 1) / steps.length) * 100;
  
  // Get errors for the current step
  const currentStepErrors = validationErrors[currentStep] || [];
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-medium">
          Etapa {currentStepIndex + 1} de {steps.length}
        </span>
        <span className="text-sm text-muted-foreground">
          {Math.round(progressPercentage)}% completo
        </span>
      </div>
      
      <Progress value={progressPercentage} className="h-2" />
      
      {currentStepErrors.length > 0 && (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Atenção</AlertTitle>
          <AlertDescription>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              {currentStepErrors.map((error, index) => (
                <li key={index} className="text-sm">{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}
      
      {currentStepIndex > 0 && !hasErrors && (
        <Alert className="bg-green-50 text-green-800 border-green-200 mt-4">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertTitle>Progresso salvo</AlertTitle>
          <AlertDescription>
            Seus dados são salvos automaticamente a cada etapa. Você pode retornar e editar conforme necessário.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
