"use client";

import { motion } from "framer-motion";
import { Check, X, Zap } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

const plans = [
  {
    name: "Starter",
    description: "Perfect for small schools just getting started.",
    monthlyPrice: 25,
    yearlyPrice: 20,
    color: "from-slate-500/20 to-slate-600/10",
    border: "border-white/10",
    cta: "Get Started",
    ctaClass: "bg-white/8 hover:bg-white/15 text-white border border-white/15",
    features: [
      { text: "Up to 300 students", included: true },
      { text: "5 admin accounts", included: true },
      { text: "Attendance & grading", included: true },
      { text: "Parent portal", included: true },
      { text: "Mobile app access", included: true },
      { text: "Advanced analytics", included: false },
      { text: "Custom branding", included: false },
      { text: "API access", included: false },
      { text: "Priority support", included: false },
    ],
  },
  {
    name: "Growth",
    description: "The most popular plan for growing institutions.",
    monthlyPrice: 30,
    yearlyPrice: 25,
    color: "from-blue-500/20 to-purple-600/15",
    border: "border-blue-500/30",
    badge: "Most Popular",
    cta: "Start Free Trial",
    ctaClass: "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg shadow-blue-500/25",
    features: [
      { text: "Up to 1,500 students", included: true },
      { text: "Unlimited admin accounts", included: true },
      { text: "Attendance & grading", included: true },
      { text: "Parent portal", included: true },
      { text: "Mobile app access", included: true },
      { text: "Advanced analytics", included: true },
      { text: "Custom branding", included: true },
      { text: "API access", included: false },
      { text: "Priority support", included: false },
    ],
  },
  {
    name: "Enterprise",
    description: "Built for large districts and multi-campus groups.",
    monthlyPrice: null,
    yearlyPrice: null,
    color: "from-purple-500/20 to-pink-600/10",
    border: "border-purple-500/20",
    cta: "Contact Sales",
    ctaClass: "bg-white/8 hover:bg-white/15 text-white border border-white/15",
    features: [
      { text: "Unlimited students", included: true },
      { text: "Unlimited admin accounts", included: true },
      { text: "Attendance & grading", included: true },
      { text: "Parent portal", included: true },
      { text: "Mobile app access", included: true },
      { text: "Advanced analytics", included: true },
      { text: "Custom branding", included: true },
      { text: "API access", included: true },
      { text: "Priority support & SLA", included: true },
    ],
  },
];

