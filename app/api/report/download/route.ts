import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { runProjection } from "@/lib/projection";
import type { CalculatorInputs } from "@/lib/types";
import { ReportDocument, type ReportData } from "@/lib/pdf/ReportDocument";
import { renderToBuffer } from "@react-pdf/renderer";
import React from "react";

export async function GET(request: Request) {
  if (!stripe) {
    return NextResponse.json(
      { error: "Stripe not configured" },
      { status: 503 }
    );
  }

  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("session_id");
  if (!sessionId) {
    return NextResponse.json(
      { error: "Missing session_id" },
      { status: 400 }
    );
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: [],
    });

    if (session.payment_status !== "paid") {
      return NextResponse.json(
        { error: "Payment not completed" },
        { status: 402 }
      );
    }

    const raw = session.metadata?.reportData;
    if (!raw) {
      return NextResponse.json(
        { error: "No report data for this session" },
        { status: 400 }
      );
    }

    const parsed = JSON.parse(raw) as {
      inputs: CalculatorInputs;
      depletionAge: number | null;
      finalBalance: number;
    };
    const inputs = parsed.inputs;

    const result = runProjection(inputs);
    const seriesSummary = result.series
      .filter((_, i) => i % 12 === 0)
      .map((p) => ({ age: p.age, balance: p.balance }));

    const baseDepletion = result.depletionAge;
    const scenarios = [
      {
        label: "Reduce spending by 10%",
        ...runScenario(baseDepletion, runProjection({ ...inputs, monthlySpending: inputs.monthlySpending * 0.9 })),
      },
      {
        label: "Delay retirement by 2 years",
        ...runScenario(baseDepletion, runProjection({ ...inputs, retirementAge: inputs.retirementAge + 2 })),
      },
      {
        label: "Investment return +0.5%",
        ...runScenario(baseDepletion, runProjection({ ...inputs, expectedReturnPercent: inputs.expectedReturnPercent + 0.5 })),
      },
    ];

    const reportData: ReportData = {
      inputs,
      depletionAge: result.depletionAge,
      finalBalance: result.finalBalance,
      seriesSummary,
      scenarios,
    };

    const buffer = await renderToBuffer(
      React.createElement(ReportDocument, { data: reportData }) as React.ReactElement
    );

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="retirement-strategy-report.pdf"',
      },
    });
  } catch (e) {
    console.error("Report download error:", e);
    return NextResponse.json(
      { error: "Failed to generate report" },
      { status: 500 }
    );
  }
}

function runScenario(
  baseDepletion: number | null,
  result: { depletionAge: number | null; finalBalance: number }
) {
  const extendsByYears =
    baseDepletion != null && result.depletionAge != null
      ? Math.round((result.depletionAge - baseDepletion) * 10) / 10
      : undefined;
  return {
    depletionAge: result.depletionAge,
    finalBalance: result.finalBalance,
    extendsByYears,
  };
}
