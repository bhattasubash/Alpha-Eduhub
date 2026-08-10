"use client";

import Link from "next/link";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
  /** Override the numeric code shown on the "browser window" graphic */
  statusCode?: number;
  /** Override the status label, e.g. "Not Found" */
  statusLabel?: string;
}

/** Generates a short, readable error ID from the digest or a timestamp fallback */
function buildErrorId(digest?: string): string {
  if (digest) return `ALPHA-${digest.slice(0, 8).toUpperCase()}`;
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `ALPHA-ERR-${rand}`;
}

function formatDateTime(): { date: string; time: string } {
  const now = new Date();
  const date = now.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const time = now.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  return { date, time };
}

export default function ErrorPage({
  error,
  reset,
  statusCode = 500,
  statusLabel = "Internal Server Error",
}: ErrorPageProps) {
  const errorId = buildErrorId(error.digest);
  const { date, time } = formatDateTime();

  return (
    <div className="min-h-screen bg-[#F0F2F8] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-md w-full max-w-xl p-8 flex flex-col items-center gap-6">

        {/* Logo */}
        <div className="w-16 h-16 rounded-xl bg-white shadow-lg flex items-center justify-center overflow-hidden">
          <img src="/logo.png" alt="Logo" className="w-12 h-12 object-contain" />
        </div>

        {/* ── Illustration ── */}
        <div className="relative w-full flex justify-center items-end gap-4 h-48 select-none">
          {/* Question-mark bubble */}
          <div className="absolute top-0 left-[18%] w-10 h-10 rounded-full bg-[#ECEAF8] flex items-center justify-center text-[#7C6FF7] font-bold text-xl shadow-sm">
            ?
          </div>

          {/* Person sitting with laptop (pure CSS / emoji stand-in) */}
          <div className="text-[90px] leading-none z-10 select-none">🧑‍💻</div>

          {/* Browser window card */}
          <div className="bg-[#F5F4FF] rounded-xl border border-[#E2DFFF] p-4 flex flex-col items-center min-w-[140px] shadow-sm">
            {/* Dots */}
            <div className="flex gap-1 mb-2 self-start">
              <span className="w-2 h-2 rounded-full bg-[#c9c5f5]" />
              <span className="w-2 h-2 rounded-full bg-[#c9c5f5]" />
              <span className="w-2 h-2 rounded-full bg-[#c9c5f5]" />
            </div>
            <span className="text-[42px] font-extrabold text-[#6366f1] leading-none">
              {statusCode}
            </span>
            <span className="text-[11px] text-[#6b7280] mt-1 text-center">
              {statusLabel}
            </span>
            {/* Warning triangle */}
            <div className="mt-3 text-[#7C6FF7] text-2xl">⚠️</div>
          </div>

          {/* Leaf / plant decoration */}
          <div className="absolute bottom-0 left-[8%] text-4xl opacity-30 select-none">
            🌿
          </div>
        </div>

        {/* ── Heading ── */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">
            Oops! Something went wrong.
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            We encountered an unexpected error.
            <br />
            Our team has been notified and is working on it.
          </p>
        </div>

        {/* ── Error info card ── */}
        <div className="w-full bg-[#F8F8FF] border border-[#E5E4F8] rounded-xl px-4 py-3 flex items-start gap-3">
          <div className="mt-0.5 w-7 h-7 rounded-full bg-[#6366f1] flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-bold">i</span>
          </div>
          <div className="text-sm text-gray-600 leading-relaxed">
            <p>
              <span className="font-semibold text-gray-700">Error ID:</span>{" "}
              {errorId}
            </p>
            <p>
              <span className="font-semibold text-gray-700">Time:</span>{" "}
              {date}&nbsp;&bull;&nbsp;{time}
            </p>
          </div>
        </div>

        {/* ── Actions ── */}
        <div className="flex flex-wrap gap-3 justify-center w-full">
          <button
            onClick={reset}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#6366f1] hover:bg-[#4f46e5] text-white rounded-lg text-sm font-medium transition-colors"
          >
            <span className="text-base">🔄</span> Try Again
          </button>
          <Link
            href="/admin"
            className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium transition-colors"
          >
            <span className="text-base">🏠</span> Go to Dashboard
          </Link>
          <a
            href="mailto:support@alphaedu.com"
            className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium transition-colors"
          >
            <span className="text-base">🎧</span> Contact Support
          </a>
        </div>

        {/* ── Tip ── */}
        <p className="text-xs text-gray-400 text-center">
          <span className="text-[#6366f1]">💡</span>{" "}
          <span className="font-semibold text-gray-500">Tip:</span> If the
          problem persists, please contact support with the Error ID above.
        </p>
      </div>
    </div>
  );
}
