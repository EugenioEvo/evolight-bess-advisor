
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { SimuladorFormValues } from '@/schemas/simuladorSchema';
import { HeaderSection } from '@/components/simulador/HeaderSection';
import { FooterSection } from '@/components/simulador/FooterSection';
import { SimuladorTabContent } from '@/components/simulador/tabs/SimuladorTabContent';
import { useSimulation } from '@/components/simulador/hooks/useSimulation';
import { useSimuladorForm } from '@/hooks/useSimuladorForm';

export function SimuladorPageContainer() {
  const [activeTab, setActiveTab] = useState("dados");
  const { simulationResults, runSimulation, isSimulating, simulationError } = useSimulation();
  const { form, validateRequiredFields } = useSimuladorForm();
  
  // Efeito para mostrar erro de simulação se existir
  useEffect(() => {
    if (simulationError) {
      toast.error("Erro na simulação", {
        description: simulationError
      });
    }
  }, [simulationError]);
  
  const onSubmit = async (values: SimuladorFormValues) => {
    console.log("Form submitted with values:", values);
    
    // Verificar se os campos necessários estão preenchidos
    if (!validateRequiredFields(values)) {
      return;
    }
    
    try {
      const result = await runSimulation(values);
      if (result.success && result.results) {
        // Only access results properties if they exist
        form.setValue('bessPowerKw', result.results.calculatedPowerKw);
        form.setValue('bessCapacityKwh', result.results.calculatedEnergyKwh);
        setActiveTab("analise");
      } else {
        toast.error("Erro na simulação", {
          description: "Verifique os dados de entrada e tente novamente"
        });
      }
    } catch (error) {
      console.error("Error during simulation submission:", error);
      toast.error("Erro ao processar simulação", {
        description: error instanceof Error ? error.message : "Erro desconhecido"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1 container py-6 px-4 md:py-10">
        <HeaderSection />
        
        <SimuladorTabContent
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          form={form}
          onSubmit={onSubmit}
          simulationResults={simulationResults}
          isSimulating={isSimulating}
        />
      </main>
      
      <FooterSection />
    </div>
  );
}
