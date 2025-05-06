
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
  // BESS module specifications
  const MODULE_POWER_KW = 108; // kW
  const MODULE_ENERGY_KWH = 215; // kWh
  
  // Calculate required number of modules
  const modulesByPower = Math.ceil(results.calculatedPowerKw / MODULE_POWER_KW);
  const modulesByEnergy = Math.ceil(results.calculatedEnergyKwh / MODULE_ENERGY_KWH);
  const bessUnitsRequired = Math.max(modulesByPower, modulesByEnergy, 1); // At least 1 unit
  
  // Calculate actual power and energy from the number of modules
  const actualPowerKw = bessUnitsRequired * MODULE_POWER_KW;
  const actualEnergyKwh = bessUnitsRequired * MODULE_ENERGY_KWH;

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
              <TableCell>Unidades BESS</TableCell>
              <TableCell className="font-semibold">{bessUnitsRequired} un</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Potência Real (kW)</TableCell>
              <TableCell className="font-semibold">{actualPowerKw.toFixed(0)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Capacidade Real (kWh)</TableCell>
              <TableCell className="font-semibold">{actualEnergyKwh.toFixed(0)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Potência Calculada (kW)</TableCell>
              <TableCell>{results.calculatedPowerKw.toFixed(1)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Capacidade Calculada (kWh)</TableCell>
              <TableCell>{results.calculatedEnergyKwh.toFixed(1)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Razão E/P</TableCell>
              <TableCell>
                {(actualEnergyKwh / actualPowerKw).toFixed(2)}
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
