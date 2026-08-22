"use client";

import { ArrowRight, Mail, ShieldCheck, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import DemoModal from "./DemoModal";

export default function ContactCTA() {
  const [demoOpen, setDemoOpen] = useState(false);

  return (
    <section id="contact" className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-950 text-slate-100 border-t border-slate-900">
      <DemoModal open={demoOpen} onClose={() => setDemoOpen(false)} />

      <div className="max-w-5xl mx-auto">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-8 sm:p-12 lg:p-16 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-700 bg-slate-800 text-slate-300 text-xs font-semibold mb-6">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Dedicated Campus Onboarding &amp; Migration</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight mb-4">
            Elevate your school&apos;s digital infrastructure today.
          </h2>

          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto mb-8 leading-relaxed">
            Experience our full operational suite in an interactive sandbox, or connect with an educational systems engineer to plan your custom campus rollout.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
            <Link
              href="/demo-login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-xs transition-colors"
            >
              <span>Launch Live Sandbox</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <button
              onClick={() => setDemoOpen(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-xs font-semibold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors cursor-pointer"
            >
              Schedule System Walkthrough
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 pt-6 border-t border-slate-800 text-xs text-slate-400">
            <a
              href="mailto:support@alphaeduhub.in"
              className="inline-flex items-center gap-1.5 hover:text-slate-200 transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-blue-400" />
              <span>support@alphaeduhub.in</span>
            </a>
            <div className="flex items-center gap-1.5 text-slate-400">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Full Data Sovereignty Guaranteed</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
