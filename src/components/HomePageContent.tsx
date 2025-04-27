
import { Link } from "react-router-dom";
import { Battery, FileText, BookOpen, Info, Grid3X3 } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const HomePageContent: React.FC = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <section className="mb-8">
        <h1 className="text-3xl font-bold text-evolight-navy mb-2">Bem-vindo à Evolight BESS Analysis Suite</h1>
        <p className="text-gray-600">
          Ferramenta para análise técnica, dimensionamento e avaliação de viabilidade de Sistemas de Armazenamento de Energia por Bateria.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Simulador BESS Card */}
        <Card className="bg-white border-evolight-lightgray hover:border-evolight-navy transition-colors overflow-hidden">
          <CardHeader className="bg-evolight-navy text-white p-4 pb-3">
            <CardTitle className="flex items-center">
              <Battery className="mr-2 h-5 w-5" />
              Simulador BESS
            </CardTitle>
            <CardDescription className="text-gray-100">
              Dimensione e avalie a viabilidade técnico-financeira
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-5">
            <p className="text-gray-600">
              Configure parâmetros, simule operação, obtenha resultados técnicos e análise financeira detalhada de sistemas BESS.
            </p>
          </CardContent>
          <CardFooter className="p-4 pt-0">
            <Button asChild className="w-full bg-evolight-navy hover:bg-evolight-navy/90">
              <Link to="/simulador">Iniciar Simulação</Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Documentação Técnica Card */}
        <Card className="bg-white border-evolight-lightgray hover:border-evolight-gold transition-colors overflow-hidden">
          <CardHeader className="bg-evolight-gold text-white p-4 pb-3">
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Documentação Técnica
            </CardTitle>
            <CardDescription className="text-gray-100">
              Acesse documentos e recursos técnicos
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-5">
            <p className="text-gray-600">
              Biblioteca de manuais, folhas de dados, guias técnicos e outros documentos relevantes sobre sistemas BESS e energia solar.
            </p>
          </CardContent>
          <CardFooter className="p-4 pt-0">
            <Button asChild variant="outline" className="w-full border-evolight-gold text-evolight-gold hover:bg-evolight-gold hover:text-white">
              <Link to="/documentacao">Ver Documentação</Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Academia Card */}
        <Card className="bg-white border-evolight-lightgray hover:border-evolight-navy transition-colors overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-green-400 text-white p-4 pb-3">
            <CardTitle className="flex items-center">
              <BookOpen className="mr-2 h-5 w-5" />
              Academia da Sustentabilidade
            </CardTitle>
            <CardDescription className="text-gray-100">
              Aprenda sobre energia sustentável
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-5">
            <p className="text-gray-600">
              Conteúdo educativo sobre BESS, energia solar e sustentabilidade, com módulos, vídeos e quizzes interativos.
            </p>
          </CardContent>
          <CardFooter className="p-4 pt-0">
            <Button asChild variant="outline" className="w-full border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white">
              <Link to="/academia">Acessar Academia</Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Sobre a Evolight Card */}
        <Card className="bg-white border-evolight-lightgray hover:border-evolight-navy transition-colors overflow-hidden">
          <CardHeader className="bg-evolight-navy/80 text-white p-4 pb-3">
            <CardTitle className="flex items-center">
              <Info className="mr-2 h-5 w-5" />
              Sobre a Evolight
            </CardTitle>
            <CardDescription className="text-gray-100">
              Conheça nossa empresa e missão
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-5">
            <p className="text-gray-600">
              Informações sobre a empresa, missão, visão, valores e casos de sucesso em soluções energéticas sustentáveis.
            </p>
          </CardContent>
          <CardFooter className="p-4 pt-0">
            <Button asChild variant="outline" className="w-full">
              <Link to="/sobre">Saiba Mais</Link>
            </Button>
          </CardFooter>
        </Card>
        
        {/* Placeholder for future cards */}
        <Card className="bg-white border-evolight-lightgray hover:border-evolight-navy/60 transition-colors overflow-hidden opacity-75">
          <CardHeader className="bg-gray-500 text-white p-4 pb-3">
            <CardTitle className="flex items-center">
              <Grid3X3 className="mr-2 h-5 w-5" />
              Outras Soluções
            </CardTitle>
            <CardDescription className="text-gray-100">
              Portfólio completo Evolight
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-5">
            <p className="text-gray-600">
              Conheça todas as soluções oferecidas pela Evolight: Energia Solar, Mercado Livre, Mobilidade Elétrica e mais.
            </p>
          </CardContent>
          <CardFooter className="p-4 pt-0">
            <Button disabled variant="outline" className="w-full">
              Em breve
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default HomePageContent;
