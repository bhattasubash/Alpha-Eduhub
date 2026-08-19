"use client";

import { motion } from "framer-motion";
import { ArrowRight, Mail, Phone, Download, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function HiringCTA() {
  return (
    <section id="contact" className="py-24 bg-gradient-to-b from-[#0a0f1e] to-[#050816] relative overflow-hidden scroll-mt-20">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-r from-red-600/12 to-blue-600/12 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-5xl mx-auto px-6 relative z-10">
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
            Open to Opportunities
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-white mb-5 leading-tight">
            Looking for a developer who builds, learns, and solves?
          </h2>

          <p className="text-white/55 text-lg max-w-2xl mx-auto mb-10">
            Let&apos;s talk. I&apos;m actively looking for full-stack development opportunities where I can
            contribute my skills and continue growing as a developer.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <a
              href="mailto:bilalhyder889@gmail.com"
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105"
            >
              <Mail className="w-4 h-4" />
              Contact Me
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="https://www.linkedin.com/in/mahammad-bilal-hyder-493295356"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white rounded-2xl border border-white/15 bg-white/5 hover:bg-white/10 transition-all duration-300"
            >
              <ExternalLink className="w-4 h-4" />
              LinkedIn
            </a>
            <a
              href="https://github.com/bilalhydercodes"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white rounded-2xl border border-white/15 bg-white/5 hover:bg-white/10 transition-all duration-300"
            >
              <ExternalLink className="w-4 h-4" />
              GitHub
            </a>
          </div>

          {/* Download Resume Button */}
          <div className="mb-12">
            <a
              href="/resume.pdf"
              download
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white rounded-2xl border-2 border-indigo-500/50 bg-indigo-500/10 hover:bg-indigo-500/20 transition-all duration-300 hover:scale-105"
            >
              <Download className="w-4 h-4" />
              Download Resume
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          {/* Contact details */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-white/40 text-sm">
            <a href="mailto:bilalhyder889@gmail.com" className="flex items-center gap-2 hover:text-white/70 transition-colors">
              <Mail className="w-4 h-4" />
              bilalhyder889@gmail.com
            </a>
            <div className="hidden sm:block w-1 h-1 rounded-full bg-white/20" />
            <a href="tel:+918277300451" className="flex items-center gap-2 hover:text-white/70 transition-colors">
              <Phone className="w-4 h-4" />
              +91 82773 00451
            </a>
            <div className="hidden sm:block w-1 h-1 rounded-full bg-white/20" />
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Based in India
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
