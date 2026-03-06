"use client";

import { useState, useRef } from "react";
import { CalculatorForm } from "@/components/CalculatorForm";
import { ProjectionChart } from "@/components/ProjectionChart";
import { ScenarioCards } from "@/components/ScenarioCards";
import { Header } from "@/components/Header";
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
    <div className="min-h-screen bg-slate-50/80">
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Retirement Savings Calculator
          </h1>
          <p className="mt-2 text-lg text-slate-600">
            See how long your savings will last in retirement with a monthly projection model.
          </p>
        </div>

        <section className="card card-elevated mb-10 p-6 sm:p-8">
          <h2 className="mb-6 text-xl font-semibold text-slate-900">
            Your details
          </h2>
          <CalculatorForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </section>

        {result && (
          <div ref={resultsRef} className="space-y-8">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Your projection
            </h2>

            <section className="card p-6 sm:p-8">
              <div
                className={
                  result.depletionAge != null
                    ? "rounded-xl border border-amber-200 bg-amber-50/80 px-5 py-4"
                    : "rounded-xl border border-primary-200 bg-primary-50/80 px-5 py-4"
                }
              >
                {result.depletionAge != null ? (
                  <p className="text-slate-800">
                    <span className="font-semibold">Projected depletion age: {result.depletionAge}</span>
                    {" "}— savings run out before life expectancy. Consider the improvement scenarios below.
                  </p>
                ) : (
                  <p className="text-slate-800">
                    <span className="font-semibold">Savings last through life expectancy.</span>
                    {" "}Projected balance at age {result.inputs.lifeExpectancy}: $
                    {result.finalBalance.toLocaleString(undefined, { maximumFractionDigits: 0 })}.
                  </p>
                )}
              </div>
            </section>

            <section className="card p-6 sm:p-8">
              <ProjectionChart result={result} />
            </section>

            <section className="card p-6 sm:p-8">
              <ScenarioCards baseResult={result} />
            </section>

            <section className="card-elevated overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    Retirement Strategy Report
                  </h3>
                  <p className="mt-1 text-slate-600">
                    PDF summary with your inputs, projection chart, improvement strategies, and risk summary.
                  </p>
                  <p className="mt-2 text-sm font-semibold text-slate-700">
                    $29 one-time
                  </p>
                </div>
                <ReportButton result={result} />
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
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
      className="btn-primary shrink-0"
    >
      {loading ? "Redirecting…" : "Get PDF Report — $29"}
    </button>
  );
}
