"use client";

import { motion } from "framer-motion";
import { 
  Server, 
  Database, 
  Shield, 
  Lock, 
  Code2, 
  Globe, 
  Layout, 
  Layers,
  ArrowRight,
  CheckCircle,
  Cpu,
  HardDrive,
  Network,
  Zap
} from "lucide-react";

export default function TechnicalArchitecture() {
  return (
    <section id="technical-architecture" className="py-24 bg-gradient-to-b from-[#050816] to-[#0a0f1e] relative overflow-hidden scroll-mt-20">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[120px]" />
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
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-6">
            <Cpu className="w-4 h-4 text-blue-400" />
            <span className="text-blue-400 text-sm font-medium">Technical Architecture</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Built as a Complete Full-Stack Platform
          </h2>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            Scalable frontend, backend, database, authentication, and role-based access system — 
            not just a UI demo, but a production-ready platform.
          </p>
        </motion.div>

        {/* What I Built */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl p-8 mb-16"
        >
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">What I Built</h3>
              <p className="text-gray-300 leading-relaxed">
                Alpha Edu Hub is not just a UI project — it includes a functional full-stack system with 
                JWT authentication, 5+ user roles with distinct dashboards, 60+ REST API endpoints, 
                PostgreSQL database integration with 20+ related models, role-based access control, 
                and production deployment configurations for Render and Vercel.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Architecture Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {/* Frontend */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-blue-500/30 transition-all"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Layout className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="text-lg font-bold text-white">Frontend</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-gray-300 text-sm">
                <Code2 className="w-4 h-4 text-blue-400" />
                <span><strong className="text-white">Next.js 14.2.5</strong> — React framework with App Router for server-side rendering</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300 text-sm">
                <Code2 className="w-4 h-4 text-blue-400" />
                <span><strong className="text-white">React 18</strong> — Component-based UI with hooks and state management</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300 text-sm">
                <Code2 className="w-4 h-4 text-blue-400" />
                <span><strong className="text-white">TypeScript</strong> — Type-safe development with full type coverage</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300 text-sm">
                <Code2 className="w-4 h-4 text-blue-400" />
                <span><strong className="text-white">Tailwind CSS</strong> — Utility-first styling with responsive design</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300 text-sm">
                <Code2 className="w-4 h-4 text-blue-400" />
                <span><strong className="text-white">Framer Motion</strong> — Smooth animations and micro-interactions</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300 text-sm">
                <Code2 className="w-4 h-4 text-blue-400" />
                <span><strong className="text-white">Recharts</strong> — Data visualization for analytics dashboards</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300 text-sm">
                <Code2 className="w-4 h-4 text-blue-400" />
                <span><strong className="text-white">React Hook Form</strong> — Form management with validation</span>
              </div>
            </div>
          </motion.div>

          {/* Backend */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-purple-500/30 transition-all"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <Server className="w-5 h-5 text-purple-400" />
              </div>
              <h3 className="text-lg font-bold text-white">Backend</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-gray-300 text-sm">
                <Server className="w-4 h-4 text-purple-400" />
                <span><strong className="text-white">Next.js API Routes</strong> — 60+ RESTful endpoints organized by role</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300 text-sm">
                <Server className="w-4 h-4 text-purple-400" />
                <span><strong className="text-white">Node.js 18+</strong> — Server-side JavaScript runtime</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300 text-sm">
                <Server className="w-4 h-4 text-purple-400" />
                <span><strong className="text-white">Custom Server</strong> — Node.js HTTP server with Next.js integration</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300 text-sm">
                <Server className="w-4 h-4 text-purple-400" />
                <span><strong className="text-white">Prisma ORM</strong> — Type-safe database access with migrations</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300 text-sm">
                <Server className="w-4 h-4 text-purple-400" />
                <span><strong className="text-white">jose (JWT)</strong> — Edge-compatible JWT token signing/verification</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300 text-sm">
                <Server className="w-4 h-4 text-purple-400" />
                <span><strong className="text-white">bcryptjs</strong> — Secure password hashing (12 salt rounds)</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300 text-sm">
                <Server className="w-4 h-4 text-purple-400" />
                <span><strong className="text-white">Rate Limiting</strong> — API protection against brute force attacks</span>
              </div>
            </div>
          </motion.div>

          {/* Database */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-green-500/30 transition-all"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                <Database className="w-5 h-5 text-green-400" />
              </div>
              <h3 className="text-lg font-bold text-white">Database</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-gray-300 text-sm">
                <Database className="w-4 h-4 text-green-400" />
                <span><strong className="text-white">PostgreSQL</strong> — Relational database with complex relationships</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300 text-sm">
                <Database className="w-4 h-4 text-green-400" />
                <span><strong className="text-white">20+ Data Models</strong> — User, School, Teacher, Student, Parent, Class, Grade, Subject, Lesson, Exam, Assignment, Result, Attendance, Announcement, etc.</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300 text-sm">
                <Database className="w-4 h-4 text-green-400" />
                <span><strong className="text-white">Relational Schema</strong> — Complex foreign key relationships and cascading deletes</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300 text-sm">
                <Database className="w-4 h-4 text-green-400" />
                <span><strong className="text-white">Data Types</strong> — Enums for roles, statuses, subscription plans, and priorities</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300 text-sm">
                <Database className="w-4 h-4 text-green-400" />
                <span><strong className="text-white">JSON Fields</strong> — Flexible metadata storage for permissions and features</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300 text-sm">
                <Database className="w-4 h-4 text-green-400" />
                <span><strong className="text-white">Migrations</strong> — Database schema versioning with Prisma</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300 text-sm">
                <Database className="w-4 h-4 text-green-400" />
                <span><strong className="text-white">Seed Data</strong> — Demo data generation for testing and development</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Authentication Flow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 mb-16"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-red-400" />
            </div>
            <h3 className="text-xl font-bold text-white">Authentication & Authorization</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Role Hierarchy */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Role-Based Access Control</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                  <div className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center">
                    <span className="text-yellow-400 text-sm">👑</span>
                  </div>
                  <div>
                    <div className="text-white font-medium">Super Admin</div>
                    <div className="text-gray-400 text-xs">Full system control & multi-school management</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg ml-4">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <span className="text-blue-400 text-sm">🛡️</span>
                  </div>
                  <div>
                    <div className="text-white font-medium">School Admin</div>
                    <div className="text-gray-400 text-xs">School operations & user management</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg ml-8">
                  <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                    <span className="text-green-400 text-sm">👨‍🏫</span>
                  </div>
                  <div>
                    <div className="text-white font-medium">Teacher</div>
                    <div className="text-gray-400 text-xs">Classroom management & grading</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg ml-12">
                  <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
                    <span className="text-purple-400 text-sm">👨‍🎓</span>
                  </div>
                  <div>
                    <div className="text-white font-medium">Student</div>
                    <div className="text-gray-400 text-xs">Academic portal & progress tracking</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg ml-12">
                  <div className="w-8 h-8 bg-pink-500/20 rounded-full flex items-center justify-center">
                    <span className="text-pink-400 text-sm">👪</span>
                  </div>
                  <div>
                    <div className="text-white font-medium">Parent</div>
                    <div className="text-gray-400 text-xs">Child monitoring & communication</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Auth Flow */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Authentication Flow</h4>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-400 text-xs font-bold">1</span>
                  </div>
                  <div className="text-gray-300 text-sm">User submits credentials via login form</div>
                </div>
                <div className="flex items-center gap-3">
                  <ArrowRight className="w-4 h-4 text-gray-600 ml-4" />
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-400 text-xs font-bold">2</span>
                  </div>
                  <div className="text-gray-300 text-sm">Server validates credentials (bcrypt password comparison)</div>
                </div>
                <div className="flex items-center gap-3">
                  <ArrowRight className="w-4 h-4 text-gray-600 ml-4" />
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-400 text-xs font-bold">3</span>
                  </div>
                  <div className="text-gray-300 text-sm">JWT access token (15min) + refresh token (7days) generated</div>
                </div>
                <div className="flex items-center gap-3">
                  <ArrowRight className="w-4 h-4 text-gray-600 ml-4" />
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-400 text-xs font-bold">4</span>
                  </div>
                  <div className="text-gray-300 text-sm">Tokens stored in HTTP-only cookies (secure)</div>
                </div>
                <div className="flex items-center gap-3">
                  <ArrowRight className="w-4 h-4 text-gray-600 ml-4" />
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-400 text-xs font-bold">5</span>
                  </div>
                  <div className="text-gray-300 text-sm">Role verification & authorization check</div>
                </div>
                <div className="flex items-center gap-3">
                  <ArrowRight className="w-4 h-4 text-gray-600 ml-4" />
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-green-400 text-xs font-bold">6</span>
                  </div>
                  <div className="text-gray-300 text-sm">Redirect to role-specific dashboard</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Security & API */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {/* Security */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-red-500/30 transition-all"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                <Lock className="w-5 h-5 text-red-400" />
              </div>
              <h3 className="text-lg font-bold text-white">Security</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-gray-300 text-sm">
                <Lock className="w-4 h-4 text-red-400" />
                <span><strong className="text-white">Password Hashing</strong> — bcryptjs with 12 salt rounds</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300 text-sm">
                <Lock className="w-4 h-4 text-red-400" />
                <span><strong className="text-white">HTTP-Only Cookies</strong> — Secure token storage (XSS protection)</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300 text-sm">
                <Lock className="w-4 h-4 text-red-400" />
                <span><strong className="text-white">JWT Tokens</strong> — Short-lived access + long-lived refresh tokens</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300 text-sm">
                <Lock className="w-4 h-4 text-red-400" />
                <span><strong className="text-white">Security Headers</strong> — CSP, HSTS, X-Frame-Options, etc.</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300 text-sm">
                <Lock className="w-4 h-4 text-red-400" />
                <span><strong className="text-white">Rate Limiting</strong> — API brute force protection</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300 text-sm">
                <Lock className="w-4 h-4 text-red-400" />
                <span><strong className="text-white">Environment Variables</strong> — Secure secret management</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300 text-sm">
                <Lock className="w-4 h-4 text-red-400" />
                <span><strong className="text-white">Input Validation</strong> — Zod schema validation</span>
              </div>
            </div>
          </motion.div>

          {/* API Architecture */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-cyan-500/30 transition-all"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                <Network className="w-5 h-5 text-cyan-400" />
              </div>
              <h3 className="text-lg font-bold text-white">API Architecture</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-gray-300 text-sm">
                <Globe className="w-4 h-4 text-cyan-400" />
                <span><strong className="text-white">Next.js API Routes</strong> — 60+ RESTful endpoints</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300 text-sm">
                <Network className="w-4 h-4 text-cyan-400" />
                <span><strong className="text-white">Role-Based Routes</strong> — /api/auth/*, /api/teacher/*, /api/admin/*, etc.</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300 text-sm">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span><strong className="text-white">Request Flow:</strong> Frontend → API → Controller → Database → Response</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300 text-sm">
                <Zap className="w-4 h-4 text-cyan-400" />
                <span><strong className="text-white">Server-Side Rendering</strong> — Next.js App Router with RSC</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300 text-sm">
                <HardDrive className="w-4 h-4 text-cyan-400" />
                <span><strong className="text-white">Custom Server</strong> — Node.js HTTP server for production</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300 text-sm">
                <Server className="w-4 h-4 text-cyan-400" />
                <span><strong className="text-white">Middleware</strong> — Auth verification and rate limiting</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Deployment */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mb-16"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
              <Globe className="w-5 h-5 text-orange-400" />
            </div>
            <h3 className="text-lg font-bold text-white">Deployment</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-gray-300 text-sm">
                <Globe className="w-4 h-4 text-orange-400" />
                <span><strong className="text-white">Render</strong> — render.yaml configuration with PostgreSQL</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300 text-sm">
                <Globe className="w-4 h-4 text-orange-400" />
                <span><strong className="text-white">Vercel</strong> — vercel.json configuration for frontend</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300 text-sm">
                <Globe className="w-4 h-4 text-orange-400" />
                <span><strong className="text-white">Custom Server</strong> — Node.js server.js for production</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300 text-sm">
                <Globe className="w-4 h-4 text-orange-400" />
                <span><strong className="text-white">Environment Config</strong> — .env management for secrets</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-gray-300 text-sm">
                <Globe className="w-4 h-4 text-orange-400" />
                <span><strong className="text-white">Build Process</strong> — npm run build with Next.js optimization</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300 text-sm">
                <Globe className="w-4 h-4 text-orange-400" />
                <span><strong className="text-white">Production Ready</strong> — Security headers and CSP configured</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300 text-sm">
                <Globe className="w-4 h-4 text-orange-400" />
                <span><strong className="text-white">Database Migrations</strong> — Prisma migrate for schema updates</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300 text-sm">
                <Globe className="w-4 h-4 text-orange-400" />
                <span><strong className="text-white">Image Optimization</strong> — Cloudinary integration (optional)</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tech Stack Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-white/10 rounded-2xl p-8"
        >
          <h3 className="text-2xl font-bold text-white mb-6 text-center">Tech Stack Summary</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <h4 className="text-blue-400 font-semibold mb-3 text-sm uppercase tracking-wider">Frontend</h4>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs">Next.js 14</span>
                <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs">React 18</span>
                <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs">TypeScript</span>
                <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs">Tailwind CSS</span>
                <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs">Framer Motion</span>
                <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs">Recharts</span>
              </div>
            </div>
            <div>
              <h4 className="text-purple-400 font-semibold mb-3 text-sm uppercase tracking-wider">Backend</h4>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs">Node.js 18+</span>
                <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs">Next.js API</span>
                <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs">Prisma ORM</span>
                <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs">JWT (jose)</span>
                <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs">bcryptjs</span>
              </div>
            </div>
            <div>
              <h4 className="text-green-400 font-semibold mb-3 text-sm uppercase tracking-wider">Database</h4>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-xs">PostgreSQL</span>
                <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-xs">Prisma</span>
                <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-xs">20+ Models</span>
              </div>
            </div>
            <div>
              <h4 className="text-red-400 font-semibold mb-3 text-sm uppercase tracking-wider">Auth & Security</h4>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-red-500/20 text-red-300 rounded-full text-xs">JWT Auth</span>
                <span className="px-3 py-1 bg-red-500/20 text-red-300 rounded-full text-xs">RBAC</span>
                <span className="px-3 py-1 bg-red-500/20 text-red-300 rounded-full text-xs">HTTP-Only Cookies</span>
                <span className="px-3 py-1 bg-red-500/20 text-red-300 rounded-full text-xs">Rate Limiting</span>
              </div>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-white/10">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-orange-400 font-semibold mb-3 text-sm uppercase tracking-wider">Deployment</h4>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-orange-500/20 text-orange-300 rounded-full text-xs">Render</span>
                  <span className="px-3 py-1 bg-orange-500/20 text-orange-300 rounded-full text-xs">Vercel</span>
                  <span className="px-3 py-1 bg-orange-500/20 text-orange-300 rounded-full text-xs">Custom Server</span>
                </div>
              </div>
              <div>
                <h4 className="text-cyan-400 font-semibold mb-3 text-sm uppercase tracking-wider">Development</h4>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full text-xs">ESLint</span>
                  <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full text-xs">TypeScript</span>
                  <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full text-xs">Git</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}