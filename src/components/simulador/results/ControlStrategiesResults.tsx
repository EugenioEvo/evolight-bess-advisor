
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Check, Info } from 'lucide-react';
import { SimuladorFormValues } from "@/schemas/simuladorSchema";

interface ControlStrategiesResultsProps {
  formValues: SimuladorFormValues;
}

export function ControlStrategiesResults({ formValues }: ControlStrategiesResultsProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-lg font-semibold mb-4">Estratégias de Controle Aplicadas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className={`p-4 border rounded-lg ${formValues.usePeakShaving ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}>
            <div className="flex items-center mb-2">
              {formValues.usePeakShaving ? (
                <Check className="h-5 w-5 text-green-500 mr-2" />
              ) : (
                <Info className="h-5 w-5 text-gray-400 mr-2" />
              )}
              <h4 className="font-medium">Peak Shaving</h4>
            </div>
            {formValues.usePeakShaving && (
              <p className="text-sm">
                {formValues.peakShavingMethod === 'percentage' 
                  ? `Redução de ${formValues.peakShavingPercentage}% do pico`
                  : formValues.peakShavingMethod === 'target'
                  ? `Meta de demanda: ${formValues.peakShavingTarget} kW` 
                  : `Redução de ${formValues.peakShavingTarget} kW`}
              </p>
            )}
          </div>
          
          <div className={`p-4 border rounded-lg ${formValues.useArbitrage ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}>
            <div className="flex items-center mb-2">
              {formValues.useArbitrage ? (
                <Check className="h-5 w-5 text-green-500 mr-2" />
              ) : (
                <Info className="h-5 w-5 text-gray-400 mr-2" />
              )}
              <h4 className="font-medium">Arbitragem</h4>
            </div>
            {formValues.useArbitrage && (
              <p className="text-sm">
                Carrega fora de ponta / Descarrega na ponta
              </p>
            )}
          </div>
          
          <div className={`p-4 border rounded-lg ${formValues.useBackup ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}>
            <div className="flex items-center mb-2">
              {formValues.useBackup ? (
                <Check className="h-5 w-5 text-green-500 mr-2" />
              ) : (
                <Info className="h-5 w-5 text-gray-400 mr-2" />
              )}
              <h4 className="font-medium">Backup</h4>
            </div>
            {formValues.useBackup && (
              <p className="text-sm">
                {formValues.criticalLoadKw} kW por {formValues.backupDurationHours} horas
              </p>
            )}
          </div>
          
          <div className={`p-4 border rounded-lg ${formValues.usePvOptim && formValues.hasPv ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}>
            <div className="flex items-center mb-2">
              {formValues.usePvOptim && formValues.hasPv ? (
                <Check className="h-5 w-5 text-green-500 mr-2" />
              ) : (
                <Info className="h-5 w-5 text-gray-400 mr-2" />
              )}
              <h4 className="font-medium">Otimização PV</h4>
            </div>
            {formValues.usePvOptim && formValues.hasPv && (
              <p className="text-sm">
                {formValues.pvPolicy === 'grid_zero' ? 'Grid Zero (sem injeção)' : 'Maximização do autoconsumo'}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
