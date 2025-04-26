
import React from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const SimuladorPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 container py-6 px-4 md:py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-evolight-navy mb-2">Simulador BESS</h1>
          <p className="text-gray-600">Configure e execute simulações de sistemas de armazenamento de energia por bateria.</p>
        </div>
        
        <Tabs defaultValue="dados" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="dados">Entrada de Dados</TabsTrigger>
            <TabsTrigger value="analise">Análise & Dimensionamento</TabsTrigger>
            <TabsTrigger value="resultados">Resultados & Relatórios</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dados">
            <Card>
              <CardHeader>
                <CardTitle>Entrada de Dados</CardTitle>
                <CardDescription>
                  Forneça os dados necessários para simular seu sistema BESS.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-center text-gray-500 py-12">
                  Funcionalidade em desenvolvimento. Esta seção conterá campos para inserir dados do projeto, perfil de carga, 
                  sistema solar fotovoltaico, estrutura tarifária, aplicações BESS desejadas e outros parâmetros técnicos e financeiros.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="analise">
            <Card>
              <CardHeader>
                <CardTitle>Análise & Dimensionamento</CardTitle>
                <CardDescription>
                  Processamento e análise técnico-financeira baseada nos dados fornecidos.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-center text-gray-500 py-12">
                  Funcionalidade em desenvolvimento. Esta seção exibirá o progresso do processamento dos dados, 
                  dimensionamento do sistema e simulação temporal da operação.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="resultados">
            <Card>
              <CardHeader>
                <CardTitle>Resultados & Relatórios</CardTitle>
                <CardDescription>
                  Visualize os resultados da simulação e gere relatórios.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-center text-gray-500 py-12">
                  Funcionalidade em desenvolvimento. Esta seção exibirá um dashboard resumo, 
                  gráficos interativos e permitirá a exportação do relatório detalhado.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      
      <footer className="bg-white py-4 border-t border-gray-200">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Evolight Energia Inovadora. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
};

export default SimuladorPage;
