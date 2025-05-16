
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AIAgentResponse } from './types';
import { Sparkles, Check, XIcon, ThumbsUp, Clock } from 'lucide-react';

interface AIAgentResultCardProps {
  result: AIAgentResponse;
  onApplySuggestions?: () => void;
  onDismiss?: () => void;
  children?: React.ReactNode;
}

export function AIAgentResultCard({ 
  result, 
  onApplySuggestions,
  onDismiss,
  children 
}: AIAgentResultCardProps) {
  const confidenceColor = result.confidence > 0.8 
    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
    : result.confidence > 0.5 
      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';

  const confidenceLabel = result.confidence > 0.8 
    ? 'Alta' 
    : result.confidence > 0.5 
      ? 'Média'
      : 'Baixa';

  return (
    <Card className="mb-6 border border-primary/20 shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <CardTitle className="text-md">Análise por IA</CardTitle>
          </div>
          <Badge variant="outline" className={`${confidenceColor}`}>
            Confiança: {confidenceLabel}
          </Badge>
        </div>
        <CardDescription>
          {result.processingTimeMs 
            ? `Processado em ${(result.processingTimeMs/1000).toFixed(1)}s` 
            : 'Análise automática'
          }
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pb-3 pt-2">
        <div className="space-y-3">
          <p className="text-sm">{result.analysis}</p>
          
          {result.recommendations && result.recommendations.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Recomendações:</h4>
              <ul className="space-y-1">
                {result.recommendations.map((rec, index) => (
                  <li key={index} className="text-sm flex items-start gap-2">
                    <ThumbsUp className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {children}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between pt-2">
        {onApplySuggestions && (
          <Button 
            variant="default" 
            size="sm" 
            onClick={onApplySuggestions}
            className="gap-1"
          >
            <Check className="h-4 w-4" /> 
            Aplicar sugestões
          </Button>
        )}
        
        {onDismiss && (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onDismiss}
          >
            <XIcon className="h-4 w-4 mr-1" /> 
            Dispensar
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
