
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { useWizard } from '../context/WizardContext';
import { WizardProgress } from '../ui/WizardProgress';
import { ConsumptionProfileSection } from './profile/ConsumptionProfileSection';
import { SolarProfileSection } from './profile/SolarProfileSection';
import { ProfileChartPreview } from './profile/ProfileChartPreview';
import { useProfileValidation, useSolarProfileGeneration } from './profile/ProfileUtils';

export function ProfileStep() {
  const { setCanProceed } = useWizard();
  const { watch, setValue } = useFormContext();
  
  // Setup validation for proceeding to next step
  useProfileValidation(watch, setCanProceed);
  
  // Setup automatic solar profile generation
  useSolarProfileGeneration(watch, setValue);
  
  const hourlyDemandKw = watch('hourlyDemandKw');
  const hasPv = watch('hasPv');
  const hourlyPvKw = watch('hourlyPvKw');
  const peakStartHour = watch('peakStartHour');
  const peakEndHour = watch('peakEndHour');
  
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-2">Perfil Energético</h2>
        <p className="text-muted-foreground">
          Informe como a energia é consumida e, se aplicável, gerada ao longo do dia.
        </p>
      </div>
      
      <WizardProgress />
      
      <ConsumptionProfileSection />
      
      <SolarProfileSection />
      
      <ProfileChartPreview
        hourlyDemandKw={hourlyDemandKw}
        hourlyPvKw={hasPv ? hourlyPvKw : undefined}
        peakStartHour={peakStartHour}
        peakEndHour={peakEndHour}
      />
    </div>
  );
}
