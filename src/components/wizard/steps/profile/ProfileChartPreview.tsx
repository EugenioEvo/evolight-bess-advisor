
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ProfilePreviewChart } from '../../charts/ProfilePreviewChart';

interface ProfileChartPreviewProps {
  hourlyDemandKw: number[];
  hourlyPvKw?: number[];
  peakStartHour: number;
  peakEndHour: number;
}

export function ProfileChartPreview({ 
  hourlyDemandKw, 
  hourlyPvKw, 
  peakStartHour, 
  peakEndHour 
}: ProfileChartPreviewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Prévia da Curva de Carga</CardTitle>
        <CardDescription>
          Visualize seu perfil de consumo{hourlyPvKw ? ' e geração' : ''} ao longo do dia
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ProfilePreviewChart 
          hourlyDemandKw={hourlyDemandKw} 
          hourlyPvKw={hourlyPvKw}
          peakStartHour={peakStartHour}
          peakEndHour={peakEndHour}
          showPeakPeriod={true}
          height={250}
        />
        
        <Alert className="mt-4 bg-blue-50 border-blue-100">
          <AlertDescription className="text-sm text-blue-700">
            O dimensionamento do sistema BESS será otimizado com base neste perfil energético.
            Para resultados mais precisos, verifique se os dados refletem seu padrão típico de consumo.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
