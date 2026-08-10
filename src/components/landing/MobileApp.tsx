"use client";

import { motion } from "framer-motion";
import { Bell, BookOpen, CheckCircle2, MessageSquare, Smartphone, TrendingUp } from "lucide-react";

const appScreens = [
  {
    title: "Grade Tracker",
    subtitle: "Math • This week",
    value: "94/100",
    change: "+6 pts",
    icon: TrendingUp,
    color: "from-blue-500 to-indigo-600",
    notifications: 2,
  },
  {
    title: "Homework Due",
    subtitle: "Physics • Tomorrow",
    value: "Chapter 8",
    change: "3 tasks",
    icon: BookOpen,
    color: "from-purple-500 to-pink-600",
    notifications: 1,
  },
  {
    title: "Attendance",
    subtitle: "This month",
    value: "98%",
    change: "All present",
    icon: CheckCircle2,
    color: "from-emerald-500 to-teal-600",
    notifications: 0,
  },
];

const appFeatures = [
  { icon: Bell, text: "Instant push notifications for grades, attendance & announcements" },
  { icon: MessageSquare, text: "Direct messaging between teachers, students & parents" },
  { icon: BookOpen, text: "Full access to assignments, resources & class materials" },
  { icon: TrendingUp, text: "Personal analytics showing academic progress over time" },
];

export default function MobileApp() {
  return (
    <section className="py-24 px-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-purple-600/8 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left — Phone mockups */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative flex justify-center"
          >
            <div className="relative">
              {/* Main phone */}
              <div className="relative w-64 rounded-[2.5rem] border-2 border-white/15 bg-gradient-to-br from-white/8 to-white/2 backdrop-blur-xl shadow-2xl shadow-black/50 overflow-hidden p-1">
                {/* Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-[#050816] rounded-b-2xl z-20" />

                <div className="rounded-[2.2rem] bg-gradient-to-b from-[#0a0f24] to-[#050816] min-h-[520px] p-4 pt-10">
                  {/* Status bar */}
                  <div className="flex justify-between items-center text-white/40 text-[10px] mb-6">
                    <span>9:41 AM</span>
                    <div className="flex gap-1">
                      <span>●●●●</span>
                      <span>WiFi</span>
                      <span>100%</span>
                    </div>
                  </div>

                  {/* App header */}
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <p className="text-white/40 text-xs">Good morning,</p>
                      <p className="text-white font-bold text-base">Sarah Johnson 👋</p>
                    </div>
                    <div className="relative">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <Smartphone className="w-4 h-4 text-white" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 flex items-center justify-center text-[8px] text-white font-bold">3</div>
                    </div>
                  </div>

                  {/* Cards */}
                  <div className="flex flex-col gap-3">
                    {appScreens.map((screen, i) => (
                      <motion.div
                        key={screen.title}
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
                        className="rounded-2xl border border-white/8 bg-white/5 p-3"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${screen.color} flex items-center justify-center flex-shrink-0`}>
                            <screen.icon className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-white text-xs font-semibold truncate">{screen.title}</p>
                            <p className="text-white/40 text-[10px]">{screen.subtitle}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-white text-xs font-bold">{screen.value}</p>
                            <p className="text-emerald-400 text-[10px]">{screen.change}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Bottom nav */}
                  <div className="absolute bottom-6 left-4 right-4 flex justify-around">
                    {["🏠", "📊", "📚", "💬", "👤"].map((icon) => (
                      <div key={icon} className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-white/10 cursor-default text-base">
                        {icon}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Second phone (tilted, behind) */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -right-16 top-12 w-48 rounded-[2rem] border-2 border-white/10 bg-gradient-to-br from-purple-500/10 to-blue-500/10 backdrop-blur-xl shadow-xl shadow-black/30 overflow-hidden p-1 rotate-6 opacity-70"
              >
                <div className="rounded-[1.8rem] bg-gradient-to-b from-[#0d0920] to-[#050816] min-h-[380px] p-3 pt-8">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-white/60 font-semibold text-sm">Timetable</p>
                    <div className="w-6 h-6 rounded-lg bg-purple-500/30 flex items-center justify-center">
                      <BookOpen className="w-3 h-3 text-purple-400" />
                    </div>
                  </div>
                  {["Math", "Physics", "History", "English", "Biology"].map((subject, i) => (
                    <div
                      key={subject}
                      className={`flex items-center gap-2 p-2 rounded-lg mb-1.5 ${i === 0 ? "bg-blue-500/20 border border-blue-500/20" : "bg-white/4"}`}
                    >
                      <div className={`w-1.5 h-1.5 rounded-full ${i === 0 ? "bg-blue-400" : "bg-white/20"}`} />
                      <span className={`text-xs ${i === 0 ? "text-blue-300 font-medium" : "text-white/40"}`}>{subject}</span>
                      <span className="text-white/20 text-[9px] ml-auto">{8 + i}:00 AM</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Floating notification */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -left-12 bottom-20 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 backdrop-blur-xl p-3 shadow-xl min-w-[150px]"
              >
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-300 text-xs font-semibold">Assignment Submitted</span>
                </div>
                <p className="text-white/40 text-[10px]">Math Homework — just now</p>
              </motion.div>
            </div>
          </motion.div>

          {/* Right — Copy */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-sm font-medium mb-6">
              <Smartphone className="w-3.5 h-3.5" />
              Mobile App
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4 leading-tight">
              Learning doesn&apos;t stop{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                at the bell.
              </span>
            </h2>
            <p className="text-white/50 text-lg mb-8">
              Our native mobile app keeps students, parents, and teachers connected
              around the clock — with a UI so intuitive, no training is required.
            </p>

            <div className="flex flex-col gap-4 mb-8">
              {appFeatures.map((f) => (
                <div key={f.text} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/15 border border-purple-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <f.icon className="w-4 h-4 text-purple-400" />
                  </div>
                  <p className="text-white/60 text-sm leading-relaxed">{f.text}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <button className="flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-white/8 border border-white/10 hover:bg-white/12 transition-all group">
                <span className="text-xl">🍎</span>
                <div className="text-left">
                  <p className="text-white/40 text-[10px]">Download on the</p>
                  <p className="text-white font-semibold text-sm">App Store</p>
                </div>
              </button>
              <button className="flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-white/8 border border-white/10 hover:bg-white/12 transition-all group">
                <span className="text-xl">🤖</span>
                <div className="text-left">
                  <p className="text-white/40 text-[10px]">Get it on</p>
                  <p className="text-white font-semibold text-sm">Google Play</p>
                </div>
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
