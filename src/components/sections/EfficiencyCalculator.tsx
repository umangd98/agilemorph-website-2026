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

function AnimatedValue({
  value,
  className = "",
}: {
  value: string | number;
  className?: string;
}) {
  return (
    <span
      key={value}
      className={`animate-efficiency-pop inline-block ${className}`}
    >
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
        <span className="font-heading text-foreground text-2xl leading-none font-extrabold">
          <AnimatedValue value={percent} />
          <span className="text-primary text-lg">%</span>
        </span>
        <span className="font-body text-muted-foreground mt-0.5 text-[0.6rem] font-semibold tracking-wide uppercase">
          assumed
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
    <div className="border-border/80 bg-background/80 focus-within:border-primary/30 focus-within:bg-background min-w-0 rounded-xl border p-3 transition-colors">
      <div className="mb-2 flex items-baseline justify-between gap-2">
        <label
          htmlFor={id}
          className={`font-body text-foreground leading-snug font-semibold ${large ? "text-sm" : "text-xs"}`}
        >
          {label}
        </label>
        <span
          className={`font-heading text-primary shrink-0 font-bold ${large ? "text-sm" : "text-xs"}`}
        >
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
  heading: "Estimate the value of time released",
  description:
    "Adjust the sliders to see how much manual work AI automation could take off your team’s plate.",
  disclaimer:
    "Illustrative value based on your inputs. Excludes implementation and running costs, adoption, and realized cash savings.",
  ctaLabel: "Book A Discovery Call",
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
      className={`border-primary/20 bg-surface shadow-primary/8 relative flex h-full flex-col overflow-hidden rounded-2xl border shadow-xl ${className}`}
    >
      <div
        className="bg-primary/10 pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full blur-3xl"
        aria-hidden
      />

      <div className="border-border from-primary/8 via-background to-background relative border-b bg-gradient-to-r px-5 py-4 sm:px-6 sm:py-5">
        <div className="flex items-start gap-3">
          <span className="bg-primary/15 text-primary mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl">
            <Sparkles size={18} aria-hidden />
          </span>
          <div className="min-w-0">
            <h3
              className={`font-heading text-foreground font-bold ${prominent ? "text-xl sm:text-2xl" : "text-lg"}`}
            >
              {copy.heading}
            </h3>
            {copy.description ? (
              <p
                className={`font-body text-muted-foreground mt-1 leading-relaxed ${
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
          prominent
            ? "gap-3 p-5 sm:gap-4 sm:p-6"
            : "gap-2.5 p-3 sm:gap-x-4 sm:gap-y-2.5 sm:p-4"
        }`}
      >
        <SliderField
          id="efficiency-team-size"
          label="Team On Repetitive Work"
          value={inputs.teamSize}
          min={EFFICIENCY_LIMITS.teamSize.min}
          max={EFFICIENCY_LIMITS.teamSize.max}
          large={prominent}
          onChange={(teamSize) => update({ teamSize })}
        />
        <SliderField
          id="efficiency-hours"
          label="Manual Hours / Person / Week"
          value={inputs.hoursPerWeek}
          min={EFFICIENCY_LIMITS.hoursPerWeek.min}
          max={EFFICIENCY_LIMITS.hoursPerWeek.max}
          large={prominent}
          onChange={(hoursPerWeek) => update({ hoursPerWeek })}
        />
        <SliderField
          id="efficiency-rate"
          label="Average Hourly Cost"
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
          label="Assumed Share Automatable"
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
        className={`border-border bg-primary/5 relative border-t ${prominent ? "px-5 py-5 sm:px-6" : "px-3 py-3 sm:px-4"}`}
        aria-live="polite"
        aria-atomic="true"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <EfficiencyRing percent={results.efficiencyGain} />

          <dl className="grid min-w-0 flex-1 grid-cols-3 gap-2 sm:gap-3">
            <div className="border-border bg-background rounded-xl border px-2 py-2.5 text-center sm:px-3 sm:py-3">
              <dt className="font-body text-muted-foreground text-[0.65rem] font-semibold tracking-wide uppercase">
                Hrs / wk
              </dt>
              <dd
                className={`font-heading text-foreground mt-1 font-bold ${prominent ? "text-xl" : "text-sm"}`}
              >
                <AnimatedValue value={formatHours(results.hoursSavedWeek)} />
              </dd>
            </div>
            <div className="border-border bg-background rounded-xl border px-2 py-2.5 text-center sm:px-3 sm:py-3">
              <dt className="font-body text-muted-foreground text-[0.65rem] font-semibold tracking-wide uppercase">
                Hrs / yr
              </dt>
              <dd
                className={`font-heading text-foreground mt-1 font-bold ${prominent ? "text-xl" : "text-sm"}`}
              >
                <AnimatedValue value={formatHours(results.hoursSavedYear)} />
              </dd>
            </div>
            <div className="border-primary/30 bg-primary/12 rounded-xl border px-2 py-2.5 text-center sm:px-3 sm:py-3">
              <dt className="font-body text-primary text-[0.65rem] font-semibold tracking-wide uppercase">
                Estimated annual value of time released
              </dt>
              <dd
                className={`font-heading text-foreground mt-1 leading-tight font-bold ${prominent ? "text-lg" : "text-sm"}`}
              >
                <AnimatedValue value={formatCurrency(results.annualSavings)} />
              </dd>
            </div>
          </dl>
        </div>

        <CalendlyBookButton
          className={`bg-signal font-body text-bg mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full font-bold shadow-[0_8px_32px_rgba(34,197,94,0.32)] transition-all hover:scale-[1.01] hover:opacity-90 active:scale-[0.99] ${
            prominent ? "px-6 py-3.5 text-sm sm:text-base" : "px-4 py-2 text-xs"
          }`}
        >
          {copy.ctaLabel}
          <ArrowRight size={prominent ? 16 : 13} aria-hidden />
        </CalendlyBookButton>

        {copy.disclaimer ? (
          <p
            className={`font-body text-muted-foreground mt-3 leading-snug ${prominent ? "text-xs" : "line-clamp-2 text-[0.6rem]"}`}
          >
            {copy.disclaimer}
          </p>
        ) : null}
      </div>
    </div>
  );
}
