import type { CalculatorInputs, ProjectionPoint, ProjectionResult } from "./types";

/**
 * Monthly retirement projection from current age through life expectancy.
 * - Before retirement: no spending, balance grows by investment return.
 * - After retirement: subtract inflated monthly spending, apply investment return.
 */
export function runProjection(inputs: CalculatorInputs): ProjectionResult {
  const {
    currentAge,
    retirementAge,
    lifeExpectancy,
    currentSavings,
    monthlySpending,
    expectedReturnPercent,
    inflationPercent,
  } = inputs;

  const monthlyReturn = expectedReturnPercent / 100 / 12;
  const monthlyInflation = inflationPercent / 100 / 12;
  const totalMonths = Math.max(0, (lifeExpectancy - currentAge) * 12);
  const retirementMonthIndex = Math.max(0, (retirementAge - currentAge) * 12);

  const series: ProjectionPoint[] = [];
  let balance = currentSavings;
  let spending = monthlySpending;
  let depletionMonthIndex: number | null = null;
  let depletionAge: number | null = null;

  for (let monthIndex = 0; monthIndex <= totalMonths; monthIndex++) {
    const age = currentAge + monthIndex / 12;
    const isRetired = monthIndex >= retirementMonthIndex;

    if (isRetired) {
      balance -= spending;
      spending *= 1 + monthlyInflation;
    }
    balance *= 1 + monthlyReturn;

    if (balance <= 0 && depletionMonthIndex === null) {
      depletionMonthIndex = monthIndex;
      depletionAge = age;
    }

    series.push({
      monthIndex,
      age: Math.round(age * 10) / 10,
      balance: Math.round(balance * 100) / 100,
      spending: Math.round(spending * 100) / 100,
    });
  }

  return {
    series,
    depletionAge,
    depletionMonthIndex,
    finalBalance: series[series.length - 1]?.balance ?? 0,
    inputs,
  };
}
