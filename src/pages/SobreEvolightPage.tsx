
import React from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import EvolightLogo from '@/components/EvolightLogo';

const SobreEvolightPage: React.FC = () => {
  const cases = [
    {
      title: 'Sistema BESS Industrial',
      client: 'Indústria Metalúrgica',
      description: 'Implementação de sistema BESS de 500kWh para peak shaving, gerando economia de 25% nos custos de demanda.',
      sector: 'Industrial',
    },
    {
      title: 'BESS + Solar Fotovoltaico',
      client: 'Centro Comercial',
      description: 'Sistema integrado de 200kWh BESS com 150kWp de painéis solares, maximizando autoconsumo solar.',
      sector: 'Comercial',
    },
    {
      title: 'Backup Energético',
      client: 'Data Center',
      description: 'Solução BESS de 700kWh para backup energético crítico, garantindo operação contínua durante interrupções.',
      sector: 'Tecnologia',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 container py-6 px-4 md:py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-evolight-navy mb-2">Sobre a Evolight</h1>
          <p className="text-gray-600">Conheça nossa missão, visão, valores e histórico de sucesso em soluções energéticas inovadoras.</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4 text-evolight-navy">Missão</h2>
            <p className="text-gray-600">
              Transformar o mercado energético brasileiro através de soluções inovadoras e sustentáveis, 
              promovendo a eficiência energética e reduzindo o impacto ambiental das operações de nossos clientes.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4 text-evolight-navy">Visão</h2>
            <p className="text-gray-600">
              Ser líder nacional em soluções energéticas integradas, reconhecida pela excelência técnica, 
              compromisso com a sustentabilidade e capacidade de agregar valor real aos negócios de nossos parceiros.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4 text-evolight-navy">Valores</h2>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start">
                <div className="text-evolight-gold mr-2">•</div>
                <p>Inovação e Excelência Técnica</p>
              </li>
              <li className="flex items-start">
                <div className="text-evolight-gold mr-2">•</div>
                <p>Compromisso com a Sustentabilidade</p>
              </li>
              <li className="flex items-start">
                <div className="text-evolight-gold mr-2">•</div>
                <p>Transparência e Ética</p>
              </li>
              <li className="flex items-start">
                <div className="text-evolight-gold mr-2">•</div>
                <p>Foco em Resultados Mensuráveis</p>
              </li>
              <li className="flex items-start">
                <div className="text-evolight-gold mr-2">•</div>
                <p>Parcerias de Longo Prazo</p>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-evolight-navy">Cases de Sucesso</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {cases.map((item, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="mb-1">
                    <span className="inline-block text-xs font-medium text-evolight-gold bg-evolight-lightgold px-2 py-1 rounded">
                      {item.sector}
                    </span>
                  </div>
                  <CardTitle>{item.title}</CardTitle>
                  <p className="text-sm text-gray-500">{item.client}</p>
                </CardHeader>
                <CardContent>
                  <CardDescription>{item.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-8 shadow-sm mb-10">
          <div className="flex flex-col items-center text-center">
            <EvolightLogo width={200} height={80} />
            <h2 className="text-2xl font-semibold mt-6 mb-4 text-evolight-navy">Evolight Energia Inovadora</h2>
            <p className="max-w-2xl text-gray-600 mb-6">
              Fundada em 2018, a Evolight nasceu com o propósito de revolucionar o mercado energético brasileiro 
              através de soluções inovadoras e sustentáveis. Com uma equipe de especialistas altamente qualificados, 
              oferecemos consultoria, projetos personalizados e soluções integradas que combinam tecnologia de ponta 
              e eficiência energética.
            </p>
            <div className="flex space-x-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-evolight-gold">50+</p>
                <p className="text-sm text-gray-600">Projetos Concluídos</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-evolight-gold">30%</p>
                <p className="text-sm text-gray-600">Economia Média</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-evolight-gold">15+</p>
                <p className="text-sm text-gray-600">Especialistas</p>
              </div>
            </div>
          </div>
        </div>
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
