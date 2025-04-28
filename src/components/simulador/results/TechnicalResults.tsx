
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { SimuladorFormValues } from "@/schemas/simuladorSchema";

interface TechnicalResultsProps {
  results: {
    calculatedPowerKw: number;
    calculatedEnergyKwh: number;
  };
  formValues: SimuladorFormValues;
}

export function TechnicalResults({ results, formValues }: TechnicalResultsProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-lg font-semibold mb-4">Dimensionamento Técnico</h3>
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
              <TableCell className="font-semibold">{results.calculatedPowerKw.toFixed(1)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Capacidade (kWh)</TableCell>
              <TableCell className="font-semibold">{results.calculatedEnergyKwh.toFixed(1)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Razão E/P</TableCell>
              <TableCell>
                {(results.calculatedEnergyKwh / results.calculatedPowerKw).toFixed(2)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Tecnologia</TableCell>
              <TableCell>
                {formValues.bessTechnology === 'lfp' ? 'LFP (Ferro-Fosfato)' : 'NMC'}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
