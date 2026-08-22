"use client";

import { useState } from "react";
import Link from "next/link";
import DemoModal from "./DemoModal";

export default function ContactCTA() {
  const [demoOpen, setDemoOpen] = useState(false);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-paper border-b border-line">
      <DemoModal open={demoOpen} onClose={() => setDemoOpen(false)} />

      <div className="max-w-4xl mx-auto">
        <div className="paper-card rounded p-8 sm:p-12 text-center border border-line shadow-ledger space-y-6">
          <span className="font-mono text-xs uppercase tracking-widest text-brass font-medium">
            Walkthrough &amp; Evaluation
          </span>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-ink leading-tight">
            See it running before you decide anything.
          </h2>

          <p className="text-base sm:text-lg text-ink-muted max-w-xl mx-auto leading-relaxed">
            Book a 20-minute walkthrough with real school data, not a sales deck.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => setDemoOpen(true)}
              className="w-full sm:w-auto bg-ledger hover:bg-ledger-hover text-paper px-7 py-3.5 rounded text-sm font-semibold transition-colors cursor-pointer"
            >
              Book a Demo
            </button>

            <Link
              href="/demo-login"
              className="w-full sm:w-auto border border-line hover:border-line-dark bg-paper hover:bg-paper-dark/50 text-ink px-6 py-3.5 rounded text-sm font-semibold transition-colors"
            >
              Launch Live Sandbox
            </Link>
          </div>

          <p className="font-mono text-xs text-ink-subtle">
            Questions? Contact <a href="mailto:support@alphaeduhub.in" className="text-ink underline">support@alphaeduhub.in</a>
          </p>
        </div>
      </div>
    </section>
  );
}
