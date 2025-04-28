
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
      
      // Create a basic load profile based on average demand
      const baseLoad = values.avgPeakDemandKw > 0 ? values.avgPeakDemandKw : 50;
      const maxLoad = values.maxPeakDemandKw > 0 ? values.maxPeakDemandKw : baseLoad * 2;
      
      // Create a synthetic load profile with lower values during night, higher during day, and peak at evening
      const load_profile = [
        baseLoad * 0.7, baseLoad * 0.6, baseLoad * 0.5, baseLoad * 0.5, baseLoad * 0.6, baseLoad * 0.8, 
        baseLoad * 1.0, baseLoad * 1.2, baseLoad * 1.4, baseLoad * 1.6, baseLoad * 1.8, baseLoad * 1.9,
        baseLoad * 1.8, baseLoad * 1.7, baseLoad * 1.6, baseLoad * 1.6, baseLoad * 1.8, maxLoad * 0.9,
        maxLoad, maxLoad * 0.9, maxLoad * 0.7, baseLoad * 1.4, baseLoad * 1.0, baseLoad * 0.8
      ];
      
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
          peakReductionKw = maxLoad * (values.peakShavingPercentage / 100);
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
        criticalLoadKw = values.criticalLoadKw > 0 ? values.criticalLoadKw : baseLoad * 0.5;
        backupDurationH = values.backupDurationHours > 0 ? values.backupDurationHours : 2;
      }
      
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
      
      // Simplified annual savings calculation (real calculation would be based on full simulation)
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
        const dailyDischarge = sizingResult.calculated_energy_kwh * 0.7; // Assume 70% daily cycling
        const energyPriceDiff = (values.tePeak + values.tusdPeakKwh) - 
                               (values.teOffpeak + values.tusdOffpeakKwh);
        annualSavings += dailyDischarge * energyPriceDiff * 22 * 12; // 22 business days/month
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
