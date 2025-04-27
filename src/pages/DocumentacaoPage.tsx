
import React from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

const DocumentacaoPage: React.FC = () => {
  const documents = [
    {
      title: 'Especificações Técnicas Baterias LFP',
      category: 'Datasheet',
      description: 'Especificações técnicas detalhadas das baterias de fosfato de ferro-lítio (LFP).',
      date: '15/03/2025',
    },
    {
      title: 'Manual de Integração BESS',
      category: 'Manual',
      description: 'Guia completo para integração de sistemas BESS com instalações existentes.',
      date: '10/02/2025',
    },
    {
      title: 'Inversores para Sistemas BESS',
      category: 'Datasheet',
      description: 'Especificações técnicas dos inversores compatíveis com sistemas BESS.',
      date: '25/01/2025',
    },
    {
      title: 'Guia de Manutenção BESS',
      category: 'Guia',
      description: 'Procedimentos e cronograma recomendados para manutenção de sistemas BESS.',
      date: '05/01/2025',
    },
    {
      title: 'Regulação ANP para Sistemas BESS',
      category: 'Regulatório',
      description: 'Compilação das principais regulamentações aplicáveis a sistemas BESS no Brasil.',
      date: '12/12/2024',
    },
    {
      title: 'Sistemas de Controle PCS',
      category: 'Datasheet',
      description: 'Especificações dos sistemas de controle de potência para BESS.',
      date: '28/11/2024',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 container py-6 px-4 md:py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-evolight-navy mb-2">Documentação Técnica</h1>
          <p className="text-gray-600">Acesse datasheets, manuais técnicos e documentação regulatória sobre sistemas BESS.</p>
        </div>
        
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar documentos..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-evolight-gold focus:border-transparent"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((doc, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <span className="inline-block text-xs font-medium text-evolight-gold bg-evolight-lightgold px-2 py-1 rounded">
                    {doc.category}
                  </span>
                  <span className="text-xs text-gray-500">{doc.date}</span>
                </div>
                <CardTitle className="mt-2">{doc.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{doc.description}</CardDescription>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm">
                  <FileText className="mr-2 h-4 w-4" />
                  Visualizar
                </Button>
                <Button variant="ghost" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Download
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

export default DocumentacaoPage;
