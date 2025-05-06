
import React from 'react';
import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { SimuladorFormValues } from "@/schemas/simuladorSchema";

interface TechnicalSectionProps {
  results: {
    calculatedPowerKw: number;
    calculatedEnergyKwh: number;
  };
  formValues: SimuladorFormValues;
}

export function TechnicalSection({ results, formValues }: TechnicalSectionProps) {
  // Calculate efficiency metrics
  const roundTripEfficiency = formValues.bessEfficiency;
  const epRatio = results.calculatedEnergyKwh / results.calculatedPowerKw;
  const estimatedCyclesPerYear = formValues.usePeakShaving ? 
    (formValues.useArbitrage ? 365 : 300) : 
    (formValues.useArbitrage ? 180 : 130);
  const estimatedDegradation = formValues.bessAnnualDegradation * formValues.bessLifetime;

  return (
    <AccordionItem value="technical">
      <AccordionTrigger className="font-medium">Detalhes Técnicos</AccordionTrigger>
      <AccordionContent>
        <div className="py-2">
          <h4 className="font-medium mb-2">Especificações do BESS</h4>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Parâmetro</TableHead>
                <TableHead>Valor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Potência (kW)</TableCell>
                <TableCell>{results.calculatedPowerKw.toFixed(1)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Capacidade (kWh)</TableCell>
                <TableCell>{results.calculatedEnergyKwh.toFixed(1)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Razão E/P</TableCell>
                <TableCell>{epRatio.toFixed(2)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Eficiência Round-Trip</TableCell>
                <TableCell>{roundTripEfficiency}%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Profundidade de Descarga Máxima</TableCell>
                <TableCell>{formValues.bessMaxDod}%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Tecnologia</TableCell>
                <TableCell>{formValues.bessTechnology === 'lfp' ? 'LFP (Lítio Ferro Fosfato)' : 'NMC'}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Degradação Anual</TableCell>
                <TableCell>{formValues.bessAnnualDegradation}%</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          
          {/* Ciclos de vida e detalhes de operação estimados */}
          <div className="mt-4">
            <h4 className="font-medium mb-2">Operação Estimada</h4>
            <p>Ciclos diários estimados: {formValues.usePeakShaving && formValues.useArbitrage ? '1-2' : formValues.usePeakShaving ? '1' : '0.5'}</p>
            <p>Ciclos anuais estimados: ~{estimatedCyclesPerYear}</p>
            <p>Vida útil estimada: ~{formValues.bessLifetime} anos</p>
            <p>Degradação ao final da vida útil: ~{estimatedDegradation.toFixed(1)}%</p>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
