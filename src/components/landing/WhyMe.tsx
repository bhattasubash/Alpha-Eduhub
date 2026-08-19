"use client";

import { motion } from "framer-motion";
import { Rocket, Brain, Cpu, TrendingUp } from "lucide-react";

const reasons = [
  {
    icon: Rocket,
    title: "I Build",
    description: "Real-world full-stack applications instead of only tutorial projects.",
    color: "from-red-500/20 to-red-600/10",
    borderColor: "border-red-500/20",
    iconColor: "text-red-400",
  },
  {
    icon: Brain,
    title: "I Solve Problems",
    description: "Actively developing my C++ and DSA problem-solving skills.",
    color: "from-blue-500/20 to-blue-600/10",
    borderColor: "border-blue-500/20",
    iconColor: "text-blue-400",
  },
  {
    icon: Cpu,
    title: "I Understand Full-Stack Systems",
    description: "Frontend → Backend → API → Database → Authentication → Deployment.",
    color: "from-purple-500/20 to-purple-600/10",
    borderColor: "border-purple-500/20",
    iconColor: "text-purple-400",
  },
  {
    icon: TrendingUp,
    title: "I'm Still Growing",
    description: "I'm a CSE student actively building, learning, and gaining practical experience.",
    color: "from-red-500/20 to-blue-500/10",
    borderColor: "border-red-500/20",
    iconColor: "text-red-400",
  },
];

export default function WhyMe() {
  return (
    <section id="why-me" className="py-24 bg-gradient-to-b from-[#050816] to-[#0a0f1e] relative overflow-hidden scroll-mt-20">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-red-600/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Why <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-blue-400">Me?</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Here&apos;s what makes me different from other candidates.
          </p>
        </motion.div>

        {/* Reasons Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {reasons.map((reason, index) => (
            <motion.div
              key={reason.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`bg-gradient-to-br ${reason.color} border ${reason.borderColor} rounded-2xl p-8 hover-lift`}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center">
                  <reason.icon className={`w-7 h-7 ${reason.iconColor}`} />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">{reason.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{reason.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
