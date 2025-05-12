
import React from 'react';
import { cn } from '@/lib/utils';
import { CheckIcon } from 'lucide-react';
import { WizardStepInfo } from './types/StepTypes';

interface WizardStepProps {
  stepInfo: WizardStepInfo;
  isActive: boolean;
  isComplete: boolean;
  index: number;
  onClick: () => void;
  horizontal?: boolean;
}

export function WizardStep({ 
  stepInfo, 
  isActive, 
  isComplete, 
  index, 
  onClick, 
  horizontal = false 
}: WizardStepProps) {
  
  if (horizontal) {
    return (
      <div 
        className="flex flex-col items-center"
        onClick={isComplete ? onClick : undefined}
      >
        <div className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center font-medium text-sm transition-colors",
          isActive && "bg-primary text-primary-foreground",
          isComplete && "bg-primary/80 text-primary-foreground",
          !isActive && !isComplete && "bg-muted text-muted-foreground"
        )}>
          {isComplete ? <CheckIcon className="h-4 w-4" /> : index + 1}
        </div>
        <div className="text-xs mt-1 text-center">{stepInfo.label}</div>
      </div>
    );
  }
  
  return (
    <button
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
        isActive && "bg-primary/10 text-primary",
        isComplete && !isActive && "text-primary hover:bg-primary/5",
        !isActive && !isComplete && "text-muted-foreground hover:bg-muted/50",
        isComplete && "cursor-pointer",
        !isComplete && !isActive && "cursor-not-allowed"
      )}
      onClick={isComplete ? onClick : undefined}
      disabled={!isComplete && !isActive}
    >
      <div className={cn(
        "w-6 h-6 rounded-full flex items-center justify-center text-sm transition-colors",
        isActive && "bg-primary text-primary-foreground",
        isComplete && !isActive && "bg-primary/80 text-primary-foreground",
        !isActive && !isComplete && "bg-muted text-primary-foreground/50"
      )}>
        {isComplete ? <CheckIcon className="h-3 w-3" /> : index + 1}
      </div>
      <div className="flex flex-col items-start">
        <span>{stepInfo.label}</span>
        <span className="text-xs text-muted-foreground">{stepInfo.description}</span>
      </div>
    </button>
  );
}
