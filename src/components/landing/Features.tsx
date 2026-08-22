"use client";

import { motion } from "framer-motion";
import {
  BookOpen,
  CalendarCheck,
  CreditCard,
  ShieldAlert,
  GraduationCap,
  Users,
  FileSpreadsheet,
  Clock,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

const CAPABILITY_PILLARS = [
  {
    category: "ACADEMIC & CURRICULUM",
    title: "Instructional Workflows & Gradebook Automation",
    description:
      "Eliminate spreadsheet chaos with a unified syllabus manager, lesson registry, examination scheduler, and single-click transcript generation.",
    items: [
      {
        icon: BookOpen,
        title: "Curriculum & Lesson Planning",
        desc: "Structure syllabi across terms, link lesson materials, and map standards-aligned objectives.",
      },
      {
        icon: FileSpreadsheet,
        title: "Examinations & Grade Publishing",
        desc: "Enter exam results once; generate branded PDF report cards and student performance trends instantly.",
      },
      {
        icon: Clock,
        title: "Conflict-Free Timetable Engine",
        desc: "Automated schedule allocation that validates instructor availability, room capacities, and class periods.",
      },
    ],
  },
  {
    category: "GOVERNANCE & FINANCIAL OPERATIONS",
    title: "Enterprise Multi-Tenancy & Institutional Accounting",
    description:
      "Built for single institutions or nationwide school networks with total data sovereignty, role boundaries, and clear ledger auditing.",
    items: [
      {
        icon: CreditCard,
        title: "Fee Structures & Collection Ledgers",
        desc: "Set class-specific fee templates, generate invoice receipts, and track pending dues with audit logs.",
      },
      {
        icon: CalendarCheck,
        title: "Verified Attendance & Leave Desk",
        desc: "Daily morning roll-call with automated absent triggers to guardians and staff leave review workflows.",
      },
      {
        icon: ShieldAlert,
        title: "Multi-Tenant Row Security & RBAC",
        desc: "Isolated school schemas with granular access rules for Super Admins, Principals, Faculty, and Parents.",
      },
    ],
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-950 text-slate-100 border-t border-slate-900">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <p className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-3">
            Core Architecture
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
            Engineered for every administrative layer of modern education.
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mt-3 leading-relaxed">
            Replace disjointed third-party plugins with a cohesive, institution-grade operational backbone.
          </p>
        </div>

        {/* Capability Pillars */}
        <div className="space-y-12">
          {CAPABILITY_PILLARS.map((pillar) => (
            <div
              key={pillar.category}
              className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 lg:p-10"
            >
              <div className="max-w-2xl mb-8">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  {pillar.category}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white mt-1.5 tracking-tight">
                  {pillar.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
                  {pillar.description}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-slate-800/80">
                {pillar.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.title}
                      className="p-5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex flex-col justify-between"
                    >
                      <div>
                        <div className="w-9 h-9 rounded-lg bg-blue-950 text-blue-400 border border-blue-800/50 flex items-center justify-center mb-4">
                          <Icon className="w-4 h-4" strokeWidth={1.75} />
                        </div>
                        <h4 className="text-sm font-bold text-white tracking-tight mb-2">
                          {item.title}
                        </h4>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Banner */}
        <div className="mt-12 p-6 rounded-xl border border-slate-800 bg-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold text-white">Need custom SIS migration assistance?</h4>
            <p className="text-xs text-slate-400 mt-0.5">Our engineering team assists with legacy SQL & Excel data transfers.</p>
          </div>
          <Link
            href="/demo-login"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shrink-0 transition-colors"
          >
            <span>Explore Live Sandbox</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
