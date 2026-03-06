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
      <h3 className="text-lg font-semibold text-slate-800 mb-3">
        Improvement scenarios
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {scenarios.map((s) => (
          <div
            key={s.label}
            className="p-4 rounded-lg border border-slate-200 bg-white shadow-sm"
          >
            <p className="font-medium text-slate-700 text-sm">{s.label}</p>
            {s.depletionAge != null ? (
              <p className="mt-1 text-slate-600 text-sm">
                Savings last until age{" "}
                <span className="font-semibold">{s.depletionAge}</span>
                {s.extendsByYears != null && s.extendsByYears > 0 && (
                  <span className="text-emerald-600">
                    {" "}(+{s.extendsByYears} years)
                  </span>
                )}
              </p>
            ) : (
              <p className="mt-1 text-slate-600 text-sm">
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