export default function Pricing() {
  const [yearly, setYearly] = useState(true);
  const [activeCard, setActiveCard] = useState(0);

  return (
    <section id="pricing" className="py-24 px-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-blue-600/6 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-green-500/30 bg-green-500/10 text-green-300 text-sm font-medium mb-4">
            <Zap className="w-3.5 h-3.5" />
            Simple, transparent pricing
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4">
            Invest in your school&apos;s{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
              future
            </span>
          </h2>
          <p className="text-white/50 text-lg max-w-2xl mx-auto mb-8">
            No hidden fees, no per-student charges. Flat pricing that scales with your institution.
          </p>

          {/* Toggle */}
          <div className="inline-flex items-center gap-3 p-1.5 rounded-2xl border border-white/10 bg-white/5">
            <button
              onClick={() => setYearly(false)}
              className={`px-5 py-2 rounded-xl text-sm font-medium transition-all ${!yearly ? "bg-white/15 text-white" : "text-white/50 hover:text-white/70"}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setYearly(true)}
              className={`px-5 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${yearly ? "bg-white/15 text-white" : "text-white/50 hover:text-white/70"}`}
            >
              Yearly
              <span className="px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-xs font-semibold">Save 20%</span>
            </button>
          </div>
        </motion.div>

        {/* Plans */}
        <div className="relative">
          {/* Mobile horizontal carousel */}
          <div className="md:hidden overflow-x-auto snap-x snap-mandatory scrollbar-hide px-1 -mx-1" onScroll={(e) => {
            const scrollLeft = e.currentTarget.scrollLeft;
            const cardWidth = e.currentTarget.offsetWidth * 0.85;
            const newActiveCard = Math.round(scrollLeft / cardWidth);
            setActiveCard(Math.min(newActiveCard, plans.length - 1));
          }}>
            <div className="flex gap-4 px-1 pb-4" style={{ width: `${plans.length * 85}%`, minWidth: `${plans.length * 280}px` }}>
              {plans.map((plan, i) => (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className={`relative rounded-3xl border ${plan.border} bg-gradient-to-br ${plan.color} backdrop-blur-sm p-6 flex flex-col flex-shrink-0 w-[85vw] max-w-[280px] snap-start ${plan.badge ? "ring-1 ring-blue-500/30" : ""}`}
                >
                  {/* Popular badge */}
                  {plan.badge && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold shadow-lg shadow-blue-500/25">
                      {plan.badge}
                    </div>
                  )}

                  <div className="mb-5">
                    <h3 className="text-white font-bold text-lg mb-1">{plan.name}</h3>
                    <p className="text-white/45 text-xs">{plan.description}</p>
                  </div>

                  {/* Price */}
                  <div className="mb-5">
                    {plan.monthlyPrice ? (
                      <div className="flex items-end gap-1">
                        <span className="text-3xl font-extrabold text-white">
                          ₹{yearly ? plan.yearlyPrice : plan.monthlyPrice}
                        </span>
                        <span className="text-white/40 text-xs pb-1">/month</span>
                      </div>
                    ) : (
                      <div className="text-2xl font-extrabold text-white">Custom</div>
                    )}
                    {plan.monthlyPrice && yearly && (
                      <p className="text-white/40 text-[10px] mt-1">
                        Billed yearly · ₹{plan.yearlyPrice! * 12}/yr
                      </p>
                    )}
                  </div>

                  {/* Features */}
                  <ul className="flex flex-col gap-2 mb-6 flex-1">
                    {plan.features.map((f) => (
                      <li key={f.text} className="flex items-center gap-2">
                        {f.included ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                        ) : (
                          <X className="w-3.5 h-3.5 text-white/20 flex-shrink-0" />
                        )}
                        <span className={`text-xs ${f.included ? "text-white/70" : "text-white/25"}`}>{f.text}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <Link
                    href="/sign-in"
                    className={`w-full py-2.5 rounded-xl text-xs font-semibold text-center transition-all duration-300 hover:scale-105 ${plan.ctaClass}`}
                  >
                    {plan.cta}
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Desktop grid */}
          <div className="hidden md:grid md:grid-cols-3 md:gap-6 max-w-5xl mx-auto">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`relative rounded-3xl border ${plan.border} bg-gradient-to-br ${plan.color} backdrop-blur-sm p-7 flex flex-col ${plan.badge ? "ring-1 ring-blue-500/30" : ""}`}
              >
                {/* Popular badge */}
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold shadow-lg shadow-blue-500/25">
                    {plan.badge}
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-white font-bold text-xl mb-1">{plan.name}</h3>
                  <p className="text-white/45 text-sm">{plan.description}</p>
                </div>

                {/* Price */}
                <div className="mb-6">
                  {plan.monthlyPrice ? (
                    <div className="flex items-end gap-1">
                      <span className="text-4xl font-extrabold text-white">
                        ₹{yearly ? plan.yearlyPrice : plan.monthlyPrice}
                      </span>
                      <span className="text-white/40 text-sm pb-1">/month</span>
                    </div>
                  ) : (
                    <div className="text-3xl font-extrabold text-white">Custom</div>
                  )}
                  {plan.monthlyPrice && yearly && (
                    <p className="text-white/40 text-xs mt-1">
                      Billed yearly · ₹{plan.yearlyPrice! * 12}/yr
                    </p>
                  )}
                </div>

                {/* Features */}
                <ul className="flex flex-col gap-3 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li key={f.text} className="flex items-center gap-2.5">
                      {f.included ? (
                        <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      ) : (
                        <X className="w-4 h-4 text-white/20 flex-shrink-0" />
                      )}
                      <span className={`text-sm ${f.included ? "text-white/70" : "text-white/25"}`}>{f.text}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link
                  href="/sign-in"
                  className={`w-full py-3 rounded-2xl text-sm font-semibold text-center transition-all duration-300 hover:scale-105 ${plan.ctaClass}`}
                >
                  {plan.cta}
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Mobile pagination dots */}
          <div className="flex justify-center gap-2 mt-4 md:hidden">
            {plans.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  const carousel = document.querySelector('.scrollbar-hide') as HTMLElement;
                  if (carousel) {
                    const cardWidth = (carousel as any).offsetWidth * 0.85;
                    carousel.scrollTo({ left: i * cardWidth, behavior: 'smooth' });
                  }
                }}
                className={`w-2 h-2 rounded-full transition-all ${activeCard === i ? 'bg-white/60 w-6' : 'bg-white/20'}`}
              />
            ))}
          </div>
        </div>

        {/* Money back */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-white/30 text-sm mt-8"
        >
          🔒 30-day money-back guarantee · No credit card required for trial · Cancel anytime
        </motion.p>
      </div>
    </section>
  );
}
