"use client";

import { useState } from "react";
import Link from "next/link";
import DemoModal from "./DemoModal";

export default function ContactCTA() {
  const [demoOpen, setDemoOpen] = useState(false);

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-paper-band border-b-2 border-line">
      <DemoModal open={demoOpen} onClose={() => setDemoOpen(false)} />

      <div className="max-w-4xl mx-auto">
        <div className="bg-paper-light rounded p-10 sm:p-14 text-center border-2 border-line shadow-ledger-lift space-y-7">
          <span className="font-mono text-xs uppercase tracking-widest text-brass-dark font-bold">
            § 08 · WALKTHROUGH &amp; EVALUATION
          </span>

          <h2 className="font-serif text-4xl sm:text-5xl lg:text-[54px] font-bold text-ink leading-[1.06] tracking-tight">
            See it running before you decide anything.
          </h2>

          <p className="text-lg sm:text-[19px] text-ink-muted max-w-prose mx-auto leading-relaxed">
            Book a 20-minute walkthrough with real school data, not a sales deck.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <button
              onClick={() => setDemoOpen(true)}
              className="w-full sm:w-auto bg-ledger hover:bg-ledger-hover text-paper px-8 py-4 rounded text-sm font-semibold transition-colors cursor-pointer shadow-ledger"
            >
              Book a Demo
            </button>

            <Link
              href="/demo-login"
              className="w-full sm:w-auto border-2 border-line hover:border-line-dark bg-paper hover:bg-paper-band text-ink px-7 py-4 rounded text-sm font-semibold transition-colors"
            >
              Launch Live Sandbox
            </Link>
          </div>

          <p className="font-mono text-xs text-ink-subtle pt-2">
            Questions? Contact <a href="mailto:support@alphaeduhub.in" className="text-ink font-semibold underline">support@alphaeduhub.in</a>
          </p>
        </div>
      </div>
    </section>
  );
}
