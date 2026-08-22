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
    <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-paper border-b border-line">
      <DemoModal open={demoOpen} onClose={() => setDemoOpen(false)} />

      <div className="max-w-6xl mx-auto">
        <div className="max-w-3xl mb-12">
          <span className="font-mono text-xs uppercase tracking-widest text-brass font-medium">
            Transparent Pricing
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-ink leading-tight mt-2">
            One price, every feature included.
          </h2>
          <p className="text-base text-ink-muted mt-2">
            No per-feature add-ons, no &ldquo;contact sales&rdquo; for basic functionality that should already be in the plan. Pick by school size.
          </p>
        </div>

        {/* Line-by-Line Comparison Ledger Table */}
        <div className="paper-card rounded-md border border-line shadow-ledger overflow-x-auto scrollbar-clean">
          <table className="w-full text-left font-sans text-xs sm:text-sm">
            <thead>
              <tr className="bg-paper-dark border-b border-line text-ink">
                <th className="py-4 px-4 sm:px-6 font-serif text-base font-bold w-1/3">
                  Plan Tier
                </th>
                <th className="py-4 px-4 sm:px-6 font-semibold w-2/9 border-l border-line">
                  <div>Single Campus</div>
                  <div className="font-mono text-xs text-ink-muted font-normal mt-0.5">$240 / month</div>
                </th>
                <th className="py-4 px-4 sm:px-6 font-semibold w-2/9 border-l border-line bg-paper-light">
                  <div className="text-ledger font-bold">Multi-Campus</div>
                  <div className="font-mono text-xs text-ink-muted font-normal mt-0.5">$780 / month</div>
                </th>
                <th className="py-4 px-4 sm:px-6 font-semibold w-2/9 border-l border-line">
                  <div>District Network</div>
                  <div className="font-mono text-xs text-ink-muted font-normal mt-0.5">Custom Contract</div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line font-mono text-xs">
              {COMPARISON_ROWS.map((row) => (
                <tr key={row.feature} className="hover:bg-paper-dark/30 transition-colors">
                  <td className="py-3.5 px-4 sm:px-6 font-sans text-xs sm:text-sm font-medium text-ink">
                    {row.feature}
                  </td>
                  <td className="py-3.5 px-4 sm:px-6 text-ink-muted border-l border-line">
                    {row.single}
                  </td>
                  <td className="py-3.5 px-4 sm:px-6 text-ink font-semibold border-l border-line bg-paper-light">
                    {row.multi}
                  </td>
                  <td className="py-3.5 px-4 sm:px-6 text-ink-muted border-l border-line">
                    {row.district}
                  </td>
                </tr>
              ))}
              {/* Action row */}
              <tr className="bg-paper-dark border-t border-line">
                <td className="py-4 px-4 sm:px-6 font-sans text-xs text-ink-subtle">
                  Billed annually · No setup fee
                </td>
                <td className="py-4 px-4 sm:px-6 border-l border-line">
                  <Link
                    href="/demo-login"
                    className="block text-center border border-line bg-paper hover:bg-paper-light text-ink py-2 px-3 rounded text-xs font-semibold font-sans transition-colors"
                  >
                    Try Single Campus
                  </Link>
                </td>
                <td className="py-4 px-4 sm:px-6 border-l border-line bg-paper-light">
                  <button
                    onClick={() => setDemoOpen(true)}
                    className="w-full text-center bg-ledger hover:bg-ledger-hover text-paper py-2 px-3 rounded text-xs font-semibold font-sans transition-colors cursor-pointer"
                  >
                    Book Campus Demo
                  </button>
                </td>
                <td className="py-4 px-4 sm:px-6 border-l border-line">
                  <button
                    onClick={() => setDemoOpen(true)}
                    className="w-full text-center border border-line bg-paper hover:bg-paper-light text-ink py-2 px-3 rounded text-xs font-semibold font-sans transition-colors cursor-pointer"
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
