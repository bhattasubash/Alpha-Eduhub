"use client";

import { motion } from "framer-motion";
import { ArrowRight, Play, Layers, Building2, Zap, Headset, GraduationCap, Shield, TrendingUp, Users, Award, Cpu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import DemoModal from "./DemoModal";

const stats = [
  { icon: Layers, label: "All-in-One Platform", value: "", suffix: "" },
  { icon: Building2, label: "Multi-School Ready", value: "", suffix: "" },
  { icon: Zap, label: "Faster School Operations", value: "", suffix: "" },
  { icon: Headset, label: "Dedicated Support", value: "", suffix: "" },
];

const floatingCards = [
  {
    icon: TrendingUp,
    title: "Grade Analytics",
    value: "+24%",
    sub: "this semester",
    color: "from-blue-500/20 to-blue-600/10",
    border: "border-blue-500/20",
    iconColor: "text-blue-400",
    position: "top-20 -left-4 md:left-8",
  },
  {
    icon: Users,
    title: "Active Students",
    value: "1,248",
    sub: "online now",
    color: "from-purple-500/20 to-purple-600/10",
    border: "border-purple-500/20",
    iconColor: "text-purple-400",
    position: "top-48 -right-4 md:right-8",
  },
  {
    icon: Award,
    title: "Attendance Rate",
    value: "96.8%",
    sub: "this month",
    color: "from-emerald-500/20 to-emerald-600/10",
    border: "border-emerald-500/20",
    iconColor: "text-emerald-400",
    position: "bottom-24 -left-4 md:left-16",
  },
];

export default function Hero() {
  const [demoOpen, setDemoOpen] = useState(false);
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-20 px-4 overflow-hidden">
      <DemoModal open={demoOpen} onClose={() => setDemoOpen(false)} />
      
      {/* Enhanced background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-indigo-600/20 rounded-full blur-[150px] animate-pulse-slow" />
        <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-purple-600/15 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: "1s" }} />
        <div className="absolute bottom-1/4 left-1/3 w-[500px] h-[500px] bg-pink-600/10 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: "2s" }} />
      </div>

      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="max-w-7xl mx-auto w-full relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-12 items-center">
          {/* Left content */}
          <div className="text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-sm font-medium mb-8 backdrop-blur-sm"
            >
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              Modern School Management Platform
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-extrabold text-white leading-tight tracking-tight mb-6"
            >
              Smart Schools.{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                Smarter Future.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-white/70 leading-relaxed mb-10 max-w-xl mx-auto lg:mx-0 font-light"
            >
              Transform your school with a complete management platform. Student records, 
              attendance, grades, exams, parent communication, and fee collection — all in one 
              beautifully designed, intuitive system.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-3 justify-center lg:justify-start mb-14"
            >
              <Link
                href="/demo-login"
                className="group inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 shadow-2xl shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all duration-300 hover:scale-105 hover-lift"
              >
                <GraduationCap className="w-4 h-4" />
                Try Demo Login
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/sign-in"
                className="group inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white rounded-2xl border border-white/20 bg-white/5 hover:bg-white/10 transition-all duration-300 hover-lift"
              >
                Sign In
              </Link>
              <button
                onClick={() => setDemoOpen(true)}
                className="group inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white rounded-2xl border border-white/20 bg-white/5 hover:bg-white/10 transition-all duration-300 hover-lift"
              >
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                  <Play className="w-3 h-3 text-white fill-white" />
                </div>
                Watch Demo
              </button>
              <Link
                href="#technical-architecture"
                className="group inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white rounded-2xl border border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 transition-all duration-300 hover-lift"
              >
                <Cpu className="w-4 h-4 text-blue-400" />
                Tech Architecture
              </Link>
            </motion.div>

            {/* Feature highlights row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-6"
            >
              {stats.map(({ icon: Icon, label }) => (
                <div key={label} className="text-center lg:text-left group">
                  <div className="flex items-center justify-center lg:justify-start gap-2 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center group-hover:from-indigo-500/30 group-hover:to-purple-500/30 transition-all">
                      <Icon className="w-5 h-5 text-indigo-400" />
                    </div>
                    <span className="text-xs text-white/50 uppercase tracking-wider font-medium">{label}</span>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — floating dashboard mockup */}
          <div className="relative hidden lg:flex items-center justify-center min-h-[600px]">
            {/* Main dashboard card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="relative w-full max-w-lg rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl shadow-2xl shadow-black/50 p-8 overflow-hidden hover-lift"
            >
              {/* Card header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                    <GraduationCap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg">Alpha Edu Hub</h3>
                    <p className="text-white/40 text-xs">School Dashboard</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-3 h-3 rounded-full bg-green-500/60" />
                </div>
              </div>

              {/* Mini chart bars */}
              <div className="flex items-end gap-2 h-32 mb-8">
                {[40, 65, 50, 80, 70, 90, 75, 85, 60, 95, 80, 100].map((h, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ duration: 0.6, delay: 0.5 + i * 0.04, ease: "easeOut" }}
                    className="flex-1 rounded-t-lg"
                    style={{
                      background: `linear-gradient(to top, #6366f1, #8b5cf6, #a855f7)`,
                      opacity: 0.5 + (i / 12) * 0.5,
                    }}
                  />
                ))}
              </div>

              {/* Metric rows */}
              {[
                { label: "Total Students", value: "2,847", change: "+12%", positive: true, icon: Users },
                { label: "Avg. Attendance", value: "96.4%", change: "+2.1%", positive: true, icon: Award },
                { label: "Pending Results", value: "134", change: "-8%", positive: true, icon: Zap },
              ].map((metric) => (
                <div key={metric.label} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                      <metric.icon className="w-5 h-5 text-white/60" />
                    </div>
                    <div>
                      <p className="text-white/50 text-xs font-medium">{metric.label}</p>
                      <p className="text-white font-bold">{metric.value}</p>
                    </div>
                  </div>
                  <div className={`text-sm font-bold ${metric.positive ? 'text-green-400' : 'text-red-400'}`}>
                    {metric.change}
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Floating cards */}
            {floatingCards.map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 + i * 0.1 }}
                className={`absolute ${card.position} p-5 rounded-2xl border ${card.border} bg-gradient-to-br ${card.color} backdrop-blur-2xl shadow-xl hover-lift`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <card.icon className={`w-5 h-5 ${card.iconColor}`} />
                  <p className="text-white/90 text-sm font-medium">{card.title}</p>
                </div>
                <p className="text-white font-bold text-xl">{card.value}</p>
                <p className="text-white/60 text-xs">{card.sub}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}