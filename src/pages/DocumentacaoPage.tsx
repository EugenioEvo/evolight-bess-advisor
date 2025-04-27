
import React from 'react';
import Header from '@/components/Header';
import { FileText, Download, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const DocumentacaoPage: React.FC = () => {
  const documentCategories = [
    { id: 'all', name: 'Todos' },
    { id: 'bess', name: 'Baterias' },
    { id: 'inverters', name: 'Inversores' },
    { id: 'pcs', name: 'PCS' },
    { id: 'manuals', name: 'Manuais' },
  ];

  const documents = [
    { id: 1, title: 'Manual Técnico - Sistema BESS 100kWh', category: 'manuals', type: 'PDF', size: '3.2 MB' },
    { id: 2, title: 'Especificações Bateria LFP - Evolight', category: 'bess', type: 'PDF', size: '1.8 MB' },
    { id: 3, title: 'Datasheet Inversor Híbrido - Série Pro', category: 'inverters', type: 'PDF', size: '2.5 MB' },
    { id: 4, title: 'Guia de Integração PCS - Sistema Comercial', category: 'pcs', type: 'PDF', size: '4.1 MB' },
    { id: 5, title: 'Certificado de Conformidade - Baterias', category: 'bess', type: 'PDF', size: '0.9 MB' },
    { id: 6, title: 'Manual de Instalação - Sistema Completo', category: 'manuals', type: 'PDF', size: '5.7 MB' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 container py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-evolight-navy mb-2">Documentação Técnica</h1>
          <p className="text-gray-600">Acesse manuais, datasheets e documentação técnica dos produtos Evolight.</p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-3/4">
            {/* Search and Filter */}
            <div className="mb-6 flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input placeholder="Buscar documentos" className="pl-10" />
              </div>
              <Button variant="outline" className="flex gap-2">
                <Filter size={18} />
                Filtros
              </Button>
            </div>
            
            {/* Documents List */}
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="mb-4">
                {documentCategories.map(category => (
                  <TabsTrigger key={category.id} value={category.id}>
                    {category.name}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {documentCategories.map(category => (
                <TabsContent key={category.id} value={category.id} className="space-y-4">
                  {documents
                    .filter(doc => category.id === 'all' || doc.category === category.id)
                    .map(document => (
                      <Card key={document.id}>
                        <CardHeader className="py-3">
                          <CardTitle className="text-lg flex items-center">
                            <FileText className="mr-2 h-5 w-5 text-evolight-navy" />
                            {document.title}
                          </CardTitle>
                          <CardDescription>
                            {document.type} • {document.size}
                          </CardDescription>
                        </CardHeader>
                        <CardFooter className="py-3 flex justify-end">
                          <Button variant="outline" size="sm" className="flex gap-1">
                            <Download size={16} />
                            Download
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  
                  {documents.filter(doc => category.id === 'all' || doc.category === category.id).length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-gray-500">Nenhum documento encontrado nesta categoria.</p>
                    </div>
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </div>
          
          <div className="w-full md:w-1/4">
            <Card>
              <CardHeader>
                <CardTitle>Recursos Recentes</CardTitle>
                <CardDescription>Documentos adicionados recentemente</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {documents.slice(0, 3).map(document => (
                  <div key={`recent-${document.id}`} className="flex items-start">
                    <FileText className="h-4 w-4 mt-1 mr-2 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{document.title}</p>
                      <p className="text-xs text-muted-foreground">{document.type} • {document.size}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" className="w-full">Ver todos</Button>
              </CardFooter>
            </Card>
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

export default DocumentacaoPage;
