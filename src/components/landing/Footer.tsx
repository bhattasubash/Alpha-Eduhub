"use client";

import { GraduationCap, Mail, Globe } from "lucide-react";
import Link from "next/link";

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const footerLinks = {
  Product: [
    { name: "Features", href: "#features" },
    { name: "Web App", href: "/sign-in" },
    { name: "Pricing", href: "#pricing" },
  ],
  Company: [
    { name: "Contact Us", href: "mailto:bilalhyder889@gmail.com" },
  ],
  Resources: [
    { name: "Help & Support", href: "mailto:bilalhyder889@gmail.com" },
  ],
};

const instagramIcon = (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069 3.204 0 3.584.012 4.85.069 3.252.148 4.771 1.699 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.204-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

export default function Footer() {
  return (
    <footer className="border-t border-white/8 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Top row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-white text-lg tracking-tight">
                Alpha{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                  Edu Hub
                </span>
              </span>
            </Link>
            <p className="text-white/35 text-sm leading-relaxed mb-5 max-w-xs">
              Smart Schools. Smarter Future. The all-in-one school management platform for modern educators.
            </p>
            {/* Socials */}
            <div className="flex gap-3">
              <a
                href="https://instagram.com/alphaeduhub"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all"
              >
                {instagramIcon}
              </a>
              <a
                href="https://www.linkedin.com/in/mahammad-bilal-hyder-493295356"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-9 h-9 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all"
              >
                <LinkedinIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-white font-semibold text-sm mb-4">{category}</h4>
              <ul className="flex flex-col gap-2.5">
                {links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-white/35 hover:text-white/70 text-sm transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Company Information */}
        <div className="border-t border-white/8 pt-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center border border-blue-500/20">
                <Globe className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-white/50 text-xs mb-1">Website</p>
                <a 
                  href="https://alphaeduhub.in" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white text-sm font-medium hover:text-blue-400 transition-colors"
                >
                  alphaeduhub.in
                </a>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center border border-purple-500/20">
                <Mail className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-white/50 text-xs mb-1">Email</p>
                <a
                  href="mailto:bilalhyder889@gmail.com"
                  className="text-white text-sm font-medium hover:text-purple-400 transition-colors"
                >
                  bilalhyder889@gmail.com
                </a>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500/20 to-orange-500/20 flex items-center justify-center border border-pink-500/20">
                {instagramIcon}
              </div>
              <div>
                <p className="text-white/50 text-xs mb-1">Instagram</p>
                <a 
                  href="https://instagram.com/alphaeduhub"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white text-sm font-medium hover:text-pink-400 transition-colors"
                >
                  @alphaeduhub
                </a>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#0077B5]/20 to-[#006097]/20 flex items-center justify-center border border-[#0077B5]/20">
                <LinkedinIcon className="w-5 h-5 text-[#0077B5]" />
              </div>
              <div>
                <p className="text-white/50 text-xs mb-1">Developer</p>
                <a 
                  href="https://www.linkedin.com/in/mahammad-bilal-hyder-493295356"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white text-sm font-medium hover:text-[#0077B5] transition-colors"
                >
                  Mahammad Bilal Hyder
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Credibility */}
        <div className="border-t border-white/8 pt-6 mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              <p className="text-white/40 text-xs">
                MSME / Udyam Registered
              </p>
            </div>
            <p className="text-white/30 text-xs text-center sm:text-right">
              Alpha Edu Hub is a Udyam-registered Micro Enterprise.
            </p>
          </div>
        </div>

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/8">
          <p className="text-white/25 text-xs">
            © {new Date().getFullYear()} Alpha Edu Hub. All rights reserved.
          </p>
          <p className="text-white/30 text-xs">
            Learn • Connect • Grow
          </p>
        </div>
      </div>
    </footer>
  );
}
