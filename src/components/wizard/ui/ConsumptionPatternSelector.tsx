
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Sun, Moon, Workflow } from 'lucide-react';

interface ConsumptionPatternSelectorProps {
  onSelect: (pattern: string) => void;
}

export function ConsumptionPatternSelector({ onSelect }: ConsumptionPatternSelectorProps) {
  const patterns = [
    {
      id: 'daytime',
      name: 'Pico durante o dia',
      icon: <Sun className="h-6 w-6 text-yellow-500" />,
      description: 'Maior consumo durante o horário comercial',
      color: 'bg-yellow-50 border-yellow-200 hover:border-yellow-400',
      iconBg: 'bg-yellow-100'
    },
    {
      id: 'nighttime',
      name: 'Pico à noite',
      icon: <Moon className="h-6 w-6 text-blue-500" />,
      description: 'Maior consumo no início da noite',
      color: 'bg-blue-50 border-blue-200 hover:border-blue-400',
      iconBg: 'bg-blue-100'
    },
    {
      id: 'constant',
      name: 'Consumo constante',
      icon: <Workflow className="h-6 w-6 text-purple-500" />,
      description: 'Perfil aproximadamente plano ao longo do dia',
      color: 'bg-purple-50 border-purple-200 hover:border-purple-400',
      iconBg: 'bg-purple-100'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {patterns.map((pattern) => (
        <Card
          key={pattern.id}
          className={`cursor-pointer border transition-all ${pattern.color}`}
          onClick={() => onSelect(pattern.id)}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-full ${pattern.iconBg}`}>
                {pattern.icon}
              </div>
              <div className="space-y-1">
                <h3 className="font-medium">{pattern.name}</h3>
                <p className="text-xs text-muted-foreground">{pattern.description}</p>
              </div>
            </div>
            
            <div className="mt-4 h-12 w-full bg-background rounded-md overflow-hidden">
              {pattern.id === 'daytime' && (
                <div className="w-full h-full bg-gradient-to-b from-transparent to-transparent relative">
                  <div className="absolute inset-0 flex items-end">
                    <div className="h-20% w-1/12 bg-yellow-200"></div>
                    <div className="h-30% w-1/12 bg-yellow-300"></div>
                    <div className="h-50% w-1/12 bg-yellow-400"></div>
                    <div className="h-70% w-1/12 bg-yellow-500"></div>
                    <div className="h-90% w-1/12 bg-yellow-600"></div>
                    <div className="h-100% w-1/12 bg-yellow-700"></div>
                    <div className="h-90% w-1/12 bg-yellow-600"></div>
                    <div className="h-80% w-1/12 bg-yellow-500"></div>
                    <div className="h-60% w-1/12 bg-yellow-400"></div>
                    <div className="h-40% w-1/12 bg-yellow-300"></div>
                    <div className="h-30% w-1/12 bg-yellow-200"></div>
                    <div className="h-20% w-1/12 bg-yellow-100"></div>
                  </div>
                </div>
              )}
              
              {pattern.id === 'nighttime' && (
                <div className="w-full h-full bg-gradient-to-b from-transparent to-transparent relative">
                  <div className="absolute inset-0 flex items-end">
                    <div className="h-20% w-1/12 bg-blue-200"></div>
                    <div className="h-20% w-1/12 bg-blue-200"></div>
                    <div className="h-40% w-1/12 bg-blue-300"></div>
                    <div className="h-50% w-1/12 bg-blue-400"></div>
                    <div className="h-60% w-1/12 bg-blue-500"></div>
                    <div className="h-70% w-1/12 bg-blue-600"></div>
                    <div className="h-90% w-1/12 bg-blue-700"></div>
                    <div className="h-100% w-1/12 bg-blue-700"></div>
                    <div className="h-80% w-1/12 bg-blue-600"></div>
                    <div className="h-70% w-1/12 bg-blue-500"></div>
                    <div className="h-50% w-1/12 bg-blue-400"></div>
                    <div className="h-30% w-1/12 bg-blue-300"></div>
                  </div>
                </div>
              )}
              
              {pattern.id === 'constant' && (
                <div className="w-full h-full bg-gradient-to-b from-transparent to-transparent relative">
                  <div className="absolute inset-0 flex items-end">
                    {Array(12).fill(0).map((_, i) => (
                      <div key={i} className="h-60% w-1/12 bg-purple-400"></div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
