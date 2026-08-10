"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    question: "How long does it take to get set up?",
    answer: "Most schools are fully live within 24 hours. Our onboarding team guides you through data import, user setup, and initial configuration. We've helped schools migrate from spreadsheets, legacy SIS systems, and even paper records.",
  },
  {
    question: "Can I import existing student data?",
    answer: "Yes. Alpha Edu Hub supports bulk import from CSV, Excel, and direct API connections to popular SIS systems like PowerSchool, Infinite Campus, and Skyward. Our team assists with complex migrations at no extra charge.",
  },
  {
    question: "Is my data secure and private?",
    answer: "Absolutely. We are SOC 2 Type II certified, GDPR and FERPA compliant, and use end-to-end encryption for all sensitive data. Your data is never sold or used to train external AI models. We run on ISO 27001-certified infrastructure.",
  },
  {
    question: "Does Alpha Edu Hub support multiple campuses?",
    answer: "Yes. Our Enterprise plan is specifically designed for multi-campus and multi-district deployments. Administrators can manage all locations from a single dashboard, with granular permission controls per campus.",
  },
  {
    question: "What kind of support do you offer?",
    answer: "All plans include email and chat support. Growth plans get priority response within 4 hours. Enterprise customers receive a dedicated customer success manager, phone support, and a guaranteed SLA.",
  },
  {
    question: "Can parents and students access the platform?",
    answer: "Yes. Every plan includes a parent portal and student dashboard. Parents can view grades, attendance, announcements, and communicate directly with teachers. The mobile app works for all user roles.",
  },
  {
    question: "Do you offer a free trial?",
    answer: "We offer a 30-day free trial with full access to all Growth plan features. No credit card required. You can also book a live demo with our team to see the platform with your specific use case.",
  },
  {
    question: "Can I customize the platform with our school's branding?",
    answer: "Growth and Enterprise plans support full custom branding — your logo, color scheme, and custom domain. Enterprise customers can also white-label the mobile app.",
  },
];

function FAQItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="border border-white/8 rounded-2xl overflow-hidden"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left bg-white/3 hover:bg-white/6 transition-colors"
        aria-expanded={open}
      >
        <span className="text-white font-medium text-sm leading-relaxed">{q}</span>
        <ChevronDown
          className={`w-5 h-5 text-white/40 flex-shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="px-5 pb-4 pt-2 text-white/55 text-sm leading-relaxed border-t border-white/5 bg-white/2">
              {a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQ() {
  return (
    <section id="faq" className="py-24 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 text-sm font-medium mb-4">
            <HelpCircle className="w-3.5 h-3.5" />
            Common questions
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4">
            Frequently asked{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              questions
            </span>
          </h2>
          <p className="text-white/50 text-lg">
            Can&apos;t find what you&apos;re looking for?{" "}
            <a href="#contact" className="text-blue-400 hover:text-blue-300 transition-colors underline underline-offset-2">
              Chat with our team.
            </a>
          </p>
        </motion.div>

        <div className="flex flex-col gap-3">
          {faqs.map((faq, i) => (
            <FAQItem key={faq.question} q={faq.question} a={faq.answer} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
