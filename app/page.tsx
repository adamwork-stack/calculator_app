"use client";

import { useState, useRef } from "react";
import { CalculatorForm } from "@/components/CalculatorForm";
import { ProjectionChart } from "@/components/ProjectionChart";
import { ScenarioCards } from "@/components/ScenarioCards";
import type { CalculatorInputs, ProjectionResult } from "@/lib/types";

export default function Home() {
  const [result, setResult] = useState<ProjectionResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (inputs: CalculatorInputs) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inputs),
      });
      const data: ProjectionResult = await res.json();
      if (res.ok) {
        setResult(data);
        resultsRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          Retirement Savings Calculator
        </h1>
        <p className="text-slate-600 mb-8">
          See how long your savings will last in retirement.
        </p>

        <CalculatorForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />

        {result && (
          <div ref={resultsRef} className="mt-12 pt-8 border-t border-slate-200">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">
              Your projection
            </h2>

            <div className="mb-6 p-4 rounded-lg bg-slate-50 border border-slate-200">
              {result.depletionAge != null ? (
                <p className="text-slate-700">
                  <span className="font-semibold">Projected depletion age:</span>{" "}
                  {result.depletionAge} — savings run out before life expectancy.
                </p>
              ) : (
                <p className="text-slate-700">
                  <span className="font-semibold">Savings last through life expectancy.</span>{" "}
                  Projected balance at age {result.inputs.lifeExpectancy}: $
                  {result.finalBalance.toLocaleString(undefined, {
                    maximumFractionDigits: 0,
                  })}
                </p>
              )}
            </div>

            <ProjectionChart result={result} className="mb-8" />
            <ScenarioCards baseResult={result} className="mb-8" />

            <div className="p-4 rounded-lg border-2 border-slate-300 bg-white">
              <p className="font-medium text-slate-800 mb-2">
                Get your Retirement Strategy Report
              </p>
              <p className="text-slate-600 text-sm mb-4">
                PDF summary of your inputs, projection chart, improvement strategies, and risk summary — $29.
              </p>
              <ReportButton result={result} />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

function ReportButton({ result }: { result: ProjectionResult }) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reportData: {
            inputs: result.inputs,
            depletionAge: result.depletionAge,
            finalBalance: result.finalBalance,
            seriesSummary: result.series
              .filter((_, i) => i % 12 === 0)
              .map((p) => ({ age: p.age, balance: p.balance })),
          },
        }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else throw new Error(data.error ?? "Checkout failed");
    } catch (e) {
      console.error(e);
      alert("Could not start checkout. Check the console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className="px-5 py-2.5 bg-emerald-600 text-white font-medium rounded-md hover:bg-emerald-700 disabled:opacity-50"
    >
      {loading ? "Redirecting…" : "Get PDF Report ($29)"}
    </button>
  );
}
