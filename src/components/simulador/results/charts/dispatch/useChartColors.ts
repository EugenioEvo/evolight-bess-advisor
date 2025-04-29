
import { useTheme } from "next-themes";
import { useMemo } from 'react';

export function useChartColors() {
  const { resolvedTheme } = useTheme();
  
  return useMemo(() => {
    return {
      pv: resolvedTheme === 'dark' ? '#fff4af' : '#ffe58a',
      diesel: resolvedTheme === 'dark' ? '#e0b68a' : '#cfa67d',
      discharge: resolvedTheme === 'dark' ? '#b3edb9' : '#98e3a1',
      charge: resolvedTheme === 'dark' ? '#b8d1ff' : '#a1c4ff',
      grid: resolvedTheme === 'dark' ? '#ffc6b3' : '#ffb39a',
      load: '#000000',
      soc: resolvedTheme === 'dark' ? '#b280e3' : '#7423c6',
      peakArea: resolvedTheme === 'dark' ? 'rgba(255,100,100,0.05)' : 'rgba(255,100,100,0.1)',
      chargeArea: resolvedTheme === 'dark' ? 'rgba(100,100,255,0.05)' : 'rgba(100,100,255,0.1)'
    };
  }, [resolvedTheme]);
}
