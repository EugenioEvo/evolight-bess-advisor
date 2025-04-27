
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Battery, Zap, LineChart, LightbulbOff, Settings } from 'lucide-react';
import { setOnboarded } from '@/lib/utils';

const slides = [
  {
    title: 'Sistemas de Armazenamento de Energia por Bateria',
    description: 'Conheça o potencial dos sistemas BESS para otimizar seu consumo de energia e reduzir custos operacionais.',
    icon: <Battery className="w-16 h-16 text-evolight-gold" />,
  },
  {
    title: 'Soluções Sustentáveis',
    description: 'Contribua para um futuro mais sustentável com soluções de energia inovadoras que reduzem a pegada de carbono.',
    icon: <Zap className="w-16 h-16 text-evolight-gold" />,
  },
  {
    title: 'Análise Financeira Detalhada',
    description: 'Avalie o retorno sobre investimento, payback e outros indicadores financeiros para tomar decisões informadas.',
    icon: <LineChart className="w-16 h-16 text-evolight-gold" />,
  },
  {
    title: 'Redução de Picos de Demanda',
    description: 'Minimize os picos de consumo e otimize sua estrutura tarifária com peak shaving inteligente.',
    icon: <LightbulbOff className="w-16 h-16 text-evolight-gold" />,
  },
  {
    title: 'Dimensionamento Técnico Preciso',
    description: 'Obtenha o dimensionamento ideal para suas necessidades específicas, com análise técnica completa.',
    icon: <Settings className="w-16 h-16 text-evolight-gold" />,
  }
];

const OnboardingCarousel: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const nextSlide = () => {
    if (currentSlide === slides.length - 1) {
      completeOnboarding();
    } else {
      setCurrentSlide(prev => prev + 1);
    }
  };

  const prevSlide = () => {
    setCurrentSlide(prev => Math.max(0, prev - 1));
  };

  const completeOnboarding = () => {
    setOnboarded();
    navigate('/home');
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-white px-6">
      <div className="max-w-lg w-full mx-auto">
        <div className="mb-8 flex justify-center">
          {slides[currentSlide].icon}
        </div>
        
        <h1 className="text-3xl font-semibold text-center text-evolight-navy mb-4">
          {slides[currentSlide].title}
        </h1>
        
        <p className="text-lg text-center text-gray-600 mb-12">
          {slides[currentSlide].description}
        </p>
        
        <div className="flex justify-center space-x-2 mb-12">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-colors ${
                currentSlide === index ? 'bg-evolight-gold' : 'bg-gray-300'
              }`}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
        
        <div className="flex justify-between">
          <div className="flex gap-4">
            {currentSlide > 0 && (
              <Button variant="outline" onClick={prevSlide}>
                <ChevronLeft className="mr-2 h-4 w-4" />
                Anterior
              </Button>
            )}
          </div>
          <div className="flex gap-4">
            <Button variant="ghost" onClick={completeOnboarding}>
              Pular
            </Button>
            <Button className="bg-evolight-navy hover:bg-evolight-navy/90" onClick={nextSlide}>
              {currentSlide === slides.length - 1 ? 'Concluir' : 'Próximo'}
              {currentSlide !== slides.length - 1 && <ChevronRight className="ml-2 h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingCarousel;
