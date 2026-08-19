"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ExternalLink, Download } from "lucide-react";
import Link from "next/link";

const navLinks = [
  { label: "HOME", href: "/" },
  { label: "Why Me?", href: "#why-me" },
  { label: "Featured Project", href: "#featured-project" },
  { label: "All Projects", href: "#all-projects" },
  { label: "What I Built", href: "#what-i-built" },
  { label: "Achievements", href: "#achievements" },
  { label: "Resume", href: "#resume" },
  { label: "Contact", href: "#contact" },
];

export default function PortfolioNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "backdrop-blur-xl bg-black/30 border-b border-red-500/20 shadow-lg shadow-red-500/10"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              {/* Spider-inspired symbol */}
              <div className="relative w-10 h-10">
                <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-blue-600 rounded-lg opacity-80 group-hover:opacity-100 transition-opacity" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-white/80 rounded-full" />
                  <div className="absolute w-8 h-0.5 bg-white/60 -rotate-45" />
                  <div className="absolute w-8 h-0.5 bg-white/60 rotate-45" />
                </div>
              </div>
              <span className="font-bold text-white text-lg tracking-wider">
                BILAL <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-blue-400">HYDER</span>
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="relative px-4 py-2 text-sm text-white/70 hover:text-white transition-all duration-300 group"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-red-500 to-blue-500 group-hover:w-full transition-all duration-300" />
                </a>
              ))}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-3">
              <a
                href="/resume.pdf"
                download
                className="px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-red-600 to-blue-600 rounded-lg hover:from-red-500 hover:to-blue-500 transition-all duration-300 shadow-lg shadow-red-500/20 hover:shadow-red-500/40 flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                RESUME
              </a>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 left-0 right-0 z-40 backdrop-blur-xl bg-black/90 border-b border-red-500/20 md:hidden"
          >
            <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                >
                  {link.label}
                </a>
              ))}
              <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-white/10">
                <a
                  href="/resume.pdf"
                  download
                  className="px-4 py-3 text-white font-semibold text-center rounded-lg bg-gradient-to-r from-red-600 to-blue-600 transition-all flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  RESUME
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
