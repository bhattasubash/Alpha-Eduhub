"use client";

import { ShieldCheck, Mail, Globe, Lock, FileText, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Footer() {
  const [modalType, setModalType] = useState<"terms" | "privacy" | null>(null);

  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 text-slate-400 py-16 px-4 sm:px-6 lg:px-8">
      {/* Terms / Privacy Lightbox Modal */}
      {modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 sm:p-8 max-h-[85vh] overflow-y-auto scrollbar-clean shadow-2xl text-slate-300">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
              <h3 className="text-lg font-bold text-white">
                {modalType === "terms" ? "Terms of Service & SLA" : "Institutional Privacy & Data Policy"}
              </h3>
              <button
                onClick={() => setModalType(null)}
                className="text-slate-400 hover:text-white text-sm font-semibold px-2.5 py-1 rounded bg-slate-800"
              >
                Close ✕
              </button>
            </div>

            {modalType === "terms" ? (
              <div className="space-y-4 text-xs leading-relaxed text-slate-300">
                <p className="font-semibold text-white">1. Service Level Agreement (SLA)</p>
                <p>Alpha EduHub commits to a 99.98% platform availability across all provisioned institutional tenants, excluding scheduled maintenance windows announced with at least 48 hours notice.</p>
                <p className="font-semibold text-white">2. Data Sovereignty &amp; Ownership</p>
                <p>All student records, exam marks, biometric or roll-call logs, and financial records remain the exclusive property of the subscribing academic institution. Alpha EduHub acts solely as a secure data processor.</p>
                <p className="font-semibold text-white">3. Authorized Institutional Use</p>
                <p>Access credentials must be provisioned solely to verified faculty, enrolled pupils, and designated legal guardians in accordance with campus safety protocols.</p>
              </div>
            ) : (
              <div className="space-y-4 text-xs leading-relaxed text-slate-300">
                <p className="font-semibold text-white">1. FERPA &amp; GDPR Compliance</p>
                <p>Personally Identifiable Information (PII) is encrypted at rest using AES-256 and in transit via TLS 1.3. Student medical leave notes and academic evaluations are restricted via strict Row-Level Security.</p>
                <p className="font-semibold text-white">2. Zero Third-Party Monetization</p>
                <p>We strictly prohibit the sale, licensing, or commercial sharing of student or faculty behavioral data with advertising networks or third-party brokers.</p>
                <p className="font-semibold text-white">3. Right to Erasure &amp; Portability</p>
                <p>Institutions may export full student cohorts into encrypted JSON/CSV archives or request permanent cryptographic erasure upon contract termination.</p>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-14">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs">
                <Image src="/logo.png" alt="logo" width={22} height={22} className="brightness-200" />
              </div>
              <span className="font-bold text-white text-base tracking-tight">
                Alpha EduHub
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Enterprise school management infrastructure powering academic operations, fee accounting, attendance verification, and transparent guardian communication.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 pt-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>FERPA / GDPR Compliant Architecture</span>
            </div>
          </div>

          {/* Nav Col 1 */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Platform</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link href="#features" className="hover:text-white transition-colors">Core Capabilities</Link></li>
              <li><Link href="#preview" className="hover:text-white transition-colors">Interactive Preview</Link></li>
              <li><Link href="#webapp" className="hover:text-white transition-colors">Role Workflows</Link></li>
              <li><Link href="#pricing" className="hover:text-white transition-colors">Licensing &amp; SLA</Link></li>
            </ul>
          </div>

          {/* Nav Col 2 */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Portals</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link href="/sign-in" className="hover:text-white transition-colors">Admin Console</Link></li>
              <li><Link href="/sign-in" className="hover:text-white transition-colors">Faculty Gradebook</Link></li>
              <li><Link href="/sign-in" className="hover:text-white transition-colors">Guardian Portal</Link></li>
              <li><Link href="/demo-login" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">Live Sandbox →</Link></li>
            </ul>
          </div>

          {/* Nav Col 3 */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Compliance</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={() => setModalType("terms")}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Terms of Service &amp; SLA
                </button>
              </li>
              <li>
                <button
                  onClick={() => setModalType("privacy")}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Privacy &amp; Data Policy
                </button>
              </li>
              <li><span className="text-slate-500">PostgreSQL Tenant Security</span></li>
              <li><span className="text-slate-500">MSME Udyam Enterprise</span></li>
            </ul>
          </div>
        </div>

        {/* Contact Strip */}
        <div className="pt-8 pb-8 border-t border-slate-900 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-900/50 border border-slate-800/80">
            <Globe className="w-4 h-4 text-blue-400 shrink-0" />
            <div>
              <p className="text-[10px] text-slate-500 font-medium">Domain Verification</p>
              <span className="text-slate-200 font-semibold">alphaeduhub.in</span>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-900/50 border border-slate-800/80">
            <Mail className="w-4 h-4 text-blue-400 shrink-0" />
            <div>
              <p className="text-[10px] text-slate-500 font-medium">Institutional Support Desk</p>
              <a href="mailto:support@alphaeduhub.in" className="text-slate-200 font-semibold hover:text-white transition-colors">
                support@alphaeduhub.in
              </a>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-900/50 border border-slate-800/80 sm:col-span-2 lg:col-span-1">
            <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <p className="text-[10px] text-slate-500 font-medium">Encryption Standard</p>
              <span className="text-slate-200 font-semibold">AES-256 / TLS 1.3 Strict</span>
            </div>
          </div>
        </div>

        {/* Bottom Rights */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Alpha EduHub. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <button onClick={() => setModalType("terms")} className="hover:text-slate-400 transition-colors cursor-pointer">
              Terms
            </button>
            <span>•</span>
            <button onClick={() => setModalType("privacy")} className="hover:text-slate-400 transition-colors cursor-pointer">
              Privacy Policy
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
