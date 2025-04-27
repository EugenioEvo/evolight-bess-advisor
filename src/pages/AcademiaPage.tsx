
import React from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Play, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AcademiaPage: React.FC = () => {
  const modules = [
    {
      title: 'Introdução aos Sistemas BESS',
      description: 'Aprenda os fundamentos dos sistemas de armazenamento de energia por bateria.',
      progress: 100,
      duration: '45 min',
      completed: true,
    },
    {
      title: 'Aplicações do BESS',
      description: 'Conheça as diferentes aplicações do BESS: backup, peak shaving e arbitragem.',
      progress: 60,
      duration: '55 min',
      completed: false,
    },
    {
      title: 'Dimensionamento de Sistemas BESS',
      description: 'Aprenda a dimensionar corretamente sistemas BESS para diferentes aplicações.',
      progress: 0,
      duration: '1h 20min',
      completed: false,
    },
    {
      title: 'Aspectos Financeiros do BESS',
      description: 'Entenda os modelos financeiros e o cálculo de ROI para sistemas BESS.',
      progress: 0,
      duration: '1h',
      completed: false,
    },
    {
      title: 'Integração com Sistemas Fotovoltaicos',
      description: 'Saiba como integrar sistemas BESS com geração solar fotovoltaica.',
      progress: 0,
      duration: '50 min',
      completed: false,
    },
    {
      title: 'Regulação e Normas Técnicas',
      description: 'Conheça as principais regulações e normas técnicas aplicáveis aos sistemas BESS no Brasil.',
      progress: 0,
      duration: '40 min',
      completed: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 container py-6 px-4 md:py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-evolight-navy mb-2">Academia da Sustentabilidade</h1>
          <p className="text-gray-600">Aprenda sobre sistemas BESS, energia sustentável e soluções inovadoras para o mercado energético.</p>
        </div>
        
        <div className="mb-8 bg-white rounded-lg p-6 shadow-sm">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="bg-evolight-lightgold rounded-full p-4">
              <Award className="h-12 w-12 text-evolight-gold" />
            </div>
            
            <div className="flex-1">
              <h2 className="text-xl font-semibold mb-2 text-evolight-navy">Seu Progresso</h2>
              <div className="mb-4">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">1 de 6 módulos concluídos</span>
                  <span className="text-sm font-medium text-gray-700">17%</span>
                </div>
                <Progress value={17} className="h-2" />
              </div>
              <p className="text-gray-600 mb-4">
                Continue sua jornada de aprendizado para ganhar distintivos e se tornar um especialista em sistemas BESS.
              </p>
              <div className="flex space-x-2">
                <div className="flex items-center justify-center w-8 h-8 bg-evolight-gold rounded-full text-white text-xs font-medium">
                  1
                </div>
                <div className="flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full text-gray-500 text-xs font-medium">
                  2
                </div>
                <div className="flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full text-gray-500 text-xs font-medium">
                  3
                </div>
                <div className="flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full text-gray-500 text-xs font-medium">
                  4
                </div>
                <div className="flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full text-gray-500 text-xs font-medium">
                  5
                </div>
                <div className="flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full text-gray-500 text-xs font-medium">
                  6
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module, index) => (
            <Card key={index} className={`hover:shadow-md transition-shadow ${module.completed ? 'border-l-4 border-l-green-500' : ''}`}>
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <span className="inline-block text-xs font-medium bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    Módulo {index + 1}
                  </span>
                  <span className="text-xs text-gray-500">{module.duration}</span>
                </div>
                <CardTitle className="mt-2 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-evolight-gold" />
                  {module.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{module.description}</CardDescription>
                {module.progress > 0 && (
                  <div className="mt-4">
                    <div className="flex justify-between mb-1">
                      <span className="text-xs font-medium text-gray-700">Progresso</span>
                      <span className="text-xs font-medium text-gray-700">{module.progress}%</span>
                    </div>
                    <Progress value={module.progress} className="h-1" />
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-evolight-navy hover:bg-evolight-navy/90">
                  <Play className="mr-2 h-4 w-4" />
                  {module.progress > 0 && !module.completed ? 'Continuar' : module.completed ? 'Revisitar' : 'Iniciar'}
                </Button>
              </CardFooter>
            </Card>
          ))}
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

export default AcademiaPage;
