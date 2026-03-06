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
  Area,
  ComposedChart,
} from "recharts";
import type { ProjectionResult } from "@/lib/types";

interface ProjectionChartProps {
  result: ProjectionResult;
  className?: string;
}

const CHART_COLORS = {
  grid: "#e2e8f0",
  axis: "#64748b",
  line: "#0d9488",
  areaFill: "rgba(13, 148, 136, 0.08)",
};

export function ProjectionChart({ result, className = "" }: ProjectionChartProps) {
  const data = result.series.filter((_, i) => i % 12 === 0).map((p) => ({
    age: p.age,
    balance: Math.round(p.balance),
    spending: Math.round(p.spending),
  }));

  return (
    <div className={className}>
      <h3 className="mb-4 text-lg font-semibold text-slate-900">
        Savings over time
      </h3>
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 8, right: 24, left: 0, bottom: 8 }}>
            <defs>
              <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={CHART_COLORS.line} stopOpacity={0.3} />
                <stop offset="100%" stopColor={CHART_COLORS.line} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} vertical={false} />
            <XAxis
              dataKey="age"
              type="number"
              domain={["dataMin", "dataMax"]}
              tickFormatter={(v) => `${Math.round(v)}`}
              stroke={CHART_COLORS.axis}
              tick={{ fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
              stroke={CHART_COLORS.axis}
              tick={{ fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={48}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "0.5rem",
                border: "1px solid #e2e8f0",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.08)",
              }}
              formatter={(value: number) => [`$${value.toLocaleString()}`, "Balance"]}
              labelFormatter={(label) => `Age ${label}`}
            />
            <Legend
              wrapperStyle={{ paddingTop: "8px" }}
              formatter={() => <span className="text-sm text-slate-600">Savings balance</span>}
            />
            <Area
              type="monotone"
              dataKey="balance"
              fill="url(#balanceGradient)"
              stroke="none"
            />
            <Line
              type="monotone"
              dataKey="balance"
              name="Savings balance"
              stroke={CHART_COLORS.line}
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 4, fill: "white", stroke: CHART_COLORS.line, strokeWidth: 2 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
