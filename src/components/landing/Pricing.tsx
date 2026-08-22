"use client";

import { useState } from "react";
import { ArrowRight, ShieldCheck, HelpCircle } from "lucide-react";
import Link from "next/link";
import DemoModal from "./DemoModal";

const TIERS = [
  {
    name: "Academy Campus",
    badge: "Single Institution",
    description: "Designed for standalone primary, secondary, or collegiate academies needing comprehensive digital governance.",
    price: "$240",
    period: "/ month billed annually",
    highlights: [
      "Up to 1,200 enrolled students",
      "Unlimited teacher & parent portal accounts",
      "Automated gradebooks & attendance verification",
      "Fee collection & digital receipt ledgers",
      "99.9% Uptime guarantee with daily cloud backups",
    ],
    ctaText: "Launch Campus Sandbox",
    ctaHref: "/demo-login",
    highlighted: false,
  },
  {
    name: "Multi-Campus District",
    badge: "Most Deployed",
    description: "Tailored for school networks, dioceses, and educational trusts managing multiple independent school locations.",
    price: "$780",
    period: "/ month billed annually",
    highlights: [
      "Up to 8,000 students across 10 campuses",
      "Centralized Super-Admin district console",
      "Cross-school academic benchmarks & analytics",
      "Granular role-based permissions & audit trails",
      "Priority 4-hour SLA with dedicated technical liaison",
    ],
    ctaText: "Request District Setup",
    ctaHref: "/demo-login",
    highlighted: true,
  },
  {
    name: "State & Regional Network",
    badge: "Enterprise SLA",
    description: "Engineered for government bodies, large charter networks, and universities requiring customized hosting and SSO.",
    price: "Custom",
    period: "institutional contract",
    highlights: [
      "Unlimited campuses & student roster scale",
      "Dedicated PostgreSQL database cluster",
      "SAML 2.0 / Okta / Azure AD Single Sign-On",
      "Custom legacy SIS database migration",
      "1-hour response SLA & dedicated solutions engineer",
    ],
    ctaText: "Contact Institutional Team",
    ctaHref: "/demo-login",
    highlighted: false,
  },
];

export default function Pricing() {
  const [demoOpen, setDemoOpen] = useState(false);

  return (
    <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-950 text-slate-100 border-t border-slate-900">
      <DemoModal open={demoOpen} onClose={() => setDemoOpen(false)} />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-3">
            Predictable Institutional Licensing
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
            Transparent campus pricing with zero surprise per-feature fees.
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mt-3 leading-relaxed">
            Every plan includes our complete module suite — attendance, gradebooks, fees, timetables, and mobile portals.
          </p>
        </div>

        {/* Tier Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {TIERS.map((tier) => (
            <div
              key={tier.name}
              className={`rounded-2xl p-7 lg:p-8 flex flex-col justify-between transition-all ${
                tier.highlighted
                  ? "bg-slate-900 border-2 border-blue-500 shadow-xl shadow-blue-950/40 relative"
                  : "bg-slate-900/60 border border-slate-800"
              }`}
            >
              {tier.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[11px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full shadow-xs">
                  {tier.badge}
                </span>
              )}

              <div>
                {!tier.highlighted && (
                  <span className="inline-block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    {tier.badge}
                  </span>
                )}
                <h3 className="text-xl font-bold text-white tracking-tight">{tier.name}</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed min-h-[48px]">
                  {tier.description}
                </p>

                <div className="mt-6 mb-6 pb-6 border-b border-slate-800">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl sm:text-4xl font-bold text-white tabular-nums tracking-tight">
                      {tier.price}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">{tier.period}</span>
                  </div>
                </div>

                <div className="space-y-3 mb-8">
                  <p className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                    Included capabilities:
                  </p>
                  {tier.highlights.map((h) => (
                    <div key={h} className="flex items-start gap-2.5 text-xs text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Link
                  href={tier.ctaHref}
                  className={`w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg text-xs font-semibold transition-colors ${
                    tier.highlighted
                      ? "bg-blue-600 hover:bg-blue-500 text-white shadow-xs"
                      : "bg-slate-800 hover:bg-slate-700 text-slate-200"
                  }`}
                >
                  <span>{tier.ctaText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Security & Invoicing Guarantee */}
        <div className="mt-14 p-6 rounded-xl bg-slate-900/60 border border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>Need institutional purchase order (PO) invoicing or custom payment terms?</span>
          </div>
          <button
            onClick={() => setDemoOpen(true)}
            className="text-blue-400 hover:text-blue-300 font-semibold underline underline-offset-4 cursor-pointer"
          >
            Request Institutional Billing Proposal →
          </button>
        </div>
      </div>
    </section>
  );
}
