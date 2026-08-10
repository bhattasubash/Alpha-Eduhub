"use client";

import { motion } from "framer-motion";
import { Bell, BookOpen, CheckCircle2, MessageSquare, Monitor, TrendingUp, Globe } from "lucide-react";
import Link from "next/link";

const webFeatures = [
  { icon: Bell, text: "Real-time notifications for grades, attendance & announcements" },
  { icon: MessageSquare, text: "Direct messaging between teachers, students & parents" },
  { icon: BookOpen, text: "Full access to assignments, resources & class materials" },
  { icon: TrendingUp, text: "Personal analytics showing academic progress over time" },
];

const dashboardCards = [
  {
    title: "Grade Analytics",
    value: "+24%",
    sub: "this semester",
    color: "from-blue-500/20 to-blue-600/10",
    border: "border-blue-500/20",
    iconColor: "text-blue-400",
    icon: TrendingUp,
  },
  {
    title: "Active Students",
    value: "1,248",
    sub: "online now",
    color: "from-purple-500/20 to-purple-600/10",
    border: "border-purple-500/20",
    iconColor: "text-purple-400",
    icon: Monitor,
  },
  {
    title: "Attendance Rate",
    value: "96.8%",
    sub: "this month",
    color: "from-emerald-500/20 to-emerald-600/10",
    border: "border-emerald-500/20",
    iconColor: "text-emerald-400",
    icon: CheckCircle2,
  },
];

export default function WebApp() {
  return (
    <section className="py-24 px-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-purple-600/8 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left — Browser mockup */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative flex justify-center"
          >
            <div className="relative">
              {/* Browser window */}
              <div className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl shadow-2xl shadow-black/50 overflow-hidden">
                {/* Browser header */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-white/5">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/60" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                    <div className="w-3 h-3 rounded-full bg-green-500/60" />
                  </div>
                  <div className="flex-1 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                    <Globe className="w-3 h-3 text-white/40" />
                    <span className="text-white/40 text-xs">alphaeduhub.com/dashboard</span>
                  </div>
                </div>

                {/* Dashboard content */}
                <div className="p-6 bg-gradient-to-b from-[#0a0f24] to-[#050816] min-h-[400px]">
                  {/* Dashboard header */}
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-white/40 text-xs">Welcome back,</p>
                      <p className="text-white font-bold text-lg">Sarah Johnson 👋</p>
                    </div>
                    <div className="relative">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <Monitor className="w-5 h-5 text-white" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 flex items-center justify-center text-[8px] text-white font-bold">3</div>
                    </div>
                  </div>

                  {/* Stats cards */}
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    {dashboardCards.map((card, i) => (
                      <motion.div
                        key={card.title}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
                        className={`rounded-xl border ${card.border} ${card.color} p-3`}
                      >
                        <card.icon className={`w-4 h-4 ${card.iconColor} mb-2`} />
                        <p className="text-white text-lg font-bold">{card.value}</p>
                        <p className="text-white/40 text-[10px]">{card.sub}</p>
                      </motion.div>
                    ))}
                  </div>

                  {/* Recent activity */}
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <p className="text-white/60 text-xs font-semibold mb-3">Recent Activity</p>
                    {["Grade posted for Math Exam", "New assignment: Physics Chapter 8", "Attendance marked for today"].map((activity, i) => (
                      <div key={i} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
                        <div className="w-2 h-2 rounded-full bg-blue-400" />
                        <p className="text-white/70 text-xs">{activity}</p>
                        <span className="text-white/30 text-[10px] ml-auto">{i + 1}h ago</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating notification */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -right-8 top-20 rounded-xl border border-emerald-500/20 bg-emerald-500/10 backdrop-blur-xl p-3 shadow-xl min-w-[180px]"
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
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-sm font-medium mb-6 backdrop-blur-sm">
              <Monitor className="w-4 h-4" />
              Web Application
            </div>

            <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-6 leading-tight">
              Powerful Web App.
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                {" "}No Installation Required.
              </span>
            </h2>

            <p className="text-white/60 text-lg leading-relaxed mb-8">
              Access your school management system from any device — desktop, laptop, tablet, or mobile. 
              Our responsive web application works seamlessly across all platforms with no app installation needed.
            </p>

            {/* Features */}
            <div className="space-y-4 mb-10">
              {webFeatures.map(({ icon: Icon, text }, i) => (
                <motion.div
                  key={text}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.5 + i * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center flex-shrink-0 border border-purple-500/20">
                    <Icon className="w-5 h-5 text-purple-400" />
                  </div>
                  <p className="text-white/70 text-sm leading-relaxed">{text}</p>
                </motion.div>
              ))}
            </div>

            {/* CTA button */}
            <Link
              href="/sign-in"
              className="inline-flex items-center gap-2 px-6 py-3 text-base font-semibold text-white rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-lg shadow-purple-500/30 transition-all duration-300 hover:scale-105"
            >
              <Globe className="w-5 h-5" />
              Try Web App Now
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
