export interface CalculatorInputs {
  currentAge: number;
  retirementAge: number;
  lifeExpectancy: number;
  currentSavings: number;
  monthlySpending: number;
  expectedReturnPercent: number;
  inflationPercent: number;
}

export interface ProjectionPoint {
  monthIndex: number;
  age: number;
  balance: number;
  spending: number;
}

export interface ProjectionResult {
  series: ProjectionPoint[];
  depletionAge: number | null;
  depletionMonthIndex: number | null;
  finalBalance: number;
  inputs: CalculatorInputs;
}

export interface ScenarioResult {
  label: string;
  depletionAge: number | null;
  finalBalance: number;
  extendsByYears?: number;
}
