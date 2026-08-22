"use client";

import { useState } from "react";
import Link from "next/link";
import DemoModal from "./DemoModal";

export default function Hero() {
  const [demoOpen, setDemoOpen] = useState(false);

  return (
    <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 border-b border-line bg-paper">
      <DemoModal open={demoOpen} onClose={() => setDemoOpen(false)} />

      {/* Subtle ruled lines background motif */}
      <div className="absolute inset-0 ruled-grid opacity-30 pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          
          {/* Left Column: Headline, Subhead, CTAs */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-block font-mono text-[11px] uppercase tracking-widest text-brass border-b border-brass/50 pb-0.5">
              School Management System
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-[56px] leading-[1.12] font-bold text-ink tracking-tight">
              Run your school on one system your staff will actually use.
            </h1>

            <p className="text-lg text-ink-muted leading-relaxed max-w-xl font-normal">
              Attendance, fees, timetables, and report cards — in one place, without retraining your whole office.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={() => setDemoOpen(true)}
                className="bg-ledger hover:bg-ledger-hover text-paper px-6 py-3.5 rounded text-sm font-semibold transition-colors cursor-pointer text-center"
              >
                Book a Demo
              </button>

              <Link
                href="/demo-login"
                className="border border-line hover:border-line-dark bg-paper-light hover:bg-paper-dark/50 text-ink px-5 py-3.5 rounded text-sm font-semibold transition-colors text-center"
              >
                See it running (no signup)
              </Link>
            </div>

            <p className="font-mono text-xs text-ink-subtle pt-2">
              Setup takes under a week · No software installation required
            </p>
          </div>

          {/* Right Column: Clean, Real Dashboard Interface Fragment */}
          <div className="lg:col-span-6">
            <div className="paper-card rounded-md shadow-ledger overflow-hidden">
              {/* Minimal Browser Window Header */}
              <div className="bg-paper-dark px-4 py-2.5 border-b border-line flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-line-dark" />
                  <span className="w-2.5 h-2.5 rounded-full bg-line-dark" />
                  <span className="w-2.5 h-2.5 rounded-full bg-line-dark" />
                </div>
                <div className="font-mono text-[11px] text-ink-muted bg-paper px-3 py-0.5 rounded border border-line">
                  app.alphaeduhub.in/admin
                </div>
                <div className="font-mono text-[10px] text-brass font-medium">
                  LIVE REGISTER
                </div>
              </div>

              {/* Real Dashboard Body Preview */}
              <div className="p-5 sm:p-6 space-y-5 bg-paper-light">
                {/* School Header */}
                <div className="flex items-center justify-between border-b border-line pb-3">
                  <div>
                    <h3 className="font-serif text-base font-bold text-ink">St. Jude Academy</h3>
                    <p className="font-mono text-xs text-ink-subtle">Term II · Academic Year 2024–25</p>
                  </div>
                  <span className="font-mono text-xs font-semibold px-2 py-0.5 bg-ledger-light text-ledger rounded border border-ledger/20">
                    All Systems Operational
                  </span>
                </div>

                {/* 4 Real Register Stat Tiles */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 bg-paper border border-line rounded">
                    <p className="font-mono text-[11px] text-ink-subtle uppercase">Pupils Enrolled</p>
                    <p className="font-mono text-2xl font-bold text-ink mt-0.5">1,248</p>
                    <p className="text-[11px] text-ink-muted mt-1">Across 32 Classrooms</p>
                  </div>

                  <div className="p-3.5 bg-paper border border-line rounded">
                    <p className="font-mono text-[11px] text-ink-subtle uppercase">Attendance Today</p>
                    <p className="font-mono text-2xl font-bold text-ledger mt-0.5">98.4%</p>
                    <p className="text-[11px] text-ink-muted mt-1">20 Absent (SMS sent)</p>
                  </div>

                  <div className="p-3.5 bg-paper border border-line rounded">
                    <p className="font-mono text-[11px] text-ink-subtle uppercase">Fee Ledger (Term II)</p>
                    <p className="font-mono text-2xl font-bold text-ink mt-0.5">$184,200</p>
                    <p className="text-[11px] text-ink-muted mt-1">91% Collected to date</p>
                  </div>

                  <div className="p-3.5 bg-paper border border-line rounded">
                    <p className="font-mono text-[11px] text-ink-subtle uppercase">Faculty On Duty</p>
                    <p className="font-mono text-2xl font-bold text-ink mt-0.5">64 / 64</p>
                    <p className="text-[11px] text-ink-muted mt-1">All periods staffed</p>
                  </div>
                </div>

                {/* Live Roll Call Activity Stream */}
                <div className="border border-line rounded bg-paper p-3.5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-semibold text-ink uppercase">Recent Register Actions</span>
                    <span className="font-mono text-[11px] text-ink-subtle">09:15 AM</span>
                  </div>

                  <div className="space-y-2 font-mono text-xs">
                    <div className="flex items-center justify-between text-ink-muted border-b border-line/60 pb-1.5">
                      <span>Grade 8-A Roll Call closed</span>
                      <span className="text-ledger font-medium">28 Present · 1 Absent</span>
                    </div>
                    <div className="flex items-center justify-between text-ink-muted border-b border-line/60 pb-1.5">
                      <span>Tuition Receipt #4821 issued</span>
                      <span className="text-ink font-medium">$450.00 (Card)</span>
                    </div>
                    <div className="flex items-center justify-between text-ink-muted">
                      <span>Physics Exam Marks published</span>
                      <span className="text-brass font-medium">Grade 10 · 34 PDFs</span>
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