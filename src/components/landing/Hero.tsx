"use client";

import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, CheckCircle2, GraduationCap, Users, CalendarCheck, FileSpreadsheet, Building2, Terminal } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import DemoModal from "./DemoModal";

const TAB_PREVIEWS = [
  {
    id: "admin",
    label: "Admin Console",
    icon: Building2,
    title: "Centralized Campus Operations",
    desc: "Coordinate academic calendars, manage faculty schedules, track institutional fees, and oversee admissions.",
    stats: [
      { label: "Active Enrolled", value: "2,840 Pupils" },
      { label: "Faculty Members", value: "148 Certified" },
      { label: "Attendance Today", value: "98.2% Recorded" },
      { label: "Tuition Inflow", value: "$482,000 / Term" },
    ],
    pills: ["Automated Timetables", "Fee Ledgers", "Staff Allocations", "Excel Importer"],
  },
  {
    id: "faculty",
    label: "Faculty Workspace",
    icon: GraduationCap,
    title: "Instructional Efficiency & Gradebooks",
    desc: "Take roll calls in seconds, publish exam marks, assign coursework, and log daily lesson plans with zero friction.",
    stats: [
      { label: "Assigned Lessons", value: "24 / Week" },
      { label: "Graded Submissions", value: "312 Assignments" },
      { label: "Class Average", value: "84.6% Grade" },
      { label: "Pending Leaves", value: "2 Requests" },
    ],
    pills: ["1-Click Attendance", "Gradebook Matrix", "Curriculum Tracking", "Direct Messaging"],
  },
  {
    id: "guardian",
    label: "Parent & Student",
    icon: Users,
    title: "Real-Time Academic Transparency",
    desc: "Empower guardians with instant attendance notifications, report cards, fee receipts, and direct teacher dialogue.",
    stats: [
      { label: "Attendance Rate", value: "99.1% Verified" },
      { label: "Current GPA", value: "3.85 Cumulative" },
      { label: "Upcoming Exams", value: "3 Next Week" },
      { label: "Pending Fees", value: "$0 Clean Dues" },
    ],
    pills: ["Real-Time Alerts", "Exam Schedules", "Fee Invoices", "Leave Applications"],
  },
  {
    id: "super",
    label: "District Multi-Campus",
    icon: ShieldCheck,
    title: "Multi-Tenant Network Governance",
    desc: "Oversee multiple campuses from a single pane of glass. Provision instances, audit access logs, and monitor system health.",
    stats: [
      { label: "Connected Campuses", value: "12 Schools" },
      { label: "Platform Uptime", value: "99.98% SLA" },
      { label: "Database Health", value: "<15ms Latency" },
      { label: "Security Status", value: "Zero Breaches" },
    ],
    pills: ["Tenant Isolation", "Role Permissions", "Audit Logging", "Granular Overrides"],
  },
];

export default function Hero() {
  const [demoOpen, setDemoOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("admin");

  const currentPreview = TAB_PREVIEWS.find((t) => t.id === activeTab) || TAB_PREVIEWS[0];

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-28 pb-20 px-4 sm:px-6 lg:px-8 bg-slate-950 text-slate-100 overflow-hidden">
      <DemoModal open={demoOpen} onClose={() => setDemoOpen(false)} />

      {/* Subtle structural grid lines — crisp, non-distracting */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full relative z-10">
        {/* Main Headline Block */}
        <div className="text-center max-w-4xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-slate-800 bg-slate-900/80 text-slate-300 text-xs font-semibold mb-6 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Institutional School Operating System
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight mb-6">
            Architected for institutional excellence, trusted across campuses.
          </h1>

          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed mb-8">
            A unified multi-tenant platform managing student records, gradebooks, attendance verification, timetables, and financial operations with bank-grade security.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/demo-login"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white rounded-lg bg-blue-600 hover:bg-blue-500 shadow-xs transition-colors"
            >
              <span>Launch Live Sandbox</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/sign-in"
              className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-slate-200 hover:text-white rounded-lg border border-slate-700 bg-slate-900/60 hover:bg-slate-800 transition-colors"
            >
              School Console Sign In
            </Link>

            <button
              onClick={() => setDemoOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-slate-300 hover:text-white rounded-lg border border-slate-800 hover:border-slate-700 bg-slate-950 transition-colors cursor-pointer"
            >
              Request Institutional Demo
            </button>
          </div>
        </div>

        {/* Interactive Real Dashboard Showcase */}
        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/90 shadow-2xl p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
          {/* Tab Selector */}
          <div className="flex items-center gap-2 border-b border-slate-800 pb-4 overflow-x-auto scrollbar-clean">
            {TAB_PREVIEWS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                    isActive
                      ? "bg-blue-600 text-white shadow-xs"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                  }`}
                >
                  <Icon className="w-4 h-4" strokeWidth={1.75} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content Preview */}
          <div className="mt-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">{currentPreview.title}</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-xl leading-relaxed">{currentPreview.desc}</p>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {currentPreview.pills.map((pill) => (
                  <span
                    key={pill}
                    className="inline-flex items-center gap-1 font-mono text-[10px] text-slate-300 bg-slate-800/80 border border-slate-700/60 px-2.5 py-1 rounded-md"
                  >
                    <CheckCircle2 className="w-3 h-3 text-blue-400" />
                    {pill}
                  </span>
                ))}
              </div>
            </div>

            {/* Metric Visuals */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-950/80 border border-slate-800/80">
              {currentPreview.stats.map((st) => (
                <div key={st.label} className="p-3">
                  <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wide">{st.label}</p>
                  <p className="text-base sm:text-lg font-bold text-slate-100 mt-1 tabular-nums tracking-tight">{st.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Institutional Trust Footprint */}
        <div className="mt-16 pt-8 border-t border-slate-900 flex flex-wrap items-center justify-between gap-6 text-xs text-slate-400 font-medium">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>FERPA &amp; GDPR Compliant Data Segregation</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-blue-400" />
            <span>Multi-Tenant Architecture with PostgreSQL Row Security</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-blue-400" />
            <span>Role-Based Access Control (Super Admin, Faculty, Guardian)</span>
          </div>
        </div>
      </div>
    </section>
  );
}