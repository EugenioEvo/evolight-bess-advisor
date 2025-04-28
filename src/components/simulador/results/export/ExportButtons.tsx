
import React from 'react';
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { SimuladorFormValues } from "@/schemas/simuladorSchema";

interface ExportButtonsProps {
  results: {
    calculatedPowerKw: number;
    calculatedEnergyKwh: number;
    paybackYears?: number;
    annualSavings?: number;
  };
  formValues: SimuladorFormValues;
}

export function ExportButtons({ results, formValues }: ExportButtonsProps) {
  const handleExportReport = () => {
    toast.info("Gerando relatório...", {
      description: "O relatório PDF está sendo preparado."
    });
    
    // In a real implementation, this would generate and download a PDF
    setTimeout(() => {
      toast.success("Relatório gerado com sucesso", {
        description: "O relatório em PDF foi baixado para o seu computador."
      });
    }, 2000);
  };
  
  const handleExportData = () => {
    // Create a simple CSV with data
    const costPerKwh = formValues.bessInstallationCost || 1500;
    const totalInvestment = results.calculatedEnergyKwh * costPerKwh;
    
    // Header row
    let csvContent = "Parâmetro,Valor\n";
    
    // Add technical data
    csvContent += `Potência,${results.calculatedPowerKw.toFixed(1)} kW\n`;
    csvContent += `Capacidade,${results.calculatedEnergyKwh.toFixed(1)} kWh\n`;
    csvContent += `Razão E/P,${(results.calculatedEnergyKwh / results.calculatedPowerKw).toFixed(2)}\n`;
    
    // Add financial data
    csvContent += `Investimento Total,${totalInvestment.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}\n`;
    csvContent += `Economia Anual,${(results.annualSavings || 0).toLocaleString('pt-BR', { maximumFractionDigits: 2 })}\n`;
    csvContent += `Payback,${(results.paybackYears || 0).toFixed(1)} anos\n`;
    
    // Create a data URI for the CSV content
    const encodedUri = encodeURI('data:text/csv;charset=utf-8,' + csvContent);
    
    // Create a link element, set the href to the data URI, and trigger a click
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `simulacao_bess_${formValues.projectName || 'projeto'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Dados exportados com sucesso", {
      description: "Os dados da simulação foram baixados em formato CSV."
    });
  };
  
  return (
    <div className="flex flex-wrap gap-3">
      <Button onClick={handleExportReport}>
        <Download className="mr-2 h-4 w-4" />
        Exportar Relatório PDF
      </Button>
      
      <Button variant="outline" onClick={handleExportData}>
        <Download className="mr-2 h-4 w-4" />
        Exportar Dados CSV
      </Button>
    </div>
  );
}
