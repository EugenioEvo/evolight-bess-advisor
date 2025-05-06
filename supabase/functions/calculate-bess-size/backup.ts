
// Backup sizing calculations
import { SizingParams, BackupResult } from "./types.ts";

// Calculate backup power and energy requirements
export function calculateBackupRequirements(
  sizing_params?: SizingParams,
  discharge_eff: number = 0.95
): BackupResult {
  const critical_load_kw = sizing_params?.critical_load_kw || 0;
  const backup_duration_h = sizing_params?.backup_duration_h || 0;
  
  let power_backup = 0;
  let energy_backup = 0;

  if (critical_load_kw > 0 && backup_duration_h > 0) {
    power_backup = critical_load_kw;
    energy_backup = (critical_load_kw * backup_duration_h) / discharge_eff;
  }

  return { power_backup, energy_backup };
}
