import { NextResponse } from "next/server";
import { calculatorSchema } from "@/lib/validation";
import { runProjection } from "@/lib/projection";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = calculatorSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const result = runProjection(parsed.data);
    return NextResponse.json(result);
  } catch (e) {
    console.error("Projection error:", e);
    return NextResponse.json(
      { error: "Failed to run projection" },
      { status: 500 }
    );
  }
}
