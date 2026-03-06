"use client";

import { useState } from "react";
import type { CalculatorInputs } from "@/lib/types";

const defaultInputs: CalculatorInputs = {
  currentAge: 45,
  retirementAge: 65,
  lifeExpectancy: 90,
  currentSavings: 500000,
  monthlySpending: 4000,
  expectedReturnPercent: 6,
  inflationPercent: 3,
};

interface CalculatorFormProps {
  onSubmit: (inputs: CalculatorInputs) => void;
  isSubmitting?: boolean;
}

type FieldConfig = {
  key: keyof CalculatorInputs;
  label: string;
  min: number;
  max?: number;
  step?: number;
};

const fieldGroups: { title: string; fields: FieldConfig[] }[] = [
  {
    title: "Age & timeline",
    fields: [
      { key: "currentAge", label: "Current age", min: 18, max: 100 },
      { key: "retirementAge", label: "Retirement age", min: 40, max: 100 },
      { key: "lifeExpectancy", label: "Life expectancy", min: 50, max: 120 },
    ],
  },
  {
    title: "Savings & spending",
    fields: [
      { key: "currentSavings", label: "Current savings ($)", min: 0, step: 1000 },
      { key: "monthlySpending", label: "Monthly spending ($)", min: 0, step: 100 },
    ],
  },
  {
    title: "Assumptions",
    fields: [
      { key: "expectedReturnPercent", label: "Expected return (%/year)", min: -10, max: 30, step: 0.5 },
      { key: "inflationPercent", label: "Inflation (%/year)", min: 0, max: 20, step: 0.5 },
    ],
  },
];

export function CalculatorForm({ onSubmit, isSubmitting }: CalculatorFormProps) {
  const [inputs, setInputs] = useState<CalculatorInputs>(defaultInputs);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const update = (key: keyof CalculatorInputs, value: number) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    try {
      const res = await fetch("/api/project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inputs),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.details?.fieldErrors) {
          const fieldErrors: Record<string, string> = {};
          for (const [k, v] of Object.entries(data.details.fieldErrors)) {
            fieldErrors[k] = (v as string[])?.[0] ?? "Invalid";
          }
          setErrors(fieldErrors);
        } else {
          setErrors({ form: data.error ?? "Something went wrong" });
        }
        return;
      }
      onSubmit({ ...inputs, ...data.inputs });
    } catch {
      setErrors({ form: "Network error. Please try again." });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {errors.form && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {errors.form}
        </div>
      )}
      {fieldGroups.map((group) => (
        <div key={group.title}>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500">
            {group.title}
          </h3>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {group.fields.map((field) => (
              <label key={field.key} className="block">
                <span className="mb-1.5 block text-sm font-medium text-slate-700">
                  {field.label}
                </span>
                <input
                  type="number"
                  min={field.min}
                  max={field.max}
                  step={field.step ?? 1}
                  value={inputs[field.key]}
                  onChange={(e) => update(field.key, Number(e.target.value))}
                  className="input-base"
                />
                {errors[field.key] && (
                  <p className="mt-1 text-xs text-red-600">{errors[field.key]}</p>
                )}
              </label>
            ))}
          </div>
        </div>
      ))}
      <div className="pt-2">
        <button type="submit" disabled={isSubmitting} className="btn-primary min-w-[140px]">
          {isSubmitting ? "Calculating…" : "Calculate projection"}
        </button>
      </div>
    </form>
  );
}
