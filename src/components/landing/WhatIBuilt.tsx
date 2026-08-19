"use client";

import { motion } from "framer-motion";
import { Layout, Server, Database, Lock, Globe, CheckCircle } from "lucide-react";

const categories = [
  {
    icon: Layout,
    title: "Frontend",
    color: "from-red-500/20 to-red-600/10",
    borderColor: "border-red-500/20",
    iconColor: "text-red-400",
    items: [
      "UI development with React 18 and Next.js 14",
      "Responsive interfaces with Tailwind CSS",
      "Forms & validation with React Hook Form",
      "Data visualization with Recharts",
      "Smooth animations with Framer Motion",
      "Type-safe development with TypeScript",
    ],
  },
  {
    icon: Server,
    title: "Backend",
    color: "from-blue-500/20 to-blue-600/10",
    borderColor: "border-blue-500/20",
    iconColor: "text-blue-400",
    items: [
      "60+ REST API endpoints with Next.js API Routes",
      "Server-side logic and business rules",
      "JWT authentication with access & refresh tokens",
      "Role-based authorization middleware",
      "Custom Node.js server for production",
      "Rate limiting for API protection",
    ],
  },
  {
    icon: Database,
    title: "Database",
    color: "from-purple-500/20 to-purple-600/10",
    borderColor: "border-purple-500/20",
    iconColor: "text-purple-400",
    items: [
      "Data modeling with Prisma ORM",
      "20+ related database models",
      "CRUD operations for all entities",
      "Complex relationships and foreign keys",
      "Database migrations and schema versioning",
      "Seed data for testing and development",
    ],
  },
  {
    icon: Lock,
    title: "Security",
    color: "from-red-500/20 to-red-600/10",
    borderColor: "border-red-500/20",
    iconColor: "text-red-400",
    items: [
      "Password hashing with bcryptjs (12 salt rounds)",
      "Protected routes with middleware",
      "Role-based permissions (5+ user roles)",
      "HTTP-only cookies for token storage",
      "Security headers (CSP, HSTS, X-Frame-Options)",
      "Input validation with Zod schemas",
    ],
  },
  {
    icon: Globe,
    title: "Deployment",
    color: "from-orange-500/20 to-orange-600/10",
    borderColor: "border-orange-500/20",
    iconColor: "text-orange-400",
    items: [
      "Production deployment on Render",
      "Frontend deployment on Vercel",
      "Environment configuration management",
      "Database migrations in production",
      "Custom server configuration",
      "Build optimization with Next.js",
    ],
  },
];

export default function WhatIBuilt() {
  return (
    <section id="what-i-built" className="py-24 bg-gradient-to-b from-[#0a0f1e] to-[#050816] relative overflow-hidden scroll-mt-20">
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
          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-2 mb-6">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span className="text-green-400 text-sm font-medium">Technical Depth</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            What I <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-blue-400">Actually Built</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            Real implementation details — not just technology buzzwords. Here&apos;s what I&apos;ve
            actually built and deployed.
          </p>
        </motion.div>

        {/* Categories Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`bg-gradient-to-br ${category.color} border ${category.borderColor} rounded-2xl p-6 hover-lift`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                  <category.icon className={`w-6 h-6 ${category.iconColor}`} />
                </div>
                <h3 className="text-xl font-bold text-white">{category.title}</h3>
              </div>
              <ul className="space-y-3">
                {category.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start gap-2 text-gray-300 text-sm">
                    <CheckCircle className={`w-4 h-4 ${category.iconColor} flex-shrink-0 mt-0.5`} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 text-center"
        >
          <p className="text-gray-400 text-sm max-w-2xl mx-auto">
            All features listed above are implemented in the Alpha Edu Hub project. 
            No placeholder features — everything shown is functional and deployed.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
