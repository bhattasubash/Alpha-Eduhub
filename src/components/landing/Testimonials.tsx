"use client";

import { motion } from "framer-motion";
import { MessageSquare, ArrowRight } from "lucide-react";
import { useState } from "react";
import DemoModal from "./DemoModal";

const reasons = [
  {
    icon: "⚡",
    title: "Fast Setup",
    description: "Get your school up and running in under a day. We handle data migration and onboarding for you.",
  },
  {
    icon: "🎯",
    title: "Built for Schools",
    description: "Every feature is designed specifically for school administration — not adapted from generic software.",
  },
  {
    icon: "📞",
    title: "Hands-on Support",
    description: "Direct access to our team during onboarding and beyond. You're never left figuring things out alone.",
  },
  {
    icon: "🔐",
    title: "Your Data, Your Control",
    description: "Full data privacy with role-based access. Only the right people see the right information.",
  },
  {
    icon: "📱",
    title: "Works Everywhere",
    description: "Accessible from any device — desktop, tablet, or mobile — so staff and parents stay connected.",
  },
  {
    icon: "💰",
    title: "Simple Flat Pricing",
    description: "No per-student fees, no surprise charges. One predictable monthly cost that fits your budget.",
  },
];

export default function Testimonials() {
  const [demoOpen, setDemoOpen] = useState(false);

  return (
    <section id="testimonials" className="py-24 px-4 relative overflow-hidden">
      <DemoModal open={demoOpen} onClose={() => setDemoOpen(false)} />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-0 w-[500px] h-[500px] bg-purple-600/6 rounded-full blur-[120px]" />
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
            <MessageSquare className="w-3.5 h-3.5" />
            Why schools choose us
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4">
            Built with schools,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              for schools
            </span>
          </h2>
          <p className="text-white/50 text-lg max-w-2xl mx-auto">
            We&apos;re actively onboarding our first partner schools. Be part of shaping a platform
            built around your real needs.
          </p>
        </motion.div>

        {/* Reasons grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
          {reasons.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="rounded-2xl border border-white/8 bg-white/3 hover:bg-white/6 backdrop-blur-sm p-6 transition-all duration-300 hover:border-white/15"
            >
              <div className="text-3xl mb-4">{item.icon}</div>
              <h3 className="text-white font-semibold text-base mb-2">{item.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-6 p-8 rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-600/10 to-purple-600/10"
        >
          <div>
            <h3 className="text-white font-bold text-xl mb-1">Be among our first partner schools</h3>
            <p className="text-white/50 text-sm">
              Early partners get free onboarding, priority support, and influence over our roadmap.
            </p>
          </div>
          <button
            onClick={() => setDemoOpen(true)}
            className="flex-shrink-0 inline-flex items-center gap-2 px-7 py-3.5 text-base font-semibold text-white rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 hover:scale-105"
          >
            Book a Free Demo
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
