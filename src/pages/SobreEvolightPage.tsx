
import React from 'react';
import Header from '@/components/Header';
import EvolightLogo from '@/components/EvolightLogo';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const SobreEvolightPage: React.FC = () => {
  const caseStudies = [
    {
      title: "Sistema BESS 500kWh - Indústria Têxtil",
      location: "São Paulo, SP",
      description: "Implementação de sistema de armazenamento para redução de custos de demanda em indústria têxtil de grande porte, com retorno de investimento em 3.2 anos.",
      results: "Redução de 35% nos custos de energia, economia anual de R$ 210.000, redução de 120 toneladas de CO2/ano."
    },
    {
      title: "Sistema Híbrido Solar+BESS - Centro de Distribuição",
      location: "Recife, PE",
      description: "Solução combinada de 750kWp de energia solar com 350kWh de armazenamento para CD do setor de alimentos, garantindo resiliência energética.",
      results: "Autonomia energética de 4 horas para cargas críticas, economia anual de R$ 320.000, payback em 4.5 anos."
    },
    {
      title: "Peak Shaving BESS - Shopping Center",
      location: "Belo Horizonte, MG",
      description: "Implementação de sistema BESS 280kWh para gestão de demanda em shopping center, eliminando multas por ultrapassagem.",
      results: "Redução de 20% na demanda contratada, ROI de 22%, economia de R$ 180.000/ano em custos de energia."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 container py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-evolight-navy mb-2">Sobre a Evolight</h1>
          <p className="text-gray-600">Conheça nossa empresa, missão e casos de sucesso em energia sustentável.</p>
        </div>
        
        <Tabs defaultValue="empresa" className="space-y-8">
          <TabsList className="w-full md:w-auto">
            <TabsTrigger value="empresa">A Empresa</TabsTrigger>
            <TabsTrigger value="missao">Missão & Valores</TabsTrigger>
            <TabsTrigger value="cases">Casos de Sucesso</TabsTrigger>
          </TabsList>
          
          <TabsContent value="empresa" className="space-y-8">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="md:w-1/3">
                <EvolightLogo width={300} height={150} className="mx-auto" />
              </div>
              <div className="md:w-2/3">
                <h2 className="text-2xl font-semibold text-evolight-navy mb-4">Energia Inovadora e Sustentável</h2>
                <p className="text-gray-700 mb-4">
                  A Evolight foi fundada em 2015 com a missão de transformar o setor energético brasileiro, 
                  promovendo soluções inovadoras de armazenamento de energia e geração solar que combinam 
                  sustentabilidade e viabilidade econômica.
                </p>
                <p className="text-gray-700 mb-4">
                  Nossa equipe reúne especialistas em engenharia elétrica, armazenamento de energia, 
                  sistemas solares e análise financeira, oferecendo soluções completas e personalizadas
                  para clientes industriais e comerciais em todo o Brasil.
                </p>
                <p className="text-gray-700">
                  Com um histórico comprovado de projetos bem-sucedidos e parcerias estratégicas com 
                  fabricantes líderes de tecnologia, a Evolight está na vanguarda da transformação 
                  energética sustentável do país.
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-3 text-evolight-navy">Nossa História</h3>
                  <p className="text-gray-700">
                    Fundada em 2015 por engenheiros especialistas em energia, a Evolight começou com projetos 
                    solares e expandiu para soluções completas de armazenamento e gestão energética.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-3 text-evolight-navy">Expertise</h3>
                  <p className="text-gray-700">
                    Especialistas em sistemas BESS, energia solar, análise tarifária, integração com geração diesel,
                    microrredes e soluções de resiliência energética para diversos segmentos.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-3 text-evolight-navy">Diferenciais</h3>
                  <p className="text-gray-700">
                    Soluções personalizadas, análise financeira detalhada, tecnologia de ponta, serviço completo do 
                    projeto à instalação e monitoramento, suporte técnico especializado.
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="missao">
            <div className="space-y-10">
              <div className="bg-evolight-navy text-white p-8 rounded-lg">
                <h2 className="text-2xl font-semibold mb-3">Nossa Missão</h2>
                <p className="text-lg">
                  Acelerar a transição energética através de soluções inovadoras de armazenamento e geração, 
                  transformando como empresas produzem, consomem e gerenciam energia de forma sustentável, 
                  confiável e economicamente viável.
                </p>
              </div>
              
              <div className="bg-evolight-gold text-white p-8 rounded-lg">
                <h2 className="text-2xl font-semibold mb-3">Nossa Visão</h2>
                <p className="text-lg">
                  Ser reconhecida como líder nacional em soluções de armazenamento de energia, 
                  contribuindo para um futuro energético descentralizado, renovável e acessível para todos.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-xl font-semibold mb-3 text-evolight-navy">Sustentabilidade</h3>
                    <p className="text-gray-700">
                      Comprometimento com soluções que reduzem emissões de carbono e promovem o uso eficiente e 
                      responsável dos recursos energéticos.
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-xl font-semibold mb-3 text-evolight-navy">Inovação</h3>
                    <p className="text-gray-700">
                      Busca contínua por tecnologias e métodos avançados que transformem o setor energético, 
                      antecipando tendências e criando soluções pioneiras.
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-xl font-semibold mb-3 text-evolight-navy">Excelência Técnica</h3>
                    <p className="text-gray-700">
                      Rigor técnico e qualidade em cada projeto, garantindo desempenho superior e resultados 
                      mensuráveis para nossos clientes.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="cases">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {caseStudies.map((study, index) => (
                <Card key={index} className="overflow-hidden">
                  <div className="h-32 bg-gradient-to-r from-evolight-navy to-blue-400 flex items-center justify-center">
                    <h3 className="text-xl font-semibold text-white px-4 text-center">{study.title}</h3>
                  </div>
                  <CardContent className="pt-4">
                    <p className="text-sm font-medium text-evolight-navy mb-2">{study.location}</p>
                    <p className="text-gray-700 mb-4">{study.description}</p>
                    <div>
                      <p className="text-sm font-semibold mb-1">Resultados:</p>
                      <p className="text-gray-700">{study.results}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="text-center mt-8">
              <p className="text-gray-500">Estes são apenas alguns exemplos dos nossos projetos bem-sucedidos.</p>
              <p className="text-gray-500">Entre em contato para saber como podemos ajudar a sua empresa.</p>
            </div>
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

export default SobreEvolightPage;
