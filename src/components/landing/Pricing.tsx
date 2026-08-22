"use client";

import { useState } from "react";
import DemoModal from "./DemoModal";
import Link from "next/link";

const COMPARISON_ROWS = [
  { feature: "Students Included", single: "Up to 1,200", multi: "Up to 8,000", district: "Unlimited" },
  { feature: "Staff & Teacher Accounts", single: "Unlimited", multi: "Unlimited", district: "Unlimited" },
  { feature: "Daily Roll Call & Parent SMS", single: "Included", multi: "Included", district: "Included" },
  { feature: "Fee Ledger & Digital Receipts", single: "Included", multi: "Included", district: "Included" },
  { feature: "Automated PDF Report Cards", single: "Included", multi: "Included", district: "Included" },
  { feature: "Timetable Scheduling Engine", single: "Included", multi: "Included", district: "Included" },
  { feature: "Parent Portal (Web & Mobile)", single: "Included", multi: "Included", district: "Included" },
  { feature: "Historical Data Migration", single: "Included (CSV/Excel)", multi: "Included (CSV/Excel)", district: "Custom SQL Migration" },
  { feature: "Support Response Time", single: "24-Hour Standard", multi: "4-Hour Priority", district: "1-Hour Dedicated SLA" },
];

export default function Pricing() {
  const [demoOpen, setDemoOpen] = useState(false);

  return (
    <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8 bg-paper-band border-b-2 border-line">
      <DemoModal open={demoOpen} onClose={() => setDemoOpen(false)} />

      <div className="max-w-6xl mx-auto">
        <div className="max-w-3xl mb-14">
          <span className="font-mono text-xs uppercase tracking-widest text-brass-dark font-bold">
            § 06 · INSTITUTIONAL LICENSING
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-ink leading-[1.08] tracking-tight mt-2">
            One price, every feature included.
          </h2>
          <p className="text-[18px] text-ink-muted mt-3 max-w-prose leading-relaxed">
            No per-feature add-ons, no &ldquo;contact sales&rdquo; for basic functionality that should already be in the plan. Pick by school size.
          </p>
        </div>

        {/* Open Line-by-Line Comparison Ledger */}
        <div className="bg-paper-light border-y-2 sm:border-2 border-line sm:rounded shadow-ledger overflow-x-auto scrollbar-clean">
          <table className="w-full text-left font-sans text-xs sm:text-sm">
            <thead>
              <tr className="bg-paper-band border-b-2 border-line text-ink">
                <th className="py-5 px-5 sm:px-7 font-serif text-lg font-bold w-1/3">
                  Scope &amp; Capability
                </th>
                <th className="py-5 px-5 sm:px-7 font-semibold w-2/9 border-l-2 border-line">
                  <div className="font-bold text-sm">Single Campus</div>
                  <div className="font-mono text-xs text-ink-muted font-normal mt-0.5">$240 / month</div>
                </th>
                {/* Grounded Multi-Campus Header */}
                <th className="py-5 px-5 sm:px-7 font-semibold w-2/9 border-l-2 border-line bg-paper-highlight">
                  <div className="flex items-center justify-between">
                    <span className="text-ledger font-bold text-sm">Multi-Campus</span>
                    <span className="font-mono text-[10px] text-brass-dark font-bold uppercase tracking-wider">
                      Standard
                    </span>
                  </div>
                  <div className="font-mono text-xs text-ink font-bold mt-0.5">$780 / month</div>
                </th>
                <th className="py-5 px-5 sm:px-7 font-semibold w-2/9 border-l-2 border-line">
                  <div className="font-bold text-sm">District Network</div>
                  <div className="font-mono text-xs text-ink-muted font-normal mt-0.5">Custom Contract</div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line font-mono text-xs">
              {COMPARISON_ROWS.map((row) => (
                <tr key={row.feature} className="hover:bg-paper-band/50 transition-colors">
                  <td className="py-4 px-5 sm:px-7 font-sans text-xs sm:text-sm font-medium text-ink">
                    {row.feature}
                  </td>
                  <td className="py-4 px-5 sm:px-7 text-ink-muted border-l-2 border-line">
                    {row.single}
                  </td>
                  <td className="py-4 px-5 sm:px-7 text-ink font-semibold border-l-2 border-line bg-paper-highlight/50">
                    {row.multi === "Included" ? (
                      <span className="text-ledger font-bold">Included</span>
                    ) : (
                      row.multi
                    )}
                  </td>
                  <td className="py-4 px-5 sm:px-7 text-ink-muted border-l-2 border-line">
                    {row.district}
                  </td>
                </tr>
              ))}
              {/* Action row */}
              <tr className="bg-paper-band border-t-2 border-line">
                <td className="py-5 px-5 sm:px-7 font-sans text-xs text-ink-subtle">
                  Billed annually · Zero setup fees
                </td>
                <td className="py-5 px-5 sm:px-7 border-l-2 border-line">
                  <Link
                    href="/demo-login"
                    className="block text-center border-2 border-line bg-paper hover:bg-paper-light text-ink py-2.5 px-4 rounded text-xs font-semibold font-sans transition-colors"
                  >
                    Try Single Campus
                  </Link>
                </td>
                <td className="py-5 px-5 sm:px-7 border-l-2 border-line bg-paper-highlight">
                  <button
                    onClick={() => setDemoOpen(true)}
                    className="w-full text-center bg-ledger hover:bg-ledger-hover text-paper py-2.5 px-4 rounded text-xs font-semibold font-sans transition-colors cursor-pointer shadow-ledger"
                  >
                    Book Campus Demo
                  </button>
                </td>
                <td className="py-5 px-5 sm:px-7 border-l-2 border-line">
                  <button
                    onClick={() => setDemoOpen(true)}
                    className="w-full text-center border-2 border-line bg-paper hover:bg-paper-light text-ink py-2.5 px-4 rounded text-xs font-semibold font-sans transition-colors cursor-pointer"
                  >
                    Contact District Team
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
