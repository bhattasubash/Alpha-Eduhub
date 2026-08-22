"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const navLinks = [
  { label: "Core Capabilities", href: "#features" },
  { label: "Interactive Preview", href: "#preview" },
  { label: "Role Workflows", href: "#webapp" },
  { label: "Plans & Licensing", href: "#pricing" },
  { label: "System Architecture", href: "#technical-architecture" },
  { label: "FAQ", href: "#faq" },
];

export default function Navbar() {
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
        transition={{ duration: 0.4, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "backdrop-blur-md bg-slate-950/90 border-b border-slate-800/80 shadow-md shadow-black/20"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs group-hover:bg-blue-500 transition-colors">
                <Image src="/logo.png" alt="logo" width={22} height={22} className="brightness-200" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-white text-base tracking-tight leading-tight">
                  Alpha EduHub
                </span>
                <span className="text-[10px] text-slate-400 font-medium tracking-wide">
                  School Operating System
                </span>
              </div>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white rounded-md hover:bg-slate-800/60 transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-3">
              <Link
                href="/demo-login"
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-200 hover:text-white border border-slate-700/80 rounded-lg hover:bg-slate-800/60 transition-all"
              >
                Instant Sandbox
              </Link>
              <Link
                href="/sign-in"
                className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white rounded-lg bg-blue-600 hover:bg-blue-500 shadow-xs transition-colors"
              >
                <span>Console Sign In</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
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
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="fixed top-16 left-0 right-0 z-40 backdrop-blur-md bg-slate-950/98 border-b border-slate-800 md:hidden"
          >
            <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-3 py-2.5 text-slate-300 hover:text-white hover:bg-slate-900 rounded-lg transition-colors text-xs font-medium"
                >
                  {link.label}
                </a>
              ))}
              <div className="flex flex-col gap-2 mt-3 pt-3 border-t border-slate-800">
                <Link
                  href="/demo-login"
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-2.5 text-slate-200 text-center rounded-lg border border-slate-700 hover:bg-slate-800 transition-colors font-semibold text-xs"
                >
                  Instant Sandbox
                </Link>
                <Link
                  href="/sign-in"
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-2.5 text-white font-semibold text-center rounded-lg bg-blue-600 hover:bg-blue-500 transition-colors text-xs"
                >
                  Console Sign In
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
