"use client";

import { ArrowRight, Sparkles } from "lucide-react";
import { useMemo, useState, type CSSProperties } from "react";

import { CalendlyBookButton } from "@/components/CalendlyBookButton";
import {
  calculateEfficiency,
  EFFICIENCY_DEFAULTS,
  EFFICIENCY_LIMITS,
  formatCurrency,
  formatHours,
  type EfficiencyInputs,
} from "@/lib/efficiency-calculator";
import type { EfficiencyCalculatorContent } from "@/sanity/types";

type EfficiencyCalculatorProps = {
  content?: EfficiencyCalculatorContent;
  className?: string;
  variant?: "default" | "prominent";
};

type SliderFieldProps = {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  large?: boolean;
  onChange: (value: number) => void;
};

function AnimatedValue({ value, className = "" }: { value: string | number; className?: string }) {
  return (
    <span key={value} className={`inline-block animate-efficiency-pop ${className}`}>
      {value}
    </span>
  );
}

function EfficiencyRing({ percent }: { percent: number }) {
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="relative shrink-0">
      <svg viewBox="0 0 96 96" className="h-24 w-24" aria-hidden>
        <circle
          cx="48"
          cy="48"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="7"
          className="text-border"
        />
        <circle
          cx="48"
          cy="48"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 48 48)"
          className="text-primary transition-[stroke-dashoffset] duration-500 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-heading text-2xl font-extrabold leading-none text-foreground">
          <AnimatedValue value={percent} />
          <span className="text-lg text-primary">%</span>
        </span>
        <span className="mt-0.5 font-body text-[0.6rem] font-semibold uppercase tracking-wide text-muted-foreground">
          gain
        </span>
      </div>
    </div>
  );
}

function SliderField({
  id,
  label,
  value,
  min,
  max,
  step = 1,
  unit,
  large = false,
  onChange,
}: SliderFieldProps) {
  const fillPercent = ((value - min) / (max - min)) * 100;

  return (
    <div className="min-w-0 rounded-xl border border-border/80 bg-background/80 p-3 transition-colors focus-within:border-primary/30 focus-within:bg-background">
      <div className="mb-2 flex items-baseline justify-between gap-2">
        <label
          htmlFor={id}
          className={`font-body font-semibold leading-snug text-foreground ${large ? "text-sm" : "text-xs"}`}
        >
          {label}
        </label>
        <span className={`shrink-0 font-heading font-bold text-primary ${large ? "text-sm" : "text-xs"}`}>
          <AnimatedValue value={value} />
          {unit ? ` ${unit}` : ""}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={`efficiency-range w-full ${large ? "efficiency-range-lg" : ""}`}
        style={
          {
            "--efficiency-fill": `${fillPercent}%`,
          } as CSSProperties
        }
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
      />
    </div>
  );
}

const DEFAULT_COPY: Required<EfficiencyCalculatorContent> = {
  heading: "Estimate your efficiency gain",
  description:
    "Adjust the sliders to see how much manual work AI automation could take off your team’s plate.",
  disclaimer:
    "Estimates based on typical automation outcomes. Book a discovery call for a scoped audit tailored to your operations.",
  ctaLabel: "Book a discovery call",
};

