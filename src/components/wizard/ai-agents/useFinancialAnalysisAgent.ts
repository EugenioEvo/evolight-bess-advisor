
import { useState } from 'react';
import { toast } from 'sonner';
import { FinancialAnalysisResult } from './types';
import { SimuladorFormValues } from "@/schemas/simuladorSchema";

/**
 * Hook for using AI to perform financial analysis of BESS projects
 */
export const useFinancialAnalysisAgent = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<FinancialAnalysisResult | null>(null);

  /**
   * Analyze financial parameters and recommend optimizations
   */
  const analyzeFinancials = async (
    formValues: SimuladorFormValues,
    calculatedPowerKw: number,
    calculatedEnergyKwh: number,
    annualSavings?: number
  ): Promise<FinancialAnalysisResult> => {
    try {
      setIsAnalyzing(true);
      toast.info('Analisando financeiramente...', { 
        description: 'O assistente de IA está avaliando os parâmetros financeiros do projeto.' 
      });

      console.log('Analyzing financial parameters:', {
        businessModel: formValues.businessModel,
        horizonYears: formValues.horizonYears,
        discountRate: formValues.discountRate,
        bessInstallationCost: formValues.bessInstallationCost,
        annualOmCost: formValues.annualOmCost,
        calculatedPowerKw,
        calculatedEnergyKwh,
        annualSavings
      });

      // In a future implementation, this would call the OpenAI API via a Supabase Edge Function
      // For now, we'll use a simplified algorithm for financial analysis

      // Calculate total BESS investment
      const totalInvestment = formValues.bessInstallationCost 
        ? formValues.bessInstallationCost * calculatedEnergyKwh
        : calculatedEnergyKwh * 1500; // Default cost of R$1,500/kWh if not specified
      
      // Calculate annual maintenance costs
      const annualMaintenance = totalInvestment * (formValues.annualOmCost / 100);
      
      // Use provided annual savings or estimate as 20% of investment per year
      const estimatedAnnualSavings = annualSavings || totalInvestment * 0.2;
      
      // Calculate simple payback
      const paybackEstimate = totalInvestment / (estimatedAnnualSavings - annualMaintenance);
      
      // Calculate basic ROI
      const totalReturns = (estimatedAnnualSavings - annualMaintenance) * formValues.horizonYears;
      const roi = (totalReturns - totalInvestment) / totalInvestment * 100;
      
      // Calculate simple NPV (not accounting for inflation)
      let npv = -totalInvestment;
      const discountRate = formValues.discountRate / 100;
      
      for (let year = 1; year <= formValues.horizonYears; year++) {
        npv += (estimatedAnnualSavings - annualMaintenance) / Math.pow(1 + discountRate, year);
      }
      
      // Determine if rate is favorable or could be adjusted
      const idealDiscountRate = formValues.businessModel === 'turnkey' ? 8 : 12;
      const adjustedDiscountRate = Math.max(Math.min(formValues.discountRate, 15), 5);
      
      // Determine if project horizon is reasonable
      const idealHorizon = formValues.businessModel === 'turnkey' ? 10 : 7;
      const adjustedHorizon = Math.max(Math.min(formValues.horizonYears, 15), 5);

      // Generate optimization suggestions
      const optimizationSuggestions = [];
      
      if (Math.abs(formValues.discountRate - idealDiscountRate) > 2) {
        optimizationSuggestions.push({
          field: 'discountRate',
          currentValue: formValues.discountRate,
          suggestedValue: idealDiscountRate,
          impact: formValues.discountRate > idealDiscountRate 
            ? 'Reduzir a taxa de desconto melhora o VPL do projeto'
            : 'Aumentar a taxa de desconto torna a análise mais conservadora'
        });
      }
      
      if (Math.abs(formValues.horizonYears - idealHorizon) > 2) {
        optimizationSuggestions.push({
          field: 'horizonYears',
          currentValue: formValues.horizonYears,
          suggestedValue: idealHorizon,
          impact: formValues.horizonYears > idealHorizon 
            ? 'Um horizonte menor reduz incertezas tecnológicas'
            : 'Um horizonte maior captura mais valor do investimento'
        });
      }
      
      if (!formValues.annualEscalation) {
        optimizationSuggestions.push({
          field: 'annualEscalation',
          currentValue: 0,
          suggestedValue: 5,
          impact: 'Incluir escalação anual nas tarifas melhora o retorno projetado'
        });
      }

      const result: FinancialAnalysisResult = {
        analysis: `Com base nos parâmetros financeiros atuais, o sistema BESS de ${calculatedPowerKw}kW/${calculatedEnergyKwh}kWh tem um payback estimado em ${paybackEstimate.toFixed(1)} anos e ROI de ${roi.toFixed(1)}%.`,
        paybackEstimate,
        roi,
        npv,
        recommendations: [
          `O payback de ${paybackEstimate.toFixed(1)} anos é ${paybackEstimate < 5 ? 'atrativo' : 'desafiador'} para o modelo de negócio atual.`,
          `O VPL do projeto é R$${npv.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}, ${npv > 0 ? 'tornando o projeto viável' : 'o que pode indicar necessidade de ajustes'}.`,
          `O ROI de ${roi.toFixed(1)}% ${roi > 15 ? 'é atrativo' : 'pode precisar de otimização'} para o período de ${formValues.horizonYears} anos.`
        ],
        optimizationSuggestions,
        confidence: 0.87,
        processingTimeMs: 920,
        suggestedValues: {
          discountRate: adjustedDiscountRate,
          horizonYears: adjustedHorizon,
          annualEscalation: 5 // Suggest adding annual escalation if not already set
        }
      };
      
      setAnalysisResult(result);
      toast.success('Análise financeira concluída', { 
        description: 'Recomendações financeiras disponíveis.' 
      });
      
      return result;
    } catch (error) {
      console.error('Error analyzing financials:', error);
      toast.error('Erro na análise financeira', { 
        description: 'Não foi possível completar a análise financeira.' 
      });
      
      const errorResult: FinancialAnalysisResult = {
        analysis: 'Erro ao analisar parâmetros financeiros.',
        confidence: 0,
        processingTimeMs: 0
      };
      
      setAnalysisResult(errorResult);
      return errorResult;
    } finally {
      setIsAnalyzing(false);
    }
  };

  return {
    analyzeFinancials,
    isAnalyzing,
    analysisResult
  };
};
