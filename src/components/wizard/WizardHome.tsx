
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SavedSimulationsList } from './ui/SavedSimulationsList';
import { PlusCircle, Zap, Battery } from 'lucide-react';
import { WizardProvider } from './context/WizardContext';
import { useNavigate } from 'react-router-dom';

export function WizardHome() {
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold">BESS Advisor</h1>
        <p className="text-muted-foreground">
          Dimensione e simule um sistema de armazenamento de energia otimizado para suas necessidades
        </p>
      </div>
      
      <div className="mt-8">
        <Tabs defaultValue="start" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="start">Iniciar</TabsTrigger>
            <TabsTrigger value="saved">Simulações Salvas</TabsTrigger>
          </TabsList>
          
          <TabsContent value="start" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="col-span-1 md:col-span-2">
                <CardHeader>
                  <CardTitle>Nova Simulação</CardTitle>
                  <CardDescription>
                    Configure um novo sistema BESS seguindo o passo a passo
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Nosso assistente irá guiá-lo através de 5 etapas para configurar e dimensionar
                      um sistema de armazenamento de energia:
                    </p>
                    
                    <ol className="space-y-3 mt-4 list-decimal pl-5">
                      <li className="text-sm">
                        <span className="font-medium">Contexto do Local</span> - Tipo de instalação e estrutura atual
                      </li>
                      <li className="text-sm">
                        <span className="font-medium">Estratégia Energética</span> - Objetivos e prioridades
                      </li>
                      <li className="text-sm">
                        <span className="font-medium">Restrições Técnicas</span> - Limitações físicas e elétricas
                      </li>
                      <li className="text-sm">
                        <span className="font-medium">Tarifas de Energia</span> - Estrutura tarifária e custos
                      </li>
                      <li className="text-sm">
                        <span className="font-medium">Perfil de Consumo</span> - Padrão de demanda ao longo do dia
                      </li>
                    </ol>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={() => navigate('/wizard/new')} 
                    className="w-full md:w-auto flex items-center gap-2"
                  >
                    <PlusCircle className="h-4 w-4" />
                    Criar Nova Simulação
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Guia Rápido</CardTitle>
                  <CardDescription>
                    Casos de uso mais comuns
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    onClick={() => navigate('/wizard/template/peak-shaving')}
                    variant="outline" 
                    className="w-full justify-start gap-3"
                  >
                    <Zap className="h-5 w-5 text-yellow-500" />
                    <div className="text-left">
                      <div className="font-medium">Peak Shaving</div>
                      <div className="text-xs text-muted-foreground">Redução de demanda na ponta</div>
                    </div>
                  </Button>
                  
                  <Button 
                    onClick={() => navigate('/wizard/template/pv-optim')}
                    variant="outline" 
                    className="w-full justify-start gap-3"
                  >
                    <Battery className="h-5 w-5 text-green-500" />
                    <div className="text-left">
                      <div className="font-medium">Otimização FV</div>
                      <div className="text-xs text-muted-foreground">Armazenar excedente solar</div>
                    </div>
                  </Button>
                  
                  <Button 
                    onClick={() => navigate('/wizard/template/backup')}
                    variant="outline" 
                    className="w-full justify-start gap-3"
                  >
                    <Zap className="h-5 w-5 text-blue-500" />
                    <div className="text-left">
                      <div className="font-medium">Backup Crítico</div>
                      <div className="text-xs text-muted-foreground">Proteção contra quedas de energia</div>
                    </div>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="saved" className="mt-6">
            <WizardProvider>
              <SavedSimulationsList />
            </WizardProvider>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
