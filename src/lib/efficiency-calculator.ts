export type EfficiencyInputs = {
  teamSize: number;
  hoursPerWeek: number;
  hourlyRate: number;
  automatablePercent: number;
};

export type EfficiencyResults = {
  efficiencyGain: number;
  hoursSavedWeek: number;
  hoursSavedYear: number;
  annualSavings: number;
};

export const EFFICIENCY_DEFAULTS: EfficiencyInputs = {
  teamSize: 5,
  hoursPerWeek: 8,
  hourlyRate: 45,
  automatablePercent: 45,
};

export const EFFICIENCY_LIMITS = {
  teamSize: { min: 1, max: 50 },
  hoursPerWeek: { min: 1, max: 40 },
  hourlyRate: { min: 15, max: 200 },
  automatablePercent: { min: 25, max: 75 },
} as const;

export function calculateEfficiency(inputs: EfficiencyInputs): EfficiencyResults {
  const teamSize = clamp(inputs.teamSize, EFFICIENCY_LIMITS.teamSize.min, EFFICIENCY_LIMITS.teamSize.max);
  const hoursPerWeek = clamp(
    inputs.hoursPerWeek,
    EFFICIENCY_LIMITS.hoursPerWeek.min,
    EFFICIENCY_LIMITS.hoursPerWeek.max,
  );
  const hourlyRate = clamp(
    inputs.hourlyRate,
    EFFICIENCY_LIMITS.hourlyRate.min,
    EFFICIENCY_LIMITS.hourlyRate.max,
  );
  const automatablePercent = clamp(
    inputs.automatablePercent,
    EFFICIENCY_LIMITS.automatablePercent.min,
    EFFICIENCY_LIMITS.automatablePercent.max,
  );

  const weeklyManualHours = teamSize * hoursPerWeek;
  const annualManualHours = weeklyManualHours * 52;
  const hoursSavedYear = annualManualHours * (automatablePercent / 100);
  const hoursSavedWeek = hoursSavedYear / 52;
  const annualSavings = hoursSavedYear * hourlyRate;

  return {
    efficiencyGain: automatablePercent,
    hoursSavedWeek,
    hoursSavedYear,
    annualSavings,
  };
}

export function formatHours(value: number): string {
  const rounded = Math.round(value);
  return rounded.toLocaleString("en-US");
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Math.round(value));
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}
