"use client";

import { useState } from "react";
import Link from "next/link";
import DemoModal from "./DemoModal";

export default function Hero() {
  const [demoOpen, setDemoOpen] = useState(false);

  return (
    <section className="relative pt-16 pb-24 px-4 sm:px-6 lg:px-8 border-b border-line bg-paper">
      <DemoModal open={demoOpen} onClose={() => setDemoOpen(false)} />

      {/* Subtle ruled lines background motif */}
      <div className="absolute inset-0 ruled-grid opacity-20 pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          
          {/* Left Column: Decisive Headline, Proportional Subhead, Direct CTAs */}
          <div className="lg:col-span-6 space-y-7">
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-brass-dark font-bold">
              <span>§ — ACADEMIC OPERATING SYSTEM</span>
            </div>

            <h1 className="font-serif text-5xl sm:text-6xl lg:text-[64px] leading-[1.06] font-bold text-ink tracking-tight">
              Run your school on one system your staff will actually use.
            </h1>

            <p className="text-lg sm:text-[19px] text-ink-muted leading-relaxed max-w-prose font-normal">
              Attendance, fees, timetables, and report cards — in one place, without retraining your whole office.
            </p>

            <div className="pt-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={() => setDemoOpen(true)}
                className="bg-ledger hover:bg-ledger-hover text-paper px-7 py-4 rounded text-sm font-semibold transition-colors cursor-pointer text-center shadow-ledger"
              >
                Book a Demo
              </button>

              <Link
                href="/demo-login"
                className="border border-line hover:border-line-dark bg-paper-light hover:bg-paper-band text-ink px-6 py-4 rounded text-sm font-semibold transition-colors text-center"
              >
                See it running (no signup)
              </Link>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono text-ink-subtle pt-1">
              <span>Setup in under a week</span>
              <span>·</span>
              <span>No app install required</span>
            </div>
          </div>

          {/* Right Column: Physical Ledger Dashboard Sheet */}
          <div className="lg:col-span-6">
            <div className="bg-paper-light border-2 border-line shadow-ledger-lift rounded overflow-hidden">
              {/* Minimal Register Header */}
              <div className="bg-paper-band px-5 py-3 border-b border-line flex items-center justify-between font-mono text-xs">
                <div className="flex items-center gap-2 font-semibold text-ink">
                  <span className="w-2 h-2 rounded-full bg-ledger" />
                  <span>app.alphaeduhub.in/admin</span>
                </div>
                <div className="text-brass-dark font-bold uppercase tracking-wider">
                  TERM II · LIVE
                </div>
              </div>

              {/* Real Dashboard Body */}
              <div className="p-6 sm:p-7 space-y-6">
                {/* Institution Title */}
                <div className="flex items-start justify-between border-b border-line pb-4">
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-ink leading-tight">St. Jude Academy</h3>
                    <p className="font-mono text-xs text-ink-muted mt-0.5">32 Classrooms · 64 Faculty on duty</p>
                  </div>
                  <span className="font-mono text-xs font-bold text-ledger bg-ledger-light px-2.5 py-1 rounded border border-ledger/25">
                    Register Sealed
                  </span>
                </div>

                {/* 4 Large Ledger Metrics with Real Typographic Jump */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-paper border border-line rounded">
                    <p className="font-mono text-[11px] text-ink-subtle uppercase font-medium">Pupils Enrolled</p>
                    <p className="font-mono text-3xl font-bold text-ink mt-1">1,248</p>
                    <p className="text-xs text-ink-muted mt-1 font-sans">Full cohort indexed</p>
                  </div>

                  <div className="p-4 bg-paper border border-line rounded">
                    <p className="font-mono text-[11px] text-ink-subtle uppercase font-medium">Attendance Today</p>
                    <p className="font-mono text-3xl font-bold text-ledger mt-1">98.4%</p>
                    <p className="text-xs text-ink-muted mt-1 font-sans">20 Absent (SMS sent)</p>
                  </div>

                  <div className="p-4 bg-paper border border-line rounded">
                    <p className="font-mono text-[11px] text-ink-subtle uppercase font-medium">Fee Ledger (Term II)</p>
                    <p className="font-mono text-3xl font-bold text-ink mt-1">$184,200</p>
                    <p className="font-mono text-xs text-ledger font-bold mt-1">91% Collected to date</p>
                  </div>

                  <div className="p-4 bg-paper border border-line rounded">
                    <p className="font-mono text-[11px] text-ink-subtle uppercase font-medium">Faculty On Duty</p>
                    <p className="font-mono text-3xl font-bold text-ink mt-1">64 / 64</p>
                    <p className="text-xs text-ink-muted mt-1 font-sans">All periods staffed</p>
                  </div>
                </div>

                {/* Real-time Register Stream */}
                <div className="border border-line rounded bg-paper p-4">
                  <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-line">
                    <span className="font-mono text-xs font-bold text-ink uppercase tracking-wide">Recent Register Actions</span>
                    <span className="font-mono text-xs text-ink-subtle">09:15 AM</span>
                  </div>

                  <div className="space-y-2 font-mono text-xs">
                    <div className="flex items-center justify-between text-ink-muted">
                      <span>Grade 8-A Roll Call closed</span>
                      <span className="text-ledger font-bold">28 Present · 1 Absent</span>
                    </div>
                    <div className="flex items-center justify-between text-ink-muted">
                      <span>Tuition Receipt #4821 issued</span>
                      <span className="text-ledger font-bold">$450.00 (Card)</span>
                    </div>
                    <div className="flex items-center justify-between text-ink-muted">
                      <span>Physics Exam Marks published</span>
                      <span className="text-ink font-semibold">Grade 10 · 34 PDFs</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}