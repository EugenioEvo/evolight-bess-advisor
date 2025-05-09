
import React, { useMemo } from 'react';
import { ArrowRight, ChartLine } from 'lucide-react';
import { useChartColors } from './useChartColors';

interface EnergyFlowProps {
  data: any[];
  hour: number;
  onHourChange: (hour: number) => void;
}

export function EnergyFlowChart({ data, hour = 12, onHourChange }: EnergyFlowProps) {
  const chartColors = useChartColors();
  
  // Find data for the selected hour
  const currentData = useMemo(() => {
    return data.find(d => d.hour === hour) || data[0];
  }, [data, hour]);

  // Calculate the width of each flow based on the data
  const calculateWidth = (value: number) => {
    const maxValue = Math.max(
      currentData.load, 
      currentData.pv, 
      currentData.grid, 
      currentData.diesel, 
      currentData.discharge,
      currentData.charge
    );
    
    // Normalize to a percentage between 25% and 100%
    const normalized = Math.max(25, Math.min(100, (value / maxValue) * 100));
    return `${normalized}%`;
  };

  // Format number for display
  const formatNumber = (num: number) => {
    return Number(num.toFixed(1)).toLocaleString();
  };

  // Handle hour change
  const handleHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onHourChange(Number(e.target.value));
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Fluxo de Energia: {hour}:00h</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Hora:</span>
          <input
            type="range"
            min="0"
            max="23"
            value={hour}
            onChange={handleHourChange}
            className="w-32 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <span className="text-sm text-muted-foreground">{hour}:00</span>
        </div>
      </div>

      <div className="flex-1 bg-muted/20 rounded-lg p-4 overflow-auto">
        <div className="flex flex-col gap-6 h-full">
          {/* Energy sources */}
          <div className="flex justify-between gap-4 h-1/3">
            {/* PV Source */}
            {currentData.pv > 0 && (
              <div className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full h-16 rounded-lg flex items-center justify-center text-white mb-2"
                  style={{ backgroundColor: chartColors.pv }}
                >
                  <div className="text-center">
                    <div className="font-bold">Fotovoltaico</div>
                    <div>{formatNumber(currentData.pv)} kW</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <ArrowRight className="text-muted-foreground animate-pulse" />
                </div>
              </div>
            )}
            
            {/* Grid Source */}
            {currentData.grid > 0 && (
              <div className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full h-16 rounded-lg flex items-center justify-center text-white mb-2"
                  style={{ backgroundColor: chartColors.grid }}
                >
                  <div className="text-center">
                    <div className="font-bold">Rede</div>
                    <div>{formatNumber(currentData.grid)} kW</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <ArrowRight className="text-muted-foreground animate-pulse" />
                </div>
              </div>
            )}
            
            {/* Diesel Source */}
            {currentData.diesel > 0 && (
              <div className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full h-16 rounded-lg flex items-center justify-center text-white mb-2"
                  style={{ backgroundColor: chartColors.diesel }}
                >
                  <div className="text-center">
                    <div className="font-bold">Diesel</div>
                    <div>{formatNumber(currentData.diesel)} kW</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <ArrowRight className="text-muted-foreground animate-pulse" />
                </div>
              </div>
            )}
          </div>
          
          {/* BESS in the middle */}
          <div className="flex justify-center items-center h-1/3">
            <div className="relative">
              <div 
                className="w-64 h-32 rounded-lg border-2 flex flex-col items-center justify-center"
                style={{ borderColor: chartColors.soc }}
              >
                <div className="text-center">
                  <div className="font-bold">BESS</div>
                  <div className="text-sm">Estado de Carga: {formatNumber(currentData.soc)}%</div>
                  
                  {currentData.charge > 0 && (
                    <div className="mt-1 text-sm py-1 px-2 rounded" style={{ backgroundColor: chartColors.charge + '40' }}>
                      Carregando: +{formatNumber(currentData.charge)} kW
                    </div>
                  )}
                  
                  {currentData.discharge > 0 && (
                    <div className="mt-1 text-sm py-1 px-2 rounded" style={{ backgroundColor: chartColors.discharge + '40' }}>
                      Descarregando: -{formatNumber(currentData.discharge)} kW
                    </div>
                  )}
                </div>
                
                {/* Battery level indicator */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
                  <div 
                    className="h-full transition-all duration-500"
                    style={{ 
                      width: `${currentData.soc}%`, 
                      backgroundColor: chartColors.soc 
                    }}
                  />
                </div>
              </div>
              
              {/* Arrows from BESS */}
              {currentData.discharge > 0 && (
                <div className="absolute -right-8 top-1/2 transform -translate-y-1/2">
                  <ArrowRight className="text-muted-foreground animate-pulse" />
                </div>
              )}
              
              {/* Arrows to BESS */}
              {currentData.charge > 0 && (
                <div className="absolute -left-8 top-1/2 transform -translate-y-1/2">
                  <ArrowRight className="text-muted-foreground animate-pulse" />
                </div>
              )}
            </div>
          </div>
          
          {/* Load (consumption) */}
          <div className="flex justify-center h-1/3">
            <div className="flex-1 flex flex-col items-center max-w-md">
              <div className="flex items-center mb-2">
                <ArrowRight className="text-muted-foreground animate-pulse" />
              </div>
              <div 
                className="w-full h-16 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: chartColors.load, color: 'white' }}
              >
                <div className="text-center">
                  <div className="font-bold">Carga do Cliente</div>
                  <div>{formatNumber(currentData.load)} kW</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-4 justify-center">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: chartColors.pv }}></div>
          <span className="text-sm">Fotovoltaico</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: chartColors.grid }}></div>
          <span className="text-sm">Rede</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: chartColors.diesel }}></div>
          <span className="text-sm">Diesel</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: chartColors.discharge }}></div>
          <span className="text-sm">BESS (descarga)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: chartColors.charge }}></div>
          <span className="text-sm">BESS (carga)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: chartColors.load }}></div>
          <span className="text-sm">Carga</span>
        </div>
      </div>
      
      {/* Daily profile chart button */}
      <div className="mt-4 flex justify-center">
        <button 
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ChartLine size={16} />
          <span>Ver perfil completo de 24h</span>
        </button>
      </div>
    </div>
  );
}
