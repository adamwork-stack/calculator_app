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
    <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
      {errors.form && (
        <p className="text-red-600 text-sm" role="alert">
          {errors.form}
        </p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Current age</span>
          <input
            type="number"
            min={18}
            max={100}
            value={inputs.currentAge}
            onChange={(e) => update("currentAge", Number(e.target.value))}
            className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900"
          />
          {errors.currentAge && (
            <p className="text-red-600 text-xs mt-0.5">{errors.currentAge}</p>
          )}
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">
            Retirement age
          </span>
          <input
            type="number"
            min={40}
            max={100}
            value={inputs.retirementAge}
            onChange={(e) => update("retirementAge", Number(e.target.value))}
            className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900"
          />
          {errors.retirementAge && (
            <p className="text-red-600 text-xs mt-0.5">{errors.retirementAge}</p>
          )}
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">
            Life expectancy
          </span>
          <input
            type="number"
            min={50}
            max={120}
            value={inputs.lifeExpectancy}
            onChange={(e) => update("lifeExpectancy", Number(e.target.value))}
            className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900"
          />
          {errors.lifeExpectancy && (
            <p className="text-red-600 text-xs mt-0.5">{errors.lifeExpectancy}</p>
          )}
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">
            Current savings ($)
          </span>
          <input
            type="number"
            min={0}
            step={1000}
            value={inputs.currentSavings}
            onChange={(e) => update("currentSavings", Number(e.target.value))}
            className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900"
          />
          {errors.currentSavings && (
            <p className="text-red-600 text-xs mt-0.5">{errors.currentSavings}</p>
          )}
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">
            Monthly spending ($)
          </span>
          <input
            type="number"
            min={0}
            step={100}
            value={inputs.monthlySpending}
            onChange={(e) => update("monthlySpending", Number(e.target.value))}
            className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900"
          />
          {errors.monthlySpending && (
            <p className="text-red-600 text-xs mt-0.5">
              {errors.monthlySpending}
            </p>
          )}
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">
            Expected return (% per year)
          </span>
          <input
            type="number"
            min={-10}
            max={30}
            step={0.5}
            value={inputs.expectedReturnPercent}
            onChange={(e) =>
              update("expectedReturnPercent", Number(e.target.value))
            }
            className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900"
          />
          {errors.expectedReturnPercent && (
            <p className="text-red-600 text-xs mt-0.5">
              {errors.expectedReturnPercent}
            </p>
          )}
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">
            Inflation (% per year)
          </span>
          <input
            type="number"
            min={0}
            max={20}
            step={0.5}
            value={inputs.inflationPercent}
            onChange={(e) => update("inflationPercent", Number(e.target.value))}
            className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900"
          />
          {errors.inflationPercent && (
            <p className="text-red-600 text-xs mt-0.5">
              {errors.inflationPercent}
            </p>
          )}
        </label>
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full sm:w-auto px-6 py-2.5 bg-slate-800 text-white font-medium rounded-md hover:bg-slate-700 disabled:opacity-50"
      >
        {isSubmitting ? "Calculating…" : "Calculate"}
      </button>
    </form>
  );
}
