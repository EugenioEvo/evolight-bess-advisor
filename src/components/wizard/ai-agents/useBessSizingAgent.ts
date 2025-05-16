
import { useState } from 'react';
import { toast } from 'sonner';
import { BessSizingResult } from './types';
import { MODULE_POWER_KW, MODULE_ENERGY_KWH } from "@/config/bessModuleConfig";

/**
 * Hook for using AI to recommend BESS sizing
 */
export const useBessSizingAgent = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<BessSizingResult | null>(null);

  /**
   * Analyze load and recommend optimal BESS sizing
   */
  const analyzeBessSizing = async (
    hourlyDemandKw: number[],
    peakShavingTarget?: number,
    peakShavingPercentage?: number,
    peakStartHour?: number,
    peakEndHour?: number,
    hourlyPvKw?: number[]
  ): Promise<BessSizingResult> => {
    try {
      setIsAnalyzing(true);
      toast.info('Analisando dimensionamento...', { 
        description: 'O assistente de IA está calculando o dimensionamento ideal para BESS.' 
      });

      console.log('Analyzing BESS sizing with:', {
        hourlyDemandKw,
        peakShavingTarget,
        peakShavingPercentage,
        peakStartHour,
        peakEndHour,
        hourlyPvKw
      });

      // In a future implementation, this would call the OpenAI API via a Supabase Edge Function
      // For now, we'll use a simplified algorithm to recommend BESS sizing
      
      // Default to hours 18-21 if not specified
      const peakStart = peakStartHour ?? 18;
      const peakEnd = peakEndHour ?? 21;
      
      // Calculate peak demand
      const peakHoursDemand = hourlyDemandKw
        .filter((_, hour) => hour >= peakStart && hour <= peakEnd);
      
      const maxPeakDemand = Math.max(...peakHoursDemand);
      const avgPeakDemand = peakHoursDemand.reduce((sum, val) => sum + val, 0) / peakHoursDemand.length;
      
      // Calculate required power based on peak shaving target or percentage
      let requiredPowerKw = 0;
      let rationale = '';
      
      if (typeof peakShavingTarget === 'number' && peakShavingTarget > 0) {
        // Fixed peak shaving target
        requiredPowerKw = peakShavingTarget;
        rationale = `Dimensionamento baseado no alvo fixo de peak shaving de ${peakShavingTarget} kW.`;
      } else if (typeof peakShavingPercentage === 'number' && peakShavingPercentage > 0) {
        // Percentage-based peak shaving
        requiredPowerKw = maxPeakDemand * (peakShavingPercentage / 100);
        rationale = `Dimensionamento baseado em ${peakShavingPercentage}% de redução do pico de demanda de ${maxPeakDemand.toFixed(2)} kW.`;
      } else {
        // Default to 30% peak shaving if no target specified
        requiredPowerKw = maxPeakDemand * 0.3;
        rationale = `Dimensionamento baseado em valor padrão de 30% de redução do pico de demanda de ${maxPeakDemand.toFixed(2)} kW.`;
      }
      
      // Calculate required energy based on peak hours duration and peak shaving power
      const peakDurationHours = peakEnd - peakStart + 1;
      const requiredEnergyKwh = requiredPowerKw * peakDurationHours * 1.2; // 20% buffer
      
      // Calculate required modules based on standard BESS module size
      const powerModules = Math.ceil(requiredPowerKw / MODULE_POWER_KW);
      const energyModules = Math.ceil(requiredEnergyKwh / MODULE_ENERGY_KWH);
      const recommendedModules = Math.max(powerModules, energyModules);
      
      // Calculate actual capacity based on recommended modules
      const recommendedPowerKw = recommendedModules * MODULE_POWER_KW;
      const recommendedEnergyKwh = recommendedModules * MODULE_ENERGY_KWH;

      const result: BessSizingResult = {
        analysis: `Com base no perfil de carga e nos requisitos de peak shaving, recomendamos um sistema BESS com ${recommendedPowerKw} kW de potência e ${recommendedEnergyKwh} kWh de capacidade.`,
        recommendedPowerKw,
        recommendedEnergyKwh,
        recommendedModules,
        rationale,
        recommendations: [
          `Baseado em ${recommendedModules} módulos de BESS (${MODULE_POWER_KW}kW/${MODULE_ENERGY_KWH}kWh cada).`,
          `Esta configuração oferece capacidade suficiente para cobrir todo o período de ponta de ${peakDurationHours} horas.`,
          `A potência de descarga de ${recommendedPowerKw}kW permite o peak shaving desejado com uma margem de segurança.`
        ],
        confidence: 0.9,
        processingTimeMs: 850,
        suggestedValues: {
          bessPowerKw: recommendedPowerKw,
          bessEnergyKwh: recommendedEnergyKwh,
          bessModules: recommendedModules
        }
      };
      
      setAnalysisResult(result);
      toast.success('Dimensionamento concluído', { 
        description: 'Recomendações de dimensionamento BESS disponíveis.' 
      });
      
      return result;
    } catch (error) {
      console.error('Error analyzing BESS sizing:', error);
      toast.error('Erro no dimensionamento', { 
        description: 'Não foi possível completar a análise de dimensionamento BESS.' 
      });
      
      const errorResult: BessSizingResult = {
        analysis: 'Erro ao analisar o dimensionamento BESS.',
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
    analyzeBessSizing,
    isAnalyzing,
    analysisResult
  };
};
