
export interface DispatchPoint {
  hour: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23;
  load: number;        // kW
  pv: number;          // kW gerados (>=0)
  diesel: number;      // kW gerados (>=0)
  charge: number;      // kW carregando BESS (>=0)
  discharge: number;   // kW descarregando BESS (>=0)
  grid?: number;       // kW comprados (>=0) - opcional
  soc: number;         // 0-100 %
  dieselRef: number;   // Changed from optional to required
}

export interface EnergyDispatchChartProps {
  data: DispatchPoint[];
  highlightPeakHours?: boolean;
  peakStartHour?: number;
  peakEndHour?: number;
  title?: string;
}
