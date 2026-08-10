"use client";

import { motion } from "framer-motion";

const highlights = [
  { icon: "🏫", label: "Admissions Management" },
  { icon: "📋", label: "Attendance Tracking" },
  { icon: "📊", label: "Grade Analytics" },
  { icon: "👨‍👩‍👧", label: "Parent Portal" },
  { icon: "📱", label: "Mobile Access" },
  { icon: "💰", label: "Fee Management" },
  { icon: "📅", label: "Smart Scheduling" },
  { icon: "🔔", label: "Real-time Notifications" },
];

export default function TrustedBy() {
  return (
    <section className="py-16 px-4 border-y border-white/5">
      <div className="max-w-7xl mx-auto">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-white/30 text-sm uppercase tracking-widest mb-10 font-medium"
        >
          Everything your school needs in one platform
        </motion.p>

        {/* Scrolling feature marquee */}
        <div className="relative overflow-hidden">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#050816] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#050816] to-transparent z-10 pointer-events-none" />

          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 25, ease: "linear", repeat: Infinity }}
            className="flex gap-12 whitespace-nowrap"
          >
            {[...highlights, ...highlights].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 text-white/30 hover:text-white/60 transition-colors cursor-default select-none"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm">{item.icon}</span>
                </div>
                <span className="text-sm font-semibold tracking-wide">{item.label}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Early access banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap items-center justify-center gap-6 mt-12"
        >
          {[
            { label: "Early Access Open", icon: "🚀" },
            { label: "Free Onboarding", icon: "🎁" },
            { label: "Dedicated Support", icon: "💬" },
            { label: "Data Privacy First", icon: "🔒" },
          ].map((badge) => (
            <div
              key={badge.label}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-white/50 text-xs font-medium"
            >
              <span>{badge.icon}</span>
              {badge.label}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
