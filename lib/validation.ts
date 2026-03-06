import { z } from "zod";

export const calculatorSchema = z.object({
  currentAge: z.coerce.number().min(18).max(100),
  retirementAge: z.coerce.number().min(40).max(100),
  lifeExpectancy: z.coerce.number().min(50).max(120),
  currentSavings: z.coerce.number().min(0),
  monthlySpending: z.coerce.number().min(0),
  expectedReturnPercent: z.coerce.number().min(-10).max(30),
  inflationPercent: z.coerce.number().min(0).max(20),
}).refine(
  (data) => data.retirementAge >= data.currentAge,
  { message: "Retirement age must be >= current age", path: ["retirementAge"] }
).refine(
  (data) => data.lifeExpectancy > data.retirementAge,
  { message: "Life expectancy must be after retirement age", path: ["lifeExpectancy"] }
);

export type CalculatorSchema = z.infer<typeof calculatorSchema>;
