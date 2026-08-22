"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import DemoModal from "./DemoModal";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);

  return (
    <>
      <DemoModal open={demoOpen} onClose={() => setDemoOpen(false)} />

      <header className="sticky top-0 z-40 bg-paper/95 backdrop-blur-xs border-b border-line">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-baseline gap-2 group">
            <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-ink">
              Alpha EduHub
            </span>
            <span className="font-mono text-[11px] text-ink-subtle uppercase tracking-wider hidden sm:inline">
              School System
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-ink-muted">
            <Link href="/" className="text-ink hover:text-ledger transition-colors">
              Home
            </Link>
            <Link href="#features" className="hover:text-ledger transition-colors">
              Features
            </Link>
            <Link href="#roles" className="hover:text-ledger transition-colors">
              Roles
            </Link>
            <Link href="#pricing" className="hover:text-ledger transition-colors">
              Pricing
            </Link>
            <Link href="#faq" className="hover:text-ledger transition-colors">
              FAQ
            </Link>
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/sign-in"
              className="text-sm font-medium text-ink hover:text-ledger transition-colors px-2 py-1"
            >
              Sign In
            </Link>
            <button
              onClick={() => setDemoOpen(true)}
              className="bg-ledger hover:bg-ledger-hover text-paper text-sm font-semibold px-4 py-2 rounded transition-colors cursor-pointer"
            >
              Book a Demo
            </button>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-ink hover:text-ledger"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-b border-line bg-paper px-4 py-5 space-y-3">
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className="block text-sm font-medium text-ink py-1"
            >
              Home
            </Link>
            <Link
              href="#features"
              onClick={() => setMobileOpen(false)}
              className="block text-sm font-medium text-ink py-1"
            >
              Features
            </Link>
            <Link
              href="#roles"
              onClick={() => setMobileOpen(false)}
              className="block text-sm font-medium text-ink py-1"
            >
              Roles
            </Link>
            <Link
              href="#pricing"
              onClick={() => setMobileOpen(false)}
              className="block text-sm font-medium text-ink py-1"
            >
              Pricing
            </Link>
            <Link
              href="#faq"
              onClick={() => setMobileOpen(false)}
              className="block text-sm font-medium text-ink py-1"
            >
              FAQ
            </Link>
            <div className="pt-3 border-t border-line flex flex-col gap-2.5">
              <Link
                href="/sign-in"
                onClick={() => setMobileOpen(false)}
                className="text-sm font-medium text-ink text-center py-2 border border-line rounded bg-paper-light"
              >
                Sign In
              </Link>
              <button
                onClick={() => {
                  setMobileOpen(false);
                  setDemoOpen(true);
                }}
                className="bg-ledger text-paper text-sm font-semibold text-center py-2.5 rounded"
              >
                Book a Demo
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
