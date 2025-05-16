
import React from 'react';
import { Button } from "@/components/ui/button";
import { Sparkles, ChevronDown } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface AIAgentButtonProps {
  onAnalyzeLoad?: () => void;
  onAnalyzeSizing?: () => void;
  onAnalyzeFinancials?: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  variant?: "default" | "outline" | "ghost" | "link" | "destructive" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
}

export function AIAgentButton({
  onAnalyzeLoad,
  onAnalyzeSizing,
  onAnalyzeFinancials,
  disabled = false,
  isLoading = false,
  variant = "outline",
  size = "default"
}: AIAgentButtonProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant={variant} 
                  size={size}
                  disabled={disabled || isLoading}
                  className="gap-1"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-1" />
                      Analisando...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Assistente IA
                      <ChevronDown className="h-3 w-3 opacity-50" />
                    </>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {onAnalyzeLoad && (
                  <DropdownMenuItem onClick={onAnalyzeLoad}>
                    Analisar perfil de carga
                  </DropdownMenuItem>
                )}
                {onAnalyzeSizing && (
                  <DropdownMenuItem onClick={onAnalyzeSizing}>
                    Recomendar dimensionamento BESS
                  </DropdownMenuItem>
                )}
                {onAnalyzeFinancials && (
                  <DropdownMenuItem onClick={onAnalyzeFinancials}>
                    Otimizar parâmetros financeiros
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Usar IA para analisar dados e otimizar parâmetros</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
