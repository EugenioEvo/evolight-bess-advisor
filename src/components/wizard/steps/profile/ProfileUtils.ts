
import { useEffect } from 'react';
import { UseFormWatch, UseFormSetValue } from 'react-hook-form';
import { WizardFormValues } from '../../schema';
import { generateSolarProfile } from './SolarProfileSection';

export function useProfileValidation(
  watch: UseFormWatch<WizardFormValues>,
  setCanProceed: (value: boolean) => void
) {
  const profileEntryMethod = watch('profileEntryMethod');
  const hourlyDemandKw = watch('hourlyDemandKw');
  
  // Check if profile data is valid to proceed
  useEffect(() => {
    if (profileEntryMethod === 'simple') {
      setCanProceed(true);
    } else if (profileEntryMethod === 'hourly') {
      const hasValidData = hourlyDemandKw && 
        hourlyDemandKw.length === 24 && 
        hourlyDemandKw.some(val => val > 0);
      setCanProceed(hasValidData);
    } else {
      // Upload method validation would go here
      setCanProceed(false);
    }
  }, [profileEntryMethod, hourlyDemandKw, setCanProceed]);
}

export function useSolarProfileGeneration(
  watch: UseFormWatch<WizardFormValues>,
  setValue: UseFormSetValue<WizardFormValues>
) {
  const hasPv = watch('hasPv');
  const pvProfileMethod = watch('pvProfileMethod');
  const pvPowerKwp = watch('pvPowerKwp');
  
  // Generate solar profile automatically when pvProfileMethod is 'auto'
  useEffect(() => {
    if (hasPv && pvProfileMethod === 'auto' && pvPowerKwp > 0) {
      // Generate profile based on kWp
      const generatedPvProfile = generateSolarProfile(pvPowerKwp);
      setValue('hourlyPvKw', generatedPvProfile);
    }
  }, [hasPv, pvProfileMethod, pvPowerKwp, setValue]);
}
