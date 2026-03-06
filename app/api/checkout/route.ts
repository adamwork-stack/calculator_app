import { NextResponse } from "next/server";
import { stripe, getStripePriceId } from "@/lib/stripe";

export async function POST(request: Request) {
  const priceId = getStripePriceId();
  if (!stripe || !priceId) {
    return NextResponse.json(
      { error: "Stripe is not configured" },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();
    const reportData = body.reportData as {
      inputs: Record<string, number>;
      depletionAge: number | null;
      finalBalance: number;
      seriesSummary?: { age: number; balance: number }[];
    } | undefined;

    const metadata: Record<string, string> = {};
    if (reportData) {
      metadata.reportData = JSON.stringify({
        inputs: reportData.inputs,
        depletionAge: reportData.depletionAge,
        finalBalance: reportData.finalBalance,
      });
    }

    const origin = request.headers.get("origin") || "http://localhost:3000";
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/report/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/`,
      metadata,
    });

    return NextResponse.json({ url: session.url });
  } catch (e) {
    console.error("Checkout error:", e);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