export function EfficiencyCalculator({
  content,
  className = "",
  variant = "default",
}: EfficiencyCalculatorProps) {
  const copy = { ...DEFAULT_COPY, ...content };
  const [inputs, setInputs] = useState<EfficiencyInputs>(EFFICIENCY_DEFAULTS);
  const prominent = variant === "prominent";

  const results = useMemo(() => calculateEfficiency(inputs), [inputs]);

  const update = (patch: Partial<EfficiencyInputs>) =>
    setInputs((prev) => ({ ...prev, ...patch }));

  return (
    <div
      className={`relative flex h-full flex-col overflow-hidden rounded-2xl border border-primary/20 bg-surface shadow-xl shadow-primary/8 ${className}`}
    >
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl"
        aria-hidden
      />

      <div className="relative border-b border-border bg-gradient-to-r from-primary/8 via-background to-background px-5 py-4 sm:px-6 sm:py-5">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <Sparkles size={18} aria-hidden />
          </span>
          <div className="min-w-0">
            <h3 className={`font-heading font-bold text-foreground ${prominent ? "text-xl sm:text-2xl" : "text-lg"}`}>
              {copy.heading}
            </h3>
            {copy.description ? (
              <p
                className={`mt-1 font-body leading-relaxed text-muted-foreground ${
                  prominent ? "text-sm sm:text-base" : "text-xs"
                }`}
              >
                {copy.description}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <div
        className={`relative grid flex-1 grid-cols-1 sm:grid-cols-2 ${
          prominent ? "gap-3 p-5 sm:gap-4 sm:p-6" : "gap-2.5 p-3 sm:gap-x-4 sm:gap-y-2.5 sm:p-4"
        }`}
      >
        <SliderField
          id="efficiency-team-size"
          label="Team on repetitive work"
          value={inputs.teamSize}
          min={EFFICIENCY_LIMITS.teamSize.min}
          max={EFFICIENCY_LIMITS.teamSize.max}
          large={prominent}
          onChange={(teamSize) => update({ teamSize })}
        />
        <SliderField
          id="efficiency-hours"
          label="Manual hours / person / week"
          value={inputs.hoursPerWeek}
          min={EFFICIENCY_LIMITS.hoursPerWeek.min}
          max={EFFICIENCY_LIMITS.hoursPerWeek.max}
          large={prominent}
          onChange={(hoursPerWeek) => update({ hoursPerWeek })}
        />
        <SliderField
          id="efficiency-rate"
          label="Average hourly cost"
          value={inputs.hourlyRate}
          min={EFFICIENCY_LIMITS.hourlyRate.min}
          max={EFFICIENCY_LIMITS.hourlyRate.max}
          step={5}
          unit="USD"
          large={prominent}
          onChange={(hourlyRate) => update({ hourlyRate })}
        />
        <SliderField
          id="efficiency-automatable"
          label="Share we can automate"
          value={inputs.automatablePercent}
          min={EFFICIENCY_LIMITS.automatablePercent.min}
          max={EFFICIENCY_LIMITS.automatablePercent.max}
          step={5}
          unit="%"
          large={prominent}
          onChange={(automatablePercent) => update({ automatablePercent })}
        />
      </div>

      <div
        className={`relative border-t border-border bg-primary/5 ${prominent ? "px-5 py-5 sm:px-6" : "px-3 py-3 sm:px-4"}`}
        aria-live="polite"
        aria-atomic="true"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <EfficiencyRing percent={results.efficiencyGain} />

          <dl className="grid min-w-0 flex-1 grid-cols-3 gap-2 sm:gap-3">
            <div className="rounded-xl border border-border bg-background px-2 py-2.5 text-center sm:px-3 sm:py-3">
              <dt className="font-body text-[0.65rem] font-semibold uppercase tracking-wide text-muted-foreground">
                Hrs / wk
              </dt>
              <dd className={`mt-1 font-heading font-bold text-foreground ${prominent ? "text-xl" : "text-sm"}`}>
                <AnimatedValue value={formatHours(results.hoursSavedWeek)} />
              </dd>
            </div>
            <div className="rounded-xl border border-border bg-background px-2 py-2.5 text-center sm:px-3 sm:py-3">
              <dt className="font-body text-[0.65rem] font-semibold uppercase tracking-wide text-muted-foreground">
                Hrs / yr
              </dt>
              <dd className={`mt-1 font-heading font-bold text-foreground ${prominent ? "text-xl" : "text-sm"}`}>
                <AnimatedValue value={formatHours(results.hoursSavedYear)} />
              </dd>
            </div>
            <div className="rounded-xl border border-primary/30 bg-primary/12 px-2 py-2.5 text-center sm:px-3 sm:py-3">
              <dt className="font-body text-[0.65rem] font-semibold uppercase tracking-wide text-primary">
                Saved
              </dt>
              <dd
                className={`mt-1 font-heading font-bold leading-tight text-foreground ${prominent ? "text-lg" : "text-sm"}`}
              >
                <AnimatedValue value={formatCurrency(results.annualSavings)} />
              </dd>
            </div>
          </dl>
        </div>

        <CalendlyBookButton
          className={`mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary font-body font-bold text-white shadow-[0_8px_32px_rgba(34,197,94,0.32)] transition-all hover:scale-[1.01] hover:bg-primary-dark active:scale-[0.99] ${
            prominent ? "px-6 py-3.5 text-sm sm:text-base" : "px-4 py-2 text-xs"
          }`}
        >
          {copy.ctaLabel}
          <ArrowRight size={prominent ? 16 : 13} aria-hidden />
        </CalendlyBookButton>

        {copy.disclaimer ? (
          <p className={`mt-3 font-body leading-snug text-muted-foreground ${prominent ? "text-xs" : "text-[0.6rem] line-clamp-2"}`}>
            {copy.disclaimer}
          </p>
        ) : null}
      </div>
    </div>
  );
}
