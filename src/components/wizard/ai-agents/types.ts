
// AI Agent Types

export type AIAgentResponse = {
  analysis: string;
  recommendations?: string[];
  suggestedValues?: Record<string, any>;
  confidence: number; // 0-1
  processingTimeMs?: number;
};

export type LoadProfileAnalysisResult = AIAgentResponse & {
  peakHours?: [number, number]; // Detected peak hours [start, end]
  peakDemand?: number; // Detected peak demand in kW
  offPeakDemand?: number; // Detected off-peak average demand in kW
  anomalies?: { hour: number; value: number; reason: string }[]; // Any detected anomalies
  suggestedValues?: {
    peakStartHour?: number;
    peakEndHour?: number;
    avgPeakDemandKw?: number;
    avgOffpeakDemandKw?: number;
  };
};

export type BessSizingResult = AIAgentResponse & {
  recommendedPowerKw?: number;
  recommendedEnergyKwh?: number;
  recommendedModules?: number;
  rationale?: string;
  suggestedValues?: {
    bessPowerKw?: number;
    bessEnergyKwh?: number;
    bessModules?: number;
  };
};

export type FinancialAnalysisResult = AIAgentResponse & {
  paybackEstimate?: number;
  roi?: number;
  npv?: number;
  optimizationSuggestions?: { 
    field: string;
    currentValue: any;
    suggestedValue: any;
    impact: string;
  }[];
  suggestedValues?: {
    discountRate?: number;
    horizonYears?: number;
    annualEscalation?: number;
  };
};
