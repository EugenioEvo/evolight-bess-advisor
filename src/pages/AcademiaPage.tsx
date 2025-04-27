
import React, { useState } from 'react';
import Header from '@/components/Header';
import { BookOpen, Video, FileText, CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const AcademiaPage: React.FC = () => {
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  
  const modules = [
    {
      id: 'bess-intro',
      title: 'Introdução aos Sistemas BESS',
      description: 'Fundamentos de armazenamento de energia por baterias',
      lessons: 4,
      duration: '45 min',
      progress: 0,
      image: '/lovable-uploads/b7404c96-b1f9-49ee-a3f5-aa2a0696d688.png', // Placeholder - needs to be replaced
      badge: 'Básico'
    },
    {
      id: 'peak-shaving',
      title: 'Peak Shaving com BESS',
      description: 'Técnicas de redução de picos de demanda',
      lessons: 3,
      duration: '30 min',
      progress: 0,
      image: '/lovable-uploads/b7404c96-b1f9-49ee-a3f5-aa2a0696d688.png', // Placeholder - needs to be replaced
      badge: 'Intermediário'
    },
    {
      id: 'pv-integration',
      title: 'Integração Solar + BESS',
      description: 'Otimização de sistemas solares com armazenamento',
      lessons: 5,
      duration: '60 min',
      progress: 0,
      image: '/lovable-uploads/b7404c96-b1f9-49ee-a3f5-aa2a0696d688.png', // Placeholder - needs to be replaced
      badge: 'Avançado'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 container py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-evolight-navy mb-2">Academia da Sustentabilidade</h1>
          <p className="text-gray-600">Aprenda sobre sistemas de armazenamento de energia, energia solar e sustentabilidade.</p>
        </div>
        
        {!selectedModule ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map(module => (
              <Card key={module.id} className="overflow-hidden hover:border-evolight-navy transition-all duration-300">
                <div className="h-40 bg-gray-200 relative">
                  {module.image && <img src={module.image} alt={module.title} className="w-full h-full object-cover" />}
                  <Badge className="absolute top-3 right-3 bg-evolight-navy">{module.badge}</Badge>
                </div>
                <CardHeader>
                  <CardTitle>{module.title}</CardTitle>
                  <CardDescription>{module.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <BookOpen className="h-4 w-4 mr-1" />
                      <span>{module.lessons} lições</span>
                    </div>
                    <div className="flex items-center">
                      <span>{module.duration}</span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Progresso</span>
                      <span>{module.progress}%</span>
                    </div>
                    <Progress value={module.progress} className="h-2" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full bg-evolight-navy hover:bg-evolight-navy/90"
                    onClick={() => setSelectedModule(module.id)}
                  >
                    {module.progress > 0 ? 'Continuar' : 'Começar'}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div>
            <Button 
              variant="ghost" 
              className="mb-6"
              onClick={() => setSelectedModule(null)}
            >
              ← Voltar para módulos
            </Button>
            
            <Card className="mb-8">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <Badge className="mb-2 bg-evolight-navy">
                      {modules.find(m => m.id === selectedModule)?.badge}
                    </Badge>
                    <CardTitle className="text-2xl">
                      {modules.find(m => m.id === selectedModule)?.title}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {modules.find(m => m.id === selectedModule)?.description}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {modules.find(m => m.id === selectedModule)?.lessons} lições
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Duração: {modules.find(m => m.id === selectedModule)?.duration}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg flex items-center">
                    <div className="h-10 w-10 rounded-full bg-evolight-navy flex items-center justify-center text-white mr-4">
                      <Video className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-medium">Lição 1: Visão Geral</h3>
                      <p className="text-sm text-gray-600">Introdução aos conceitos básicos</p>
                    </div>
                    <Button className="bg-evolight-navy">
                      Iniciar <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="p-4 border rounded-lg flex items-center opacity-70">
                    <div className="h-10 w-10 rounded-full bg-gray-400 flex items-center justify-center text-white mr-4">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-medium">Lição 2: Componentes Principais</h3>
                      <p className="text-sm text-gray-600">Detalhes sobre tecnologias de baterias</p>
                    </div>
                    <Button disabled variant="outline">
                      Bloqueado
                    </Button>
                  </div>
                  
                  {/* Additional lessons would go here */}
                  
                  <div className="p-4 border rounded-lg flex items-center opacity-70">
                    <div className="h-10 w-10 rounded-full bg-gray-400 flex items-center justify-center text-white mr-4">
                      <CheckCircle className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-medium">Quiz Final</h3>
                      <p className="text-sm text-gray-600">Teste seus conhecimentos</p>
                    </div>
                    <Button disabled variant="outline">
                      Bloqueado
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
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
