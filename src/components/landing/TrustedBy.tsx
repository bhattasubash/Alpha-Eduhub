"use client";

import {
  GraduationCap,
  CalendarCheck,
  BarChart3,
  Users,
  Smartphone,
  CreditCard,
  Calendar,
  Bell,
  ShieldCheck,
  Database,
  Cpu,
  Server,
} from "lucide-react";

const CAPABILITIES = [
  { icon: GraduationCap, label: "Admissions & Roster" },
  { icon: CalendarCheck, label: "Biometric & Roll Call" },
  { icon: BarChart3, label: "Gradebook Analytics" },
  { icon: Users, label: "Guardian Portal" },
  { icon: Smartphone, label: "Responsive PWA Access" },
  { icon: CreditCard, label: "Tuition & Fee Ledgers" },
  { icon: Calendar, label: "Timetable Scheduling" },
  { icon: Bell, label: "Real-Time Notifications" },
];

const ECOSYSTEM_STACK = [
  { icon: Database, label: "PostgreSQL Multi-Tenant DB" },
  { icon: Server, label: "Edge Routing & Caching" },
  { icon: ShieldCheck, label: "AES-256 Encrypted At Rest" },
  { icon: Cpu, label: "REST & Server Action Pipeline" },
];

export default function TrustedBy() {
  return (
    <section className="py-14 px-4 sm:px-6 lg:px-8 bg-slate-950 border-y border-slate-900">
      <div className="max-w-7xl mx-auto">
        <p className="text-center text-slate-400 text-xs uppercase tracking-widest mb-8 font-semibold">
          Unified Core Capabilities Across All School Levels
        </p>

        {/* Clean capability grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 mb-10">
          {CAPABILITIES.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="flex flex-col items-center justify-center p-3 rounded-lg border border-slate-800/80 bg-slate-900/50 hover:border-slate-700 transition-colors text-center"
              >
                <Icon className="w-4 h-4 text-blue-400 mb-2" strokeWidth={1.75} />
                <span className="text-[11px] font-medium text-slate-300 leading-tight">
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Architecture validation strip */}
        <div className="flex flex-wrap items-center justify-center gap-6 pt-6 border-t border-slate-900/80">
          {ECOSYSTEM_STACK.map((tech) => {
            const Icon = tech.icon;
            return (
              <div
                key={tech.label}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-slate-800 bg-slate-900/60 text-slate-400 text-xs font-medium"
              >
                <Icon className="w-3.5 h-3.5 text-slate-400" strokeWidth={1.75} />
                <span>{tech.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
