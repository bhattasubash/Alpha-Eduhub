"use client";

import { motion } from "framer-motion";
import { BarChart3, Users, BookOpen, TrendingUp, Bell, CheckCircle2, Clock, Star } from "lucide-react";

const sideItems = [
  { icon: BarChart3, label: "Analytics", active: true },
  { icon: Users, label: "Students" },
  { icon: BookOpen, label: "Curriculum" },
  { icon: TrendingUp, label: "Reports" },
  { icon: Bell, label: "Alerts" },
];

const recentActivity = [
  { text: "John Doe submitted assignment", time: "2m ago", type: "success" },
  { text: "Class 10A attendance marked", time: "15m ago", type: "info" },
  { text: "New exam scheduled: Math", time: "1h ago", type: "warning" },
  { text: "Parent meeting confirmed", time: "2h ago", type: "success" },
];

export default function DashboardPreview() {
  return (
    <section id="dashboard" className="py-24 px-4 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-600/8 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 text-sm font-medium mb-4">
            <Star className="w-3.5 h-3.5" />
            See it in action
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4">
            Your school.{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              At a glance.
            </span>
          </h2>
          <p className="text-white/50 text-lg max-w-2xl mx-auto">
            A powerful dashboard that gives administrators, teachers, and parents exactly the information they need.
          </p>
        </motion.div>

        {/* Dashboard mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative rounded-3xl border border-white/10 bg-gradient-to-br from-white/6 to-white/2 backdrop-blur-xl shadow-2xl shadow-black/50 overflow-hidden"
        >
          {/* Browser chrome */}
          <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/8 bg-white/3">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/70" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
              <div className="w-3 h-3 rounded-full bg-green-500/70" />
            </div>
            <div className="flex-1 mx-4 h-6 rounded-md bg-white/8 flex items-center justify-center">
              <span className="text-white/30 text-xs">app.alphaedhub.io/dashboard</span>
            </div>
          </div>

          <div className="flex" style={{ minHeight: 480 }}>
            {/* Sidebar */}
            <div className="hidden sm:flex flex-col w-16 lg:w-56 border-r border-white/8 bg-white/2 p-3 gap-1">
              <div className="flex items-center gap-2.5 px-3 py-3 mb-4">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex-shrink-0" />
                <span className="hidden lg:block text-white font-semibold text-sm">Alpha Edu Hub</span>
              </div>
              {sideItems.map((item) => (
                <div
                  key={item.label}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-default transition-all ${
                    item.active
                      ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/20 text-white"
                      : "text-white/40 hover:text-white/70 hover:bg-white/5"
                  }`}
                >
                  <item.icon className="w-4 h-4 flex-shrink-0" />
                  <span className="hidden lg:block text-xs font-medium">{item.label}</span>
                </div>
              ))}
            </div>

            {/* Main content */}
            <div className="flex-1 p-4 lg:p-6 overflow-hidden">
              {/* Top row KPI cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                {[
                  { label: "Total Students", value: "2,847", change: "+12%", color: "from-blue-500/20 to-blue-600/10", icon: Users },
                  { label: "Teachers", value: "164", change: "+3%", color: "from-purple-500/20 to-purple-600/10", icon: BookOpen },
                  { label: "Attendance", value: "96.4%", change: "+1.2%", color: "from-emerald-500/20 to-emerald-600/10", icon: CheckCircle2 },
                  { label: "Avg. Score", value: "78.9", change: "+5.3%", color: "from-orange-500/20 to-orange-600/10", icon: TrendingUp },
                ].map((kpi) => (
                  <div key={kpi.label} className={`rounded-xl border border-white/8 bg-gradient-to-br ${kpi.color} p-3 lg:p-4`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white/50 text-[10px] lg:text-xs font-medium">{kpi.label}</span>
                      <kpi.icon className="w-3.5 h-3.5 text-white/30" />
                    </div>
                    <div className="text-white font-bold text-base lg:text-xl">{kpi.value}</div>
                    <div className="text-emerald-400 text-[10px] lg:text-xs mt-1">{kpi.change} this month</div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Chart area */}
                <div className="lg:col-span-2 rounded-xl border border-white/8 bg-white/3 p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-white text-sm font-semibold">Performance Overview</h4>
                    <div className="flex gap-2">
                      {["Week", "Month", "Year"].map((t, i) => (
                        <button
                          key={t}
                          className={`text-[10px] px-2 py-1 rounded-md transition-all ${i === 1 ? "bg-blue-500/20 text-blue-300 border border-blue-500/30" : "text-white/40 hover:text-white/60"}`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                  {/* Simulated line chart */}
                  <div className="relative h-32">
                    <svg viewBox="0 0 400 120" className="w-full h-full" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M0,80 C30,70 60,50 100,55 S150,40 200,35 S280,20 320,25 S370,15 400,10"
                        fill="none"
                        stroke="url(#lineGrad)"
                        strokeWidth="2.5"
                        className="stroke-indigo-400"
                      />
                      <path
                        d="M0,80 C30,70 60,50 100,55 S150,40 200,35 S280,20 320,25 S370,15 400,10 L400,120 L0,120 Z"
                        fill="url(#chartGrad)"
                      />
                      {/* Second line */}
                      <path
                        d="M0,95 C40,88 80,75 120,78 S170,65 220,60 S290,50 330,45 S380,40 400,38"
                        fill="none"
                        stroke="#a78bfa"
                        strokeWidth="1.5"
                        strokeDasharray="4 3"
                        opacity="0.5"
                      />
                    </svg>
                  </div>
                </div>

                {/* Recent activity */}
                <div className="rounded-xl border border-white/8 bg-white/3 p-4">
                  <h4 className="text-white text-sm font-semibold mb-4">Recent Activity</h4>
                  <div className="flex flex-col gap-3">
                    {recentActivity.map((item, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                          item.type === "success" ? "bg-emerald-400" :
                          item.type === "warning" ? "bg-amber-400" : "bg-blue-400"
                        }`} />
                        <div>
                          <p className="text-white/60 text-[11px] leading-tight">{item.text}</p>
                          <p className="text-white/25 text-[10px] mt-0.5 flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5" />{item.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Overlay glow */}
          <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-blue-600/10 rounded-full blur-[60px] pointer-events-none" />
        </motion.div>

        {/* Feature highlights below */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12"
        >
          {[
            { title: "Role-Based Views", desc: "Admin, teacher, parent, and student each see a tailored dashboard." },
            { title: "Live Data Sync", desc: "All changes propagate instantly — no refresh required." },
            { title: "Export Anywhere", desc: "One-click PDF, Excel, or CSV export for any report." },
          ].map((item) => (
            <div key={item.title} className="text-center">
              <h4 className="text-white font-semibold mb-2">{item.title}</h4>
              <p className="text-white/40 text-sm">{item.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
