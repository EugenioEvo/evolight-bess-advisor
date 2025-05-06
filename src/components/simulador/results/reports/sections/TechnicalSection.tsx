
import React from 'react';
import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Table, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { SimuladorFormValues } from "@/schemas/simuladorSchema";
import { MODULE_POWER_KW, MODULE_ENERGY_KWH, calculateRequiredModules, calculateActualCapacity } from "@/config/bessModuleConfig";

interface TechnicalSectionProps {
  results: {
    calculatedEnergyKwh: number;
    calculatedPowerKw: number;
  };
  formValues: SimuladorFormValues;
}

export function TechnicalSection({ results, formValues }: TechnicalSectionProps) {
  // Make sure we have default values if results are null
  const calculatedPowerKw = results.calculatedPowerKw || 0;
  const calculatedEnergyKwh = results.calculatedEnergyKwh || 0;
  
  // Calculate required number of modules
  const bessUnitsRequired = calculateRequiredModules(calculatedPowerKw, calculatedEnergyKwh);
  
  // Get actual capacity based on module count
  const actualCapacity = calculateActualCapacity(bessUnitsRequired);
  
  return (
    <AccordionItem value="technical">
      <AccordionTrigger className="font-medium">Especificações Técnicas</AccordionTrigger>
      <AccordionContent>
        <div className="py-2 space-y-4">
          <h4 className="text-lg font-medium">Especificações do Sistema BESS</h4>
          
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Unidades BESS</TableCell>
                <TableCell>{bessUnitsRequired} unidades</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Potência por Unidade</TableCell>
                <TableCell>{MODULE_POWER_KW} kW</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Capacidade por Unidade</TableCell>
                <TableCell>{MODULE_ENERGY_KWH} kWh</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Potência Total</TableCell>
                <TableCell>{actualCapacity.powerKw.toFixed(0)} kW</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Capacidade Total</TableCell>
                <TableCell>{actualCapacity.energyKwh.toFixed(0)} kWh</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Tecnologia da Bateria</TableCell>
                <TableCell>
                  {formValues.bessTechnology === 'lfp' ? 'Lítio Ferro Fosfato (LFP)' : 'Lítio NMC'}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Eficiência Roundtrip</TableCell>
                <TableCell>{formValues.bessEfficiency}%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Profundidade de Descarga (DoD) Máxima</TableCell>
                <TableCell>{formValues.bessMaxDod}%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Expectativa de Vida Útil</TableCell>
                <TableCell>{formValues.bessLifetime} anos</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Degradação Anual</TableCell>
                <TableCell>{formValues.bessAnnualDegradation}%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Autodescarga Diária</TableCell>
                <TableCell>{formValues.bessDailySelfdischarge}%</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          
          {formValues.useBackup && (
            <>
              <h4 className="text-lg font-medium mt-6">Backup de Energia</h4>
              <p>
                O sistema foi dimensionado para fornecer backup de energia de{' '}
                <strong>{formValues.backupDurationHours} horas</strong> para cargas críticas de{' '}
                <strong>{formValues.criticalLoadKw} kW</strong>.
              </p>
            </>
          )}
          
          {formValues.usePeakShaving && (
            <>
              <h4 className="text-lg font-medium mt-6">Redução de Demanda na Ponta</h4>
              <p>
                O sistema foi configurado para reduzir{' '}
                {formValues.peakShavingMethod === 'percentage' ? (
                  <strong>{formValues.peakShavingPercentage}% da demanda na ponta</strong>
                ) : (
                  <strong>a demanda na ponta para {formValues.peakShavingTarget} kW</strong>
                )}{' '}
                durante o período de ponta ({formValues.peakStartHour}h às {formValues.peakEndHour}h).
              </p>
            </>
          )}
          
          {formValues.useArbitrage && (
            <>
              <h4 className="text-lg font-medium mt-6">Arbitragem de Energia</h4>
              <p>
                O sistema foi configurado para realizar arbitragem de energia, carregando durante períodos 
                de tarifa baixa e descarregando durante períodos de tarifa alta.
              </p>
            </>
          )}
          
          {formValues.hasPv && formValues.usePvOptim && (
            <>
              <h4 className="text-lg font-medium mt-6">Integração com Sistema Fotovoltaico</h4>
              <p>
                O sistema foi dimensionado para otimizar o uso da energia gerada pelo sistema fotovoltaico 
                de {formValues.pvPowerKwp} kWp.
              </p>
            </>
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
