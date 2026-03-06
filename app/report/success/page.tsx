"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/Header";

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const downloadUrl = sessionId
    ? `/api/report/download?session_id=${encodeURIComponent(sessionId)}`
    : null;

  return (
    <>
      <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-primary-600">
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
        Thank you for your purchase
      </h1>
      <p className="mt-2 text-slate-600">
        Your Retirement Strategy Report is ready to download.
      </p>
      {downloadUrl ? (
        <a
          href={downloadUrl}
          download="retirement-strategy-report.pdf"
          className="btn-primary mt-8"
        >
          Download PDF Report
        </a>
      ) : (
        <p className="mt-6 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800">
          No session ID. If you just completed payment, try opening this page
          again from the link in your confirmation.
        </p>
      )}
      <p className="mt-10">
        <Link href="/" className="text-sm font-medium text-primary-600 hover:text-primary-700 hover:underline">
          ← Back to calculator
        </Link>
      </p>
    </>
  );
}

export default function ReportSuccessPage() {
  return (
    <div className="min-h-screen bg-slate-50/80">
      <Header />
      <main className="mx-auto max-w-lg px-4 py-16 text-center sm:px-6">
        <div className="card card-elevated mx-auto max-w-md p-8 sm:p-10">
          <Suspense fallback={<p className="text-slate-600">Loading…</p>}>
            <SuccessContent />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
