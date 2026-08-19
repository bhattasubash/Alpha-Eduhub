"use client";

import { motion } from "framer-motion";
import { Mail, Phone, ExternalLink } from "lucide-react";
import Link from "next/link";

const socialLinks = [
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/mahammad-bilal-hyder-493295356",
    icon: ExternalLink,
  },
  {
    name: "GitHub",
    href: "https://github.com/bilalhydercodes",
    icon: ExternalLink,
  },
  {
    name: "Email",
    href: "mailto:bilalhyder889@gmail.com",
    icon: Mail,
  },
];

const quickLinks = [
  { label: "Why Me?", href: "#why-me" },
  { label: "Featured Project", href: "#featured-project" },
  { label: "All Projects", href: "#all-projects" },
  { label: "What I Built", href: "#what-i-built" },
  { label: "Contact", href: "#contact" },
];

export default function PortfolioFooter() {
  return (
    <footer className="bg-[#050816] border-t border-white/10 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-indigo-600/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16 relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-xl">MB</span>
              </div>
              <span className="font-bold text-white text-xl">
                Mahammad <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Bilal</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm mb-6">
              CSE Student | Full-Stack Developer
            </p>
            <p className="text-gray-500 text-sm leading-relaxed">
              Building real-world applications with modern web technologies.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:alphaeduhub360@gmail.com"
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
                >
                  <Mail className="w-4 h-4" />
                  alphaeduhub360@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+918277300451"
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
                >
                  <Phone className="w-4 h-4" />
                  +91 82773 00451
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-white font-semibold mb-4">Connect</h3>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all"
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
            <div className="mt-6">
              <a
                href="/resume.pdf"
                download
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-sm font-medium rounded-lg transition-all"
              >
                <ExternalLink className="w-4 h-4" />
                Download Resume
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Mahammad Bilal Hyder. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm">
            Built with Next.js, TypeScript, and Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
}
