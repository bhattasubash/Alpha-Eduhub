"use client";

import { motion } from "framer-motion";
import { ArrowRight, Download, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function PortfolioHero() {
  return (
    <section className="min-h-screen flex items-center relative overflow-hidden pt-20">
      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-red-400 font-semibold tracking-widest uppercase text-sm"
              >
                HELLO, I&apos;M
              </motion.p>
              
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-5xl md:text-7xl font-bold text-white leading-tight tracking-tight"
              >
                MAHAMMAD
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-blue-400 to-purple-400">
                  BILAL HYDER
                </span>
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl md:text-2xl text-gray-300 font-light tracking-wide"
              >
                CSE STUDENT • FULL-STACK DEVELOPER • BUILDER
              </motion.p>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-gray-400 text-lg max-w-xl leading-relaxed"
              >
                I build real-world applications, solve problems with code, and turn ideas into working products.
              </motion.p>
            </div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-4"
            >
              <Link
                href="#featured-project"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white rounded-xl bg-gradient-to-r from-red-600 to-blue-600 hover:from-red-500 hover:to-blue-500 shadow-2xl shadow-red-500/30 hover:shadow-red-500/50 transition-all duration-300 hover:scale-105"
              >
                EXPLORE PROJECTS
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="/resume.pdf"
                download
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white rounded-xl border-2 border-red-500/30 bg-red-500/10 hover:bg-red-500/20 transition-all duration-300"
              >
                <Download className="w-4 h-4" />
                DOWNLOAD RESUME
              </a>
            </motion.div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex gap-4"
            >
              <a
                href="https://www.linkedin.com/in/mahammad-bilal-hyder-493295356"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-xl border border-red-500/20 bg-red-500/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-red-500/20 transition-all hover:scale-110"
                aria-label="LinkedIn"
              >
                <ExternalLink className="w-5 h-5" />
              </a>
              <a
                href="https://github.com/bilalhydercodes"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-xl border border-blue-500/20 bg-blue-500/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-blue-500/20 transition-all hover:scale-110"
                aria-label="GitHub"
              >
                <ExternalLink className="w-5 h-5" />
              </a>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-wrap gap-8 pt-8 border-t border-red-500/20"
            >
              <div>
                <div className="text-3xl font-bold text-white">1+</div>
                <div className="text-gray-400 text-sm">Featured Project</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">10+</div>
                <div className="text-gray-400 text-sm">Technologies</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">Full-Stack</div>
                <div className="text-gray-400 text-sm">Development</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right - Empty space for 3D character */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative h-[500px] flex items-center justify-center lg:justify-end"
          >
            {/* The 3D character is rendered in the CityScene component */}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-gray-400 text-xs tracking-widest">SCROLL TO ENTER MY WORLD ↓</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 border-2 border-red-500/30 rounded-full flex items-start justify-center p-2"
        >
          <div className="w-1 h-2 bg-red-400 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}
