# Retirement Savings Calculator

A Next.js app that projects how long your savings will last in retirement, with improvement scenarios and an optional paid PDF report via Stripe.

## Features

- **Calculator**: Current age, retirement age, life expectancy, savings, monthly spending, expected return %, inflation %.
- **Results**: Projection chart (Recharts), depletion age, and improvement scenarios (reduce spending, delay retirement, higher return).
- **Payment**: Stripe Checkout for a $29 Retirement Strategy Report.
- **PDF**: Generated on-demand after payment (inputs, projection table, scenarios, risk summary).

## Setup

1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env.local` and set:
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET` (for webhooks; optional for local PDF download)
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - `STRIPE_PRICE_ID` (Stripe Price ID for a $29 one-time product)
3. Create a $29 one-time product in [Stripe Dashboard](https://dashboard.stripe.com/products) and use its Price ID.

## Run

- Dev: `npm run dev`
- Build: `npm run build`
- Start: `npm start`

## Deploy (Vercel)

1. Connect the repo to Vercel.
2. Add the same env vars in Project Settings.
3. In Stripe Dashboard, set the webhook endpoint to `https://<your-app>.vercel.app/api/webhooks/stripe` and use the signing secret for `STRIPE_WEBHOOK_SECRET`.

## Project structure

- `app/page.tsx` – Calculator form and results (chart, scenarios, “Get PDF Report”).
- `app/report/success/page.tsx` – Post-checkout page with PDF download link.
- `app/api/project/route.ts` – POST; runs projection.
- `app/api/checkout/route.ts` – POST; creates Stripe Checkout session (metadata: report inputs).
- `app/api/webhooks/stripe/route.ts` – Stripe webhook handler.
- `app/api/report/download/route.ts` – GET; verifies session and returns PDF.
- `lib/projection.ts` – Monthly projection logic.
- `lib/validation.ts` – Zod schema for inputs.
- `lib/pdf/ReportDocument.tsx` – PDF layout (@react-pdf/renderer).
