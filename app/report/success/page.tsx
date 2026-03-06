"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const downloadUrl = sessionId
    ? `/api/report/download?session_id=${encodeURIComponent(sessionId)}`
    : null;

  return (
    <>
      <h1 className="text-2xl font-bold text-slate-900 mb-2">
        Thank you for your purchase
      </h1>
      <p className="text-slate-600 mb-8">
        Your Retirement Strategy Report is ready to download.
      </p>
      {downloadUrl ? (
        <a
          href={downloadUrl}
          download="retirement-strategy-report.pdf"
          className="inline-block px-6 py-3 bg-emerald-600 text-white font-medium rounded-md hover:bg-emerald-700"
        >
          Download PDF Report
        </a>
      ) : (
        <p className="text-amber-700">
          No session ID. If you just completed payment, try opening this page
          again from the link in your confirmation.
        </p>
      )}
      <p className="mt-8">
        <Link href="/" className="text-slate-600 underline hover:text-slate-800">
          Back to calculator
        </Link>
      </p>
    </>
  );
}

export default function ReportSuccessPage() {
  return (
    <main className="min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg mx-auto text-center">
        <Suspense fallback={<p className="text-slate-600">Loading…</p>}>
          <SuccessContent />
        </Suspense>
      </div>
    </main>
  );
}
