
import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Battery, BarChart3, ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWizard } from '../../context/WizardContext';
import { AIAgentButton } from '../../ai-agents/AIAgentButton';
import { AIAgentResultCard } from '../../ai-agents/AIAgentResultCard';
import { useBessSizingAgent } from '../../ai-agents/useBessSizingAgent';

export function BessSizingSection() {
  const { simulationResults, runSimulation } = useWizard();
  const { watch, setValue } = useFormContext();
  const { analyzeBessSizing, isAnalyzing, analysisResult } = useBessSizingAgent();
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  
  const hourlyDemandKw = watch('hourlyDemandKw') || [];
  const hourlyPvKw = watch('hourlyPvKw') || [];
  const peakShavingTarget = watch('peakShavingTarget');
  const peakShavingPercentage = watch('peakShavingPercentage');
  const peakStartHour = watch('peakStartHour');
  const peakEndHour = watch('peakEndHour');
  
  const bessPowerKw = simulationResults?.bessPowerKw || 108;
  const bessEnergyKwh = simulationResults?.bessEnergyKwh || 215;
  const modules = simulationResults?.modules || 1;
  
  const handleAnalyzeSizing = async () => {
    const result = await analyzeBessSizing(
      hourlyDemandKw,
      peakShavingTarget,
      peakShavingPercentage,
      peakStartHour,
      peakEndHour,
      hourlyPvKw
    );
    setShowAnalysis(true);
  };

  const handleApplySuggestions = () => {
    if (analysisResult?.suggestedValues) {
      const { bessPowerKw, bessEnergyKwh, bessModules } = analysisResult.suggestedValues;
      
      if (typeof bessPowerKw === 'number') {
        setValue('bessPowerKw', bessPowerKw);
      }
      
      if (typeof bessEnergyKwh === 'number') {
        setValue('bessEnergyKwh', bessEnergyKwh);
      }
      
      // Run simulation with new values
      runSimulation();
    }
    setShowAnalysis(false);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Dimensionamento BESS</h3>
        <AIAgentButton 
          onAnalyzeSizing={handleAnalyzeSizing}
          isLoading={isAnalyzing}
          disabled={!hourlyDemandKw || hourlyDemandKw.length === 0}
        />
      </div>
      
      {showAnalysis && analysisResult && (
        <AIAgentResultCard 
          result={analysisResult}
          onApplySuggestions={handleApplySuggestions}
          onDismiss={() => setShowAnalysis(false)}
        >
          {analysisResult.recommendedPowerKw && analysisResult.recommendedEnergyKwh && (
            <div className="bg-muted/40 p-3 rounded-md mt-2">
              <p className="text-sm font-medium">Dimensionamento recomendado pela IA:</p>
              <div className="flex gap-3 mt-2">
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Potência</p>
                  <p className="text-sm font-semibold">{analysisResult.recommendedPowerKw} kW</p>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Energia</p>
                  <p className="text-sm font-semibold">{analysisResult.recommendedEnergyKwh} kWh</p>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Módulos</p>
                  <p className="text-sm font-semibold">{analysisResult.recommendedModules}</p>
                </div>
              </div>
              {analysisResult.rationale && (
                <p className="text-xs text-muted-foreground mt-2">{analysisResult.rationale}</p>
              )}
            </div>
          )}
        </AIAgentResultCard>
      )}
      
      <Card className="overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-md flex items-center gap-2">
              <Battery className="h-5 w-5" />
              Sistema BESS
            </CardTitle>
            <Badge variant="outline">{modules} {modules === 1 ? 'módulo' : 'módulos'}</Badge>
          </div>
        </CardHeader>
        <CardContent className="pb-4">
          <div className="grid grid-cols-2 gap-6 mb-4">
            <div>
              <p className="text-sm text-muted-foreground">Potência</p>
              <p className="text-xl font-semibold">{bessPowerKw} kW</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Capacidade</p>
              <p className="text-xl font-semibold">{bessEnergyKwh} kWh</p>
            </div>
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full flex items-center justify-center text-xs gap-1"
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? (
              <>
                <ChevronUp className="h-4 w-4" />
                Ocultar detalhes
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4" />
                Ver detalhes técnicos
              </>
            )}
          </Button>
          
          {showDetails && (
            <div className="mt-4 pt-4 border-t border-border/50 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Tipo de Bateria</p>
                  <p>Lithium-Ion (LFP)</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Eficiência</p>
                  <p>95%</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Ciclo DoD</p>
                  <p>85%</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Vida Útil</p>
                  <p>10 anos / 4000 ciclos</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
