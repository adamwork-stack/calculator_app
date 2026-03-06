"use client";

import { useMemo } from "react";
import { runProjection } from "@/lib/projection";
import type { CalculatorInputs, ProjectionResult, ScenarioResult } from "@/lib/types";

interface ScenarioCardsProps {
  baseResult: ProjectionResult;
  className?: string;
}

export function ScenarioCards({ baseResult, className = "" }: ScenarioCardsProps) {
  const scenarios: ScenarioResult[] = useMemo(() => {
    const base = baseResult.inputs;
    const baseDepletion = baseResult.depletionAge;
    const scenariosList: ScenarioResult[] = [];

    const reduceSpending = runProjection({
      ...base,
      monthlySpending: base.monthlySpending * 0.9,
    });
    scenariosList.push({
      label: "Reduce spending by 10%",
      depletionAge: reduceSpending.depletionAge,
      finalBalance: reduceSpending.finalBalance,
      extendsByYears:
        baseDepletion != null && reduceSpending.depletionAge != null
          ? Math.round((reduceSpending.depletionAge - baseDepletion) * 10) / 10
          : undefined,
    });

    const delayRetirement = runProjection({
      ...base,
      retirementAge: base.retirementAge + 2,
    });
    scenariosList.push({
      label: "Delay retirement by 2 years",
      depletionAge: delayRetirement.depletionAge,
      finalBalance: delayRetirement.finalBalance,
      extendsByYears:
        baseDepletion != null && delayRetirement.depletionAge != null
          ? Math.round((delayRetirement.depletionAge - baseDepletion) * 10) / 10
          : undefined,
    });

    const higherReturn = runProjection({
      ...base,
      expectedReturnPercent: base.expectedReturnPercent + 0.5,
    });
    scenariosList.push({
      label: "Investment return +0.5%",
      depletionAge: higherReturn.depletionAge,
      finalBalance: higherReturn.finalBalance,
      extendsByYears:
        baseDepletion != null && higherReturn.depletionAge != null
          ? Math.round((higherReturn.depletionAge - baseDepletion) * 10) / 10
          : undefined,
    });

    return scenariosList;
  }, [baseResult]);

  return (
    <div className={className}>
      <h3 className="mb-4 text-lg font-semibold text-slate-900">
        Improvement scenarios
      </h3>
      <p className="mb-5 text-sm text-slate-600">
        See how small changes could extend how long your savings last.
      </p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {scenarios.map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-5 transition-shadow hover:shadow-card"
          >
            <p className="font-semibold text-slate-800 text-sm">{s.label}</p>
            {s.depletionAge != null ? (
              <p className="mt-2 text-slate-600 text-sm">
                Savings last until age{" "}
                <span className="font-semibold text-slate-900">{s.depletionAge}</span>
                {s.extendsByYears != null && s.extendsByYears > 0 && (
                  <span className="ml-1 inline-flex items-center rounded-md bg-primary-100 px-1.5 py-0.5 text-xs font-medium text-primary-800">
                    +{s.extendsByYears} yrs
                  </span>
                )}
              </p>
            ) : (
              <p className="mt-2 text-slate-600 text-sm">
                Savings last through life expectancy. Final balance: $
                {s.finalBalance.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
