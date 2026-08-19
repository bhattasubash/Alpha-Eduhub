"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, GraduationCap, ExternalLink } from "lucide-react";
import Link from "next/link";

const navLinks = [
  { label: "Why Me?", href: "#why-me" },
  { label: "Featured Project", href: "#featured-project" },
  { label: "All Projects", href: "#all-projects" },
  { label: "What I Built", href: "#what-i-built" },
  { label: "Technical Architecture", href: "#technical-architecture" },
  { label: "Contact", href: "#contact" },
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
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "backdrop-blur-xl bg-white/5 border-b border-white/10 shadow-lg shadow-black/20"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:shadow-indigo-500/40 transition-shadow">
                <span className="text-white font-bold text-lg">MB</span>
              </div>
              <span className="font-bold text-white text-lg tracking-tight">
                Mahammad <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Bilal</span>
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="px-4 py-2 text-sm text-white/70 hover:text-white rounded-lg hover:bg-white/5 transition-all duration-200"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-3">
              <a
                href="/resume.pdf"
                download
                className="px-4 py-2 text-sm text-white/80 hover:text-white transition-colors"
              >
                Download Resume
              </a>
              <a
                href="https://www.linkedin.com/in/mahammad-bilal-hyder-493295356"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all"
                aria-label="LinkedIn"
              >
                <ExternalLink className="w-4 h-4" />
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
            className="fixed top-16 left-0 right-0 z-40 backdrop-blur-xl bg-[#050816]/95 border-b border-white/10 md:hidden"
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
                  className="px-4 py-3 text-white/70 hover:text-white text-center rounded-lg hover:bg-white/5 transition-all"
                >
                  Download Resume
                </a>
                <a
                  href="https://www.linkedin.com/in/mahammad-bilal-hyder-493295356"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-4 py-3 text-white/70 hover:text-white text-center rounded-lg hover:bg-white/5 transition-all"
                >
                  <ExternalLink className="w-4 h-4" />
                  Connect on LinkedIn
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
