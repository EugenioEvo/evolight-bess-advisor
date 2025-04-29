
import { useState } from "react";
import { useBessSize } from '@/hooks/useBessSize';
import { toast } from "sonner";
import { SimuladorFormValues } from "@/schemas/simuladorSchema";

export function useSimulation() {
  const { calculateBessSize } = useBessSize();
  
  const [simulationResults, setSimulationResults] = useState<{
    calculatedPowerKw: number;
    calculatedEnergyKwh: number;
    paybackYears?: number;
    annualSavings?: number;
    roi?: number;
    npv?: number;
    isViable?: boolean;
  } | null>(null);

  const runSimulation = async (values: SimuladorFormValues) => {
    try {
      console.log("Submitting form values:", values);
      
      // Create a basic load profile based on the provided demand values
      const peakLoad = values.avgPeakDemandKw > 0 ? values.avgPeakDemandKw : 50;
      const offpeakLoad = values.avgOffpeakDemandKw > 0 ? values.avgOffpeakDemandKw : 40;
      const maxPeakLoad = values.maxPeakDemandKw > 0 ? values.maxPeakDemandKw : peakLoad * 1.5;
      const maxOffpeakLoad = values.maxOffpeakDemandKw > 0 ? values.maxOffpeakDemandKw : offpeakLoad * 1.5;
      
      // Create a synthetic load profile with peak and off-peak periods
      const load_profile = [];
      for (let hour = 0; hour < 24; hour++) {
        if (hour >= values.peakStartHour && hour <= values.peakEndHour) {
          // Peak hours
          load_profile.push(maxPeakLoad);
        } else if (hour >= 7 && hour < values.peakStartHour) {
          // Daytime hours
          const daytimeFactor = 0.8 + 0.2 * Math.sin((hour - 7) / (values.peakStartHour - 7) * Math.PI);
          load_profile.push(offpeakLoad + (peakLoad - offpeakLoad) * daytimeFactor);
        } else {
          // Night hours
          const nightFactor = 0.6 + 0.4 * Math.cos(hour / 12 * Math.PI);
          load_profile.push(offpeakLoad * nightFactor);
        }
      }
      
      // Calculate PV profile if applicable
      const pv_profile = values.hasPv && values.pvPowerKwp > 0 
        ? [0, 0, 0, 0, 0, 0.1, 0.3, 0.5, 0.7, 0.9, 1.0, 0.9, 0.8, 0.6, 0.4, 0.2, 0, 0, 0, 0, 0, 0, 0, 0]
            .map(v => v * values.pvPowerKwp) 
        : undefined;

      // Define peak shaving target or reduction
      let peakShavingTarget = 0;
      let peakReductionKw = 0;
      
      if (values.usePeakShaving) {
        if (values.peakShavingMethod === 'percentage') {
          peakReductionKw = maxPeakLoad * (values.peakShavingPercentage / 100);
        } else if (values.peakShavingMethod === 'reduction') {
          peakReductionKw = values.peakShavingTarget;
        } else if (values.peakShavingMethod === 'target') {
          peakShavingTarget = values.peakShavingTarget;
        }
      }
      
      // Define critical load for backup if applicable
      let criticalLoadKw = undefined;
      let backupDurationH = undefined;
      
      if (values.useBackup) {
        criticalLoadKw = values.criticalLoadKw > 0 ? values.criticalLoadKw : peakLoad * 0.5;
        backupDurationH = values.backupDurationHours > 0 ? values.backupDurationHours : 2;
      }
      
      // Use the peak shaving schedule parameters
      const peakShavingStartHour = values.peakShavingStartHour;
      const peakShavingEndHour = values.peakShavingEndHour;
      const peakShavingDurationHours = values.peakShavingDurationHours;
      
      console.log("Sending to Edge Function:", {
        load_profile,
        pv_profile,
        tariff_structure: {
          peak_start_hour: values.peakStartHour,
          peak_end_hour: values.peakEndHour
        },
        sizing_params: {
          backup_required: values.useBackup,
          critical_load_kw: criticalLoadKw,
          backup_duration_h: backupDurationH,
          peak_shaving_required: values.usePeakShaving,
          peak_shaving_target_kw: peakShavingTarget > 0 ? peakShavingTarget : undefined,
          peak_reduction_kw: peakReductionKw > 0 ? peakReductionKw : undefined,
          peak_shaving_start_hour: peakShavingStartHour,
          peak_shaving_end_hour: peakShavingEndHour,
          peak_shaving_duration_hours: peakShavingDurationHours,
          arbitrage_required: values.useArbitrage,
          pv_optim_required: values.usePvOptim,
          grid_zero: values.pvPolicy === 'grid_zero',
          sizing_buffer_factor: 1.1
        },
        bess_technical_params: {
          discharge_eff: Math.sqrt(values.bessEfficiency / 100),
          charge_eff: Math.sqrt(values.bessEfficiency / 100)
        },
        simulation_params: {
          interval_minutes: 60
        }
      });

      const sizingResult = await calculateBessSize({
        load_profile,
        pv_profile,
        tariff_structure: {
          peak_start_hour: values.peakStartHour,
          peak_end_hour: values.peakEndHour
        },
        sizing_params: {
          backup_required: values.useBackup,
          critical_load_kw: criticalLoadKw,
          backup_duration_h: backupDurationH,
          peak_shaving_required: values.usePeakShaving,
          peak_shaving_target_kw: peakShavingTarget > 0 ? peakShavingTarget : undefined,
          peak_reduction_kw: peakReductionKw > 0 ? peakReductionKw : undefined,
          peak_shaving_start_hour: peakShavingStartHour,
          peak_shaving_end_hour: peakShavingEndHour,
          peak_shaving_duration_hours: peakShavingDurationHours,
          arbitrage_required: values.useArbitrage,
          pv_optim_required: values.usePvOptim,
          grid_zero: values.pvPolicy === 'grid_zero',
          sizing_buffer_factor: 1.1
        },
        bess_technical_params: {
          discharge_eff: Math.sqrt(values.bessEfficiency / 100),
          charge_eff: Math.sqrt(values.bessEfficiency / 100)
        },
        simulation_params: {
          interval_minutes: 60
        }
      });

      console.log("Received sizing result:", sizingResult);
      
      // Calculate estimated financials based on the sizing results
      const costPerKwh = values.bessInstallationCost || 1500;
      const totalInvestment = sizingResult.calculated_energy_kwh * costPerKwh;
      
      // Simplified annual savings calculation
      let annualSavings = 0;
      
      // Peak shaving savings (simplified)
      if (values.usePeakShaving) {
        const peakReduction = values.peakShavingMethod === 'percentage' 
          ? values.maxPeakDemandKw * (values.peakShavingPercentage / 100)
          : values.peakShavingTarget || values.maxPeakDemandKw * 0.3;
          
        annualSavings += peakReduction * values.tusdPeakKw * 12; // Monthly demand savings * 12
      }
      
      // Arbitrage savings (simplified)
      if (values.useArbitrage) {
        // Calculate daily energy cycled based on average peak and off-peak consumption
        const dailyPeakEnergy = values.avgDailyPeakConsumptionKwh > 0 
          ? values.avgDailyPeakConsumptionKwh 
          : peakLoad * (values.peakEndHour - values.peakStartHour + 1);
          
        const dailyCycleEnergy = Math.min(dailyPeakEnergy * 0.7, sizingResult.calculated_energy_kwh * 0.85);
        
        const energyPriceDiff = (values.tePeak + values.tusdPeakKwh) - 
                               (values.teOffpeak + values.tusdOffpeakKwh);
                               
        annualSavings += dailyCycleEnergy * energyPriceDiff * 22 * 12; // 22 business days/month
      }
      
      // Simple payback period
      const paybackYears = annualSavings > 0 ? totalInvestment / annualSavings : 0;
      
      // Set simulation results
      const results = {
        calculatedPowerKw: sizingResult.calculated_power_kw,
        calculatedEnergyKwh: sizingResult.calculated_energy_kwh,
        paybackYears,
        annualSavings,
        roi: (annualSavings * values.horizonYears) / totalInvestment * 100,
        isViable: paybackYears > 0 && paybackYears < values.horizonYears
      };
      
      setSimulationResults(results);
      
      toast.success("BESS dimensionado com sucesso!", {
        description: `Potência: ${sizingResult.calculated_power_kw} kW, Capacidade: ${sizingResult.calculated_energy_kwh} kWh`
      });
      
      return { success: true, results };
    } catch (error) {
      console.error('Error calculating BESS size:', error);
      toast.error("Erro ao dimensionar BESS", {
        description: "Tente novamente ou ajuste os parâmetros"
      });
      return { success: false, error };
    }
  };

  return {
    simulationResults,
    setSimulationResults,
    runSimulation
  };
}
