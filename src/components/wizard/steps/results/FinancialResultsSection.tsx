
import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp, BarChart } from 'lucide-react';
import { useWizard } from '../../context/WizardContext';
import { AIAgentButton } from '../../ai-agents/AIAgentButton';
import { AIAgentResultCard } from '../../ai-agents/AIAgentResultCard';
import { useFinancialAnalysisAgent } from '../../ai-agents/useFinancialAnalysisAgent';
import { SimuladorFormValues } from '@/schemas/simuladorSchema';

export function FinancialResultsSection() {
  const { simulationResults } = useWizard();
  const { watch, setValue, getValues } = useFormContext();
  const { analyzeFinancials, isAnalyzing, analysisResult } = useFinancialAnalysisAgent();
  const [showAnalysis, setShowAnalysis] = useState(false);
  
  const businessModel = watch('businessModel');
  const horizonYears = watch('horizonYears') || 10;
  
  // Use simulation results or fall back to defaults
  const bessPowerKw = simulationResults?.bessPowerKw || 108;
  const bessEnergyKwh = simulationResults?.bessEnergyKwh || 215;
  const annualSavings = simulationResults?.kpiAnnual || 50000;
  const paybackYears = (simulationResults?.paybackYears || 5).toFixed(1);
  
  const handleAnalyzeFinancials = async () => {
    const formValues = getValues() as SimuladorFormValues;
    const result = await analyzeFinancials(
      formValues,
      bessPowerKw,
      bessEnergyKwh,
      annualSavings
    );
    setShowAnalysis(true);
  };

  const handleApplySuggestions = () => {
    if (analysisResult?.suggestedValues) {
      const { discountRate, horizonYears, annualEscalation } = analysisResult.suggestedValues;
      
      if (typeof discountRate === 'number') {
        setValue('discountRate', discountRate);
      }
      
      if (typeof horizonYears === 'number') {
        setValue('horizonYears', horizonYears);
      }
      
      if (typeof annualEscalation === 'number') {
        setValue('annualEscalation', annualEscalation);
      }
    }
    setShowAnalysis(false);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Análise Financeira</h3>
        <AIAgentButton 
          onAnalyzeFinancials={handleAnalyzeFinancials}
          isLoading={isAnalyzing}
          variant="outline"
          size="sm"
        />
      </div>
      
      {showAnalysis && analysisResult && (
        <AIAgentResultCard 
          result={analysisResult}
          onApplySuggestions={handleApplySuggestions}
          onDismiss={() => setShowAnalysis(false)}
        >
          {analysisResult.optimizationSuggestions && analysisResult.optimizationSuggestions.length > 0 && (
            <div className="bg-muted/40 p-3 rounded-md mt-2">
              <p className="text-sm font-medium">Otimizações sugeridas:</p>
              <div className="mt-2 space-y-2">
                {analysisResult.optimizationSuggestions.map((suggestion, index) => (
                  <div key={index} className="text-sm">
                    <div className="flex justify-between">
                      <span>{suggestion.field}</span>
                      <span>{suggestion.currentValue} → <span className="font-medium">{suggestion.suggestedValue}</span></span>
                    </div>
                    <p className="text-xs text-muted-foreground">{suggestion.impact}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {analysisResult.paybackEstimate && (
            <div className="bg-primary/5 p-2 rounded-md mt-2">
              <div className="flex gap-3 justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Payback</p>
                  <p className="text-sm font-semibold">{analysisResult.paybackEstimate.toFixed(1)} anos</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">ROI</p>
                  <p className="text-sm font-semibold">{analysisResult.roi?.toFixed(1)}%</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">VPL</p>
                  <p className="text-sm font-semibold">R$ {Math.round(analysisResult.npv || 0).toLocaleString()}</p>
                </div>
              </div>
            </div>
          )}
        </AIAgentResultCard>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-md flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Economia Anual
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">R$ {Math.round(annualSavings).toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">
              {businessModel === 'turnkey' 
                ? 'Economias diretas na fatura de energia'
                : 'Economia líquida após pagamentos do EAAS'
              }
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-md flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Payback
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{paybackYears} anos</p>
            <p className="text-sm text-muted-foreground">
              {Number(paybackYears) < horizonYears 
                ? `Retorno em ${Math.round(Number(paybackYears) / horizonYears * 100)}% do horizonte`
                : 'Acima do horizonte do projeto'
              }
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-md flex items-center gap-2">
              <BarChart className="h-5 w-5" />
              ROI do Projeto
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {(annualSavings * horizonYears / (bessEnergyKwh * 1500) * 100).toFixed(1)}%
            </p>
            <p className="text-sm text-muted-foreground">
              Em {horizonYears} anos de operação
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
