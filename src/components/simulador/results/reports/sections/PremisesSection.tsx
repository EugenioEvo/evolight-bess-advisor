
import React from 'react';
import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { SimuladorFormValues } from "@/schemas/simuladorSchema";

interface PremisesSectionProps {
  formValues: SimuladorFormValues;
}

export function PremisesSection({ formValues }: PremisesSectionProps) {
  return (
    <AccordionItem value="premises">
      <AccordionTrigger className="font-medium">Premissas Utilizadas</AccordionTrigger>
      <AccordionContent>
        <div className="py-2">
          <h4 className="font-medium mb-2">Parâmetros do Projeto</h4>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Parâmetro</TableHead>
                <TableHead>Valor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Tipo de Instalação</TableCell>
                <TableCell>{
                  formValues.installationType === 'industrial' ? 'Industrial' : 
                  formValues.installationType === 'commercial' ? 'Comercial' : 
                  formValues.installationType === 'residential' ? 'Residencial' : 'Outro'
                }</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Demanda Média na Ponta (kW)</TableCell>
                <TableCell>{formValues.avgPeakDemandKw}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Demanda Média Fora Ponta (kW)</TableCell>
                <TableCell>{formValues.avgOffpeakDemandKw}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Demanda Máxima na Ponta (kW)</TableCell>
                <TableCell>{formValues.maxPeakDemandKw}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Demanda Máxima Fora Ponta (kW)</TableCell>
                <TableCell>{formValues.maxOffpeakDemandKw}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Demanda Mínima na Ponta (kW)</TableCell>
                <TableCell>{formValues.minPeakDemandKw}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Demanda Mínima Fora Ponta (kW)</TableCell>
                <TableCell>{formValues.minOffpeakDemandKw}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Consumo Mensal na Ponta (kWh)</TableCell>
                <TableCell>{formValues.avgMonthlyPeakConsumptionKwh}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Consumo Mensal Fora Ponta (kWh)</TableCell>
                <TableCell>{formValues.avgMonthlyOffpeakConsumptionKwh}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Grupo Tarifário</TableCell>
                <TableCell>
                  {formValues.tarifaryGroup === 'groupA' ? 
                    `Grupo A (${formValues.modalityA === 'blue' ? 'Azul' : 'Verde'})` : 
                    'Grupo B'}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Horizonte de Análise (anos)</TableCell>
                <TableCell>{formValues.horizonYears}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          
          <h4 className="font-medium mt-4 mb-2">Estratégias de Controle</h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-2 ${formValues.usePeakShaving ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              <span>Peak Shaving</span>
            </div>
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-2 ${formValues.useArbitrage ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              <span>Arbitragem</span>
            </div>
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-2 ${formValues.useBackup ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              <span>Backup</span>
            </div>
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-2 ${formValues.usePvOptim ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              <span>Integração PV</span>
            </div>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
