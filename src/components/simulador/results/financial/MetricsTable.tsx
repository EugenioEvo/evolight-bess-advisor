
import React from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

interface MetricsTableProps {
  metrics: {
    label: string;
    value: string;
    highlight?: boolean;
  }[];
}

export function MetricsTable({ metrics }: MetricsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Métrica</TableHead>
          <TableHead>Valor</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {metrics.map((metric) => (
          <TableRow key={metric.label}>
            <TableCell className="font-medium">{metric.label}</TableCell>
            <TableCell className={metric.highlight ? "text-primary font-semibold" : ""}>
              {metric.value}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
