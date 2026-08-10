"use client";

import { motion, type Variants } from "framer-motion";
import {
  BarChart3,
  Bell,
  BookOpen,
  Calendar,
  ClipboardList,
  GraduationCap,
  MessageSquare,
  Shield,
  Smartphone,
  Users,
  Zap,
  Globe,
} from "lucide-react";

const features = [
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description: "Real-time dashboards with deep insights into student performance, attendance trends, and school-wide metrics.",
    gradient: "from-blue-500 to-cyan-500",
    glow: "group-hover:shadow-blue-500/20",
    badge: "Popular",
  },
  {
    icon: Users,
    title: "Student Management",
    description: "Comprehensive profiles, enrollment workflows, and progress tracking — all in one streamlined interface.",
    gradient: "from-purple-500 to-pink-500",
    glow: "group-hover:shadow-purple-500/20",
  },
  {
    icon: Calendar,
    title: "Smart Scheduling",
    description: "AI-assisted timetable generation that eliminates conflicts and optimizes resource allocation automatically.",
    gradient: "from-violet-500 to-purple-500",
    glow: "group-hover:shadow-violet-500/20",
  },
  {
    icon: ClipboardList,
    title: "Attendance Tracking",
    description: "One-click mark, QR-based check-in, and automated parent notifications when a student is absent.",
    gradient: "from-emerald-500 to-teal-500",
    glow: "group-hover:shadow-emerald-500/20",
    badge: "New",
  },
  {
    icon: GraduationCap,
    title: "Exam & Results",
    description: "Build, schedule, and auto-grade exams. Generate report cards with a single click.",
    gradient: "from-orange-500 to-amber-500",
    glow: "group-hover:shadow-orange-500/20",
  },
  {
    icon: MessageSquare,
    title: "Parent Communication",
    description: "Direct messaging, announcements, and progress reports delivered instantly to parents' devices.",
    gradient: "from-pink-500 to-rose-500",
    glow: "group-hover:shadow-pink-500/20",
  },
  {
    icon: Bell,
    title: "Smart Notifications",
    description: "Context-aware alerts for deadlines, events, and performance milestones — no noise, just signal.",
    gradient: "from-yellow-500 to-orange-500",
    glow: "group-hover:shadow-yellow-500/20",
  },
  {
    icon: Smartphone,
    title: "Mobile First",
    description: "Native apps for iOS and Android. Full functionality wherever teachers, students, or parents are.",
    gradient: "from-indigo-500 to-blue-500",
    glow: "group-hover:shadow-indigo-500/20",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Role-based access, end-to-end encryption, and SOC 2 compliance protecting every piece of data.",
    gradient: "from-slate-400 to-slate-600",
    glow: "group-hover:shadow-slate-500/20",
  },
  {
    icon: BookOpen,
    title: "Curriculum Builder",
    description: "Design and align syllabi to national standards. Attach resources, videos, and assessments effortlessly.",
    gradient: "from-teal-500 to-cyan-500",
    glow: "group-hover:shadow-teal-500/20",
  },
  {
    icon: Globe,
    title: "Multi-Language",
    description: "Full interface localization in 20+ languages. Serve diverse communities without language barriers.",
    gradient: "from-blue-400 to-indigo-500",
    glow: "group-hover:shadow-blue-400/20",
  },
  {
    icon: Zap,
    title: "Instant Setup",
    description: "Go live in under 24 hours. Import existing data, configure roles, and onboard staff effortlessly.",
    gradient: "from-amber-400 to-yellow-500",
    glow: "group-hover:shadow-amber-400/20",
  },
];

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function Features() {
  return (
    <section id="features" className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-sm font-medium mb-4">
            <Zap className="w-3.5 h-3.5" />
            Everything you need
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4 leading-tight">
            Built for modern{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              education
            </span>
          </h2>
          <p className="text-white/50 text-lg max-w-2xl mx-auto">
            Every feature is crafted to save time, reduce admin overhead, and create better outcomes for students.
          </p>
        </motion.div>

        {/* Features grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-2 gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-4"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={cardVariants}
              className={`group relative rounded-xl border border-white/8 bg-white/3 hover:bg-white/6 backdrop-blur-sm p-3 md:p-5 transition-all duration-300 hover:border-white/15 hover:shadow-xl ${feature.glow} cursor-default overflow-hidden`}
            >
              {/* Badge */}
              {feature.badge && (
                <div className="absolute top-2 right-2 md:top-3 md:right-3 px-1.5 py-0.5 md:px-2 rounded-full text-[9px] md:text-[10px] font-semibold bg-gradient-to-r from-blue-500/30 to-purple-500/30 border border-blue-500/30 text-blue-300">
                  {feature.badge}
                </div>
              )}

              {/* Icon */}
              <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-2 md:mb-4 shadow-lg`}>
                <feature.icon className="w-4 h-4 md:w-5 md:h-5 text-white" />
              </div>

              <h3 className="text-white font-semibold text-xs md:text-sm mb-1 md:mb-2 leading-tight">{feature.title}</h3>
              <p className="text-white/45 text-[11px] md:text-xs leading-snug md:leading-relaxed line-clamp-3 md:line-clamp-none">{feature.description}</p>

              {/* Hover glow */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-xl md:rounded-2xl pointer-events-none`} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
