"use client";

import { useState } from "react";
import Link from "next/link";

export default function Footer() {
  const [modalType, setModalType] = useState<"terms" | "privacy" | null>(null);

  return (
    <footer className="bg-paper text-ink-muted py-14 px-4 sm:px-6 lg:px-8 font-sans text-xs">
      {/* Lightbox Modal for Terms / Privacy */}
      {modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-xs">
          <div className="bg-paper-light border border-line rounded max-w-xl w-full p-6 sm:p-8 max-h-[85vh] overflow-y-auto scrollbar-clean shadow-ledger text-ink">
            <div className="flex items-center justify-between border-b border-line pb-3 mb-4">
              <h3 className="font-serif text-lg font-bold text-ink">
                {modalType === "terms" ? "Terms of Service & SLA" : "Data Privacy & Security Policy"}
              </h3>
              <button
                onClick={() => setModalType(null)}
                className="text-xs font-mono font-semibold px-2 py-1 rounded bg-paper border border-line hover:bg-paper-dark cursor-pointer"
              >
                Close ✕
              </button>
            </div>

            {modalType === "terms" ? (
              <div className="space-y-3.5 text-xs leading-relaxed text-ink-muted">
                <p className="font-semibold text-ink font-sans">1. 99.9% Uptime Commitment</p>
                <p>Alpha EduHub maintains high-availability operational status during school hours across all client institutions.</p>
                <p className="font-semibold text-ink font-sans">2. Absolute Data Ownership</p>
                <p>Every student record, fee entry, exam grade, and timetable remains the exclusive legal property of your school. You can export complete datasets at any time.</p>
                <p className="font-semibold text-ink font-sans">3. Transparent Billing</p>
                <p>Annual plans have zero setup charges and zero per-feature add-on fees.</p>
              </div>
            ) : (
              <div className="space-y-3.5 text-xs leading-relaxed text-ink-muted">
                <p className="font-semibold text-ink font-sans">1. Student Privacy Standards</p>
                <p>We comply with strict educational privacy regulations. Student data is never sold, licensed, or shared with commercial advertising entities.</p>
                <p className="font-semibold text-ink font-sans">2. Storage &amp; Encryption</p>
                <p>Data is stored in isolated tenant partitions and encrypted at rest and in transit via TLS.</p>
                <p className="font-semibold text-ink font-sans">3. Complete Export Portability</p>
                <p>School administrators can download complete cohort archives in standard CSV format at any time.</p>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-8 border-b border-line">
          <div>
            <span className="font-serif text-lg font-bold text-ink">Alpha EduHub</span>
            <p className="font-mono text-[11px] text-ink-subtle mt-0.5">School Management Operating System</p>
          </div>

          <div className="flex flex-wrap items-center gap-6 font-medium text-ink-muted">
            <Link href="#features" className="hover:text-ledger transition-colors">Features</Link>
            <Link href="#roles" className="hover:text-ledger transition-colors">Roles</Link>
            <Link href="#pricing" className="hover:text-ledger transition-colors">Pricing</Link>
            <Link href="#faq" className="hover:text-ledger transition-colors">FAQ</Link>
            <Link href="/sign-in" className="hover:text-ledger transition-colors">Sign In</Link>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono text-[11px] text-ink-subtle">
          <div>
            © {new Date().getFullYear()} Alpha EduHub. Domain verified: <span className="text-ink font-medium">alphaeduhub.in</span>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={() => setModalType("terms")} className="hover:text-ink transition-colors cursor-pointer underline">
              Terms of Service
            </button>
            <span>·</span>
            <button onClick={() => setModalType("privacy")} className="hover:text-ink transition-colors cursor-pointer underline">
              Privacy Policy
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
