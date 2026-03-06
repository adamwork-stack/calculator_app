"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { ProjectionResult } from "@/lib/types";

interface ProjectionChartProps {
  result: ProjectionResult;
  className?: string;
}

export function ProjectionChart({ result, className = "" }: ProjectionChartProps) {
  const data = result.series.filter((_, i) => i % 12 === 0).map((p) => ({
    age: p.age,
    balance: Math.round(p.balance),
    spending: Math.round(p.spending),
  }));

  return (
    <div className={className}>
      <h3 className="text-lg font-semibold text-slate-800 mb-2">
        Savings over time
      </h3>
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="age"
              type="number"
              domain={["dataMin", "dataMax"]}
              tickFormatter={(v) => `${Math.round(v)}`}
              stroke="#64748b"
            />
            <YAxis
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
              stroke="#64748b"
            />
            <Tooltip
              formatter={(value: number) => [`$${value.toLocaleString()}`, "Balance"]}
              labelFormatter={(label) => `Age ${label}`}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="balance"
              name="Savings balance"
              stroke="#0f766e"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
