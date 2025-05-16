
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ProfilePreviewChart } from '../../charts/ProfilePreviewChart';
import { AIAgentButton } from '../../ai-agents/AIAgentButton';
import { AIAgentResultCard } from '../../ai-agents/AIAgentResultCard';
import { useLoadAnalysisAgent } from '../../ai-agents/useLoadAnalysisAgent';
import { useFormContext } from 'react-hook-form';
import { LoadProfileAnalysisResult } from '../../ai-agents/types';

interface ProfileChartPreviewProps {
  hourlyDemandKw: number[];
  hourlyPvKw?: number[];
  peakStartHour?: number;
  peakEndHour?: number;
}

export function ProfileChartPreview({
  hourlyDemandKw,
  hourlyPvKw,
  peakStartHour = 18,
  peakEndHour = 21
}: ProfileChartPreviewProps) {
  const { setValue } = useFormContext();
  const { analyzeLoadProfile, isAnalyzing, analysisResult } = useLoadAnalysisAgent();
  const [showAnalysis, setShowAnalysis] = useState(false);

  const handleAnalyzeLoad = async () => {
    const result = await analyzeLoadProfile(hourlyDemandKw, hourlyPvKw, peakStartHour, peakEndHour);
    setShowAnalysis(true);
  };

  const handleApplySuggestions = () => {
    if (analysisResult?.suggestedValues) {
      const { peakStartHour, peakEndHour, avgPeakDemandKw, avgOffpeakDemandKw } = analysisResult.suggestedValues;
      
      if (typeof peakStartHour === 'number') {
        setValue('peakStartHour', peakStartHour);
      }
      
      if (typeof peakEndHour === 'number') {
        setValue('peakEndHour', peakEndHour);
      }
      
      if (typeof avgPeakDemandKw === 'number') {
        setValue('avgPeakDemandKw', avgPeakDemandKw);
      }
      
      if (typeof avgOffpeakDemandKw === 'number') {
        setValue('avgOffpeakDemandKw', avgOffpeakDemandKw);
      }
    }
    setShowAnalysis(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-md font-medium">Visualização do Perfil</h3>
        <AIAgentButton 
          onAnalyzeLoad={handleAnalyzeLoad}
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
          {analysisResult.peakHours && (
            <div className="bg-muted/40 p-3 rounded-md mt-2">
              <p className="text-sm font-medium">Período de ponta detectado: {analysisResult.peakHours[0]}:00 - {analysisResult.peakHours[1]}:00</p>
              <p className="text-sm mt-1">Demanda média na ponta: {analysisResult.peakDemand?.toFixed(1)} kW</p>
              <p className="text-sm">Demanda média fora de ponta: {analysisResult.offPeakDemand?.toFixed(1)} kW</p>
            </div>
          )}
          {analysisResult.anomalies && analysisResult.anomalies.length > 0 && (
            <div className="mt-2">
              <h4 className="text-sm font-medium">Anomalias detectadas:</h4>
              <ul className="text-xs text-muted-foreground">
                {analysisResult.anomalies.map((a, i) => (
                  <li key={i}>{a.hour}:00 - {a.value.toFixed(1)} kW - {a.reason}</li>
                ))}
              </ul>
            </div>
          )}
        </AIAgentResultCard>
      )}

      <Card>
        <CardContent className="p-4">
          <ProfilePreviewChart
            hourlyDemandKw={hourlyDemandKw}
            hourlyPvKw={hourlyPvKw}
            peakStartHour={peakStartHour}
            peakEndHour={peakEndHour}
            height={300}
          />
        </CardContent>
      </Card>
    </div>
  );
}
