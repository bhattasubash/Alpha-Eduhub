"use client";

import { motion } from "framer-motion";
import { ArrowRight, Mail, Phone, MessageSquare } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import DemoModal from "./DemoModal";

export default function ContactCTA() {
  const [demoOpen, setDemoOpen] = useState(false);
  return (
    <section id="contact" className="py-24 px-4 relative overflow-hidden">
      <DemoModal open={demoOpen} onClose={() => setDemoOpen(false)} />
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-r from-blue-600/12 to-purple-600/12 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-5xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl border border-white/10 bg-gradient-to-br from-white/6 to-white/2 backdrop-blur-xl p-10 lg:p-16 overflow-hidden text-center"
        >
          {/* Inner decorative glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-1 bg-gradient-to-r from-transparent via-blue-500/60 to-transparent" />
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-96 h-40 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 text-sm font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            Ready to transform your school?
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-white mb-5 leading-tight">
            Start your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
              free trial
            </span>{" "}
            today
          </h2>

          <p className="text-white/55 text-lg max-w-2xl mx-auto mb-10">
            Join 1,200+ schools that have already transformed their operations with Alpha Edu Hub.
            No credit card required. Full access for 30 days.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/sign-in"
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105"
            >
              Get Started Free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button
                onClick={() => setDemoOpen(true)}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white rounded-2xl border border-white/15 bg-white/5 hover:bg-white/10 transition-all duration-300"
              >
              <MessageSquare className="w-4 h-4" />
              Book a Demo
            </button>
          </div>

          {/* Contact details */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-white/40 text-sm">
            <a href="mailto:alphaeduhub360@gmail.com" className="flex items-center gap-2 hover:text-white/70 transition-colors">
              <Mail className="w-4 h-4" />
              alphaeduhub360@gmail.com
            </a>
            <div className="hidden sm:block w-1 h-1 rounded-full bg-white/20" />
            <a href="tel:+918277300451" className="flex items-center gap-2 hover:text-white/70 transition-colors">
              <Phone className="w-4 h-4" />
              +91 82773 00451
            </a>
            <div className="hidden sm:block w-1 h-1 rounded-full bg-white/20" />
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Available 24/7
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
