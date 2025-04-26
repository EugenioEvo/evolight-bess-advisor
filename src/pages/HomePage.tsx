
import React from 'react';
import Header from '@/components/Header';
import FeatureCard from '@/components/FeatureCard';
import { LineChart, FileText, BookOpen, BarChart3 } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 container py-6 px-4 md:py-10">
        <section className="mb-10">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-evolight-navy mb-2">Bem-vindo ao BESS Analysis Suite</h1>
            <p className="text-gray-600">Sua plataforma completa para análise e dimensionamento de sistemas de armazenamento de energia por bateria.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              title="Iniciar Nova Simulação"
              description="Configure e execute uma nova simulação de sistema BESS personalizada."
              icon={<LineChart className="h-10 w-10" />}
              to="/simulador"
              buttonText="Iniciar"
            />
            
            <FeatureCard
              title="Documentação Técnica"
              description="Acesse datasheets e documentos técnicos sobre sistemas BESS."
              icon={<FileText className="h-10 w-10" />}
              to="/documentacao"
              buttonText="Acessar"
            />
            
            <FeatureCard
              title="Academia da Sustentabilidade"
              description="Aprenda sobre sistemas BESS e energia sustentável."
              icon={<BookOpen className="h-10 w-10" />}
              to="/academia"
              buttonText="Aprender"
            />
            
            <FeatureCard
              title="Meus Projetos"
              description="Acesse suas simulações e projetos salvos."
              icon={<BarChart3 className="h-10 w-10" />}
              to="/projetos"
              buttonText="Ver projetos"
            />
          </div>
        </section>
        
        <section className="bg-gradient-to-r from-evolight-navy to-blue-900 text-white rounded-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h2 className="text-2xl font-bold mb-2">Otimize seu consumo energético</h2>
              <p className="max-w-md">
                Descubra como os sistemas BESS podem reduzir suas despesas com energia e contribuir para a sustentabilidade.
              </p>
            </div>
            <button className="bg-evolight-gold text-evolight-navy font-medium py-2 px-4 rounded hover:bg-yellow-400 transition-colors">
              Saiba mais
            </button>
          </div>
        </section>
        
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-3 text-evolight-navy">Últimas Atualizações</h3>
            <ul className="space-y-3">
              <li className="pb-2 border-b border-gray-100">
                <span className="text-sm text-gray-500">10/04/2025</span>
                <p className="text-gray-800">Novas funcionalidades de análise de sensibilidade</p>
              </li>
              <li className="pb-2 border-b border-gray-100">
                <span className="text-sm text-gray-500">02/04/2025</span>
                <p className="text-gray-800">Atualização dos modelos financeiros</p>
              </li>
              <li>
                <span className="text-sm text-gray-500">28/03/2025</span>
                <p className="text-gray-800">Novos datasheets de baterias LFP adicionados</p>
              </li>
            </ul>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-3 text-evolight-navy">Dicas Rápidas</h3>
            <ul className="space-y-3">
              <li className="flex items-start pb-2 border-b border-gray-100">
                <div className="text-evolight-gold mr-3 mt-1">•</div>
                <p className="text-gray-800">Utilize dados de carga reais para resultados mais precisos</p>
              </li>
              <li className="flex items-start pb-2 border-b border-gray-100">
                <div className="text-evolight-gold mr-3 mt-1">•</div>
                <p className="text-gray-800">Considere diferentes cenários tarifários para comparação</p>
              </li>
              <li className="flex items-start">
                <div className="text-evolight-gold mr-3 mt-1">•</div>
                <p className="text-gray-800">Analise os relatórios detalhados para insights financeiros completos</p>
              </li>
            </ul>
          </div>
        </section>
      </main>
      
      <footer className="bg-white py-4 border-t border-gray-200">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Evolight Energia Inovadora. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
