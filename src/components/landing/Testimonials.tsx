"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Database, Headphones, KeyRound, Smartphone, Layers, ArrowRight } from "lucide-react";
import { useState } from "react";
import DemoModal from "./DemoModal";
import Link from "next/link";

const DEPLOYMENT_STANDARDS = [
  {
    icon: Database,
    title: "Isolated Tenant Architecture",
    description: "Every school record is strictly partitioned with schema boundaries and Row-Level Security, preventing cross-institution data leaks.",
  },
  {
    icon: ShieldCheck,
    title: "FERPA & GDPR Alignment",
    description: "Strict privacy safeguards ensuring student PII, academic records, and medical leaves comply with global education regulations.",
  },
  {
    icon: Headphones,
    title: "Dedicated Deployment Engineer",
    description: "Hands-on engineering support during initial rollout, assisting with CSV roster imports, grade history, and faculty training.",
  },
  {
    icon: KeyRound,
    title: "Granular Permission Matrices",
    description: "Role-Based Access Control allowing principals to delegate attendance, grade publishing, and fee approvals with precise audits.",
  },
  {
    icon: Smartphone,
    title: "Responsive Cross-Platform",
    description: "Fully responsive PWA architecture accessible on tablets, smart boards, desktops, and mobile devices without dedicated app store lock-in.",
  },
  {
    icon: Layers,
    title: "High-Availability Cloud Infrastructure",
    description: "Edge-distributed CDN routing, automated database snapshots, and 99.98% uptime SLA guaranteeing reliability during exam periods.",
  },
];

export default function Testimonials() {
  const [demoOpen, setDemoOpen] = useState(false);

  return (
    <section id="testimonials" className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-950 text-slate-100 border-t border-slate-900">
      <DemoModal open={demoOpen} onClose={() => setDemoOpen(false)} />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <p className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-3">
            Institutional Trust &amp; Engineering
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
            Built to meet rigorous institutional standards.
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mt-3 leading-relaxed">
            Engineered from first principles for school districts, academy groups, and independent institutions requiring absolute data integrity.
          </p>
        </div>

        {/* Standards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {DEPLOYMENT_STANDARDS.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 flex flex-col justify-between hover:border-slate-700 transition-colors"
              >
                <div>
                  <div className="w-10 h-10 rounded-lg bg-blue-950 border border-blue-800/40 text-blue-400 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" strokeWidth={1.75} />
                  </div>
                  <h3 className="text-sm font-bold text-white tracking-tight mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Capsule */}
        <div className="p-8 rounded-2xl border border-slate-800 bg-slate-900 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              Ready to modernize your school&apos;s administrative workflow?
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              Launch our instant interactive sandbox environment with pre-populated school records, or schedule an architectural walkthrough.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 shrink-0">
            <Link
              href="/demo-login"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"
            >
              <span>Instant Sandbox</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <button
              onClick={() => setDemoOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              Schedule Consultation
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
