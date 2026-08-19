"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Zap, Code2, Database, Server, Shield, ExternalLink, Download, Mail } from "lucide-react";
import { useState } from "react";

const quickViewData = {
  name: "MAHAMMAD BILAL HYDER",
  role: "CSE Student | Full-Stack Developer",
  tagline: "Building real-world applications with modern web technologies.",
  skills: [
    "Next.js 14, React 18, TypeScript",
    "Node.js, PostgreSQL, Prisma ORM",
    "JWT Authentication, RBAC",
    "Tailwind CSS, Framer Motion",
    "C++, DSA Problem Solving",
  ],
  topProjects: [
    {
      name: "Alpha Edu Hub",
      description: "Complete school management platform with 5+ user roles, 60+ API endpoints, and full authentication.",
      tech: "Next.js, PostgreSQL, JWT",
    },
  ],
  experience: [
    "Built production-ready full-stack applications",
    "Implemented complex authentication systems",
    "Designed database schemas with 20+ models",
    "Deployed applications on Render and Vercel",
  ],
  achievements: [
    "Developed multi-role education platform",
    "Implemented role-based access control",
    "Built 60+ REST API endpoints",
    "Created responsive UI with modern frameworks",
  ],
  contact: {
    email: "bilalhyder889@gmail.com",
    phone: "+91 82773 00451",
    linkedin: "https://www.linkedin.com/in/mahammad-bilal-hyder-493295356",
    github: "https://github.com/bilalhydercodes",
  },
};

export default function RecruiterQuickView() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Toggle Button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-50 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg shadow-lg shadow-indigo-500/30 transition-all hover:scale-105"
      >
        <Zap className="w-4 h-05 inline mr-2" />
        Recruiter Quick View
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-4 md:inset-10 lg:inset-20 bg-[#050816] border border-white/10 rounded-2xl overflow-hidden z-50 flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-indigo-400" />
                  <h2 className="text-xl font-bold text-white">Recruiter Quick View</h2>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white/60 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {/* About */}
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">{quickViewData.name}</h3>
                  <p className="text-indigo-400 font-semibold mb-2">{quickViewData.role}</p>
                  <p className="text-gray-400">{quickViewData.tagline}</p>
                </div>

                {/* Skills */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <Code2 className="w-5 h-5 text-blue-400" />
                    Top Skills
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {quickViewData.skills.map((skill) => (
                      <span key={skill} className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Featured Project */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <Database className="w-5 h-5 text-green-400" />
                    Featured Project
                  </h4>
                  {quickViewData.topProjects.map((project) => (
                    <div key={project.name} className="p-4 bg-white/5 border border-white/10 rounded-xl">
                      <h5 className="text-white font-semibold mb-2">{project.name}</h5>
                      <p className="text-gray-400 text-sm mb-2">{project.description}</p>
                      <p className="text-indigo-400 text-xs">{project.tech}</p>
                    </div>
                  ))}
                </div>

                {/* Experience */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <Server className="w-5 h-5 text-purple-400" />
                    What I&apos;ve Built
                  </h4>
                  <ul className="space-y-2">
                    {quickViewData.experience.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-gray-300 text-sm">
                        <Shield className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Achievements */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    Key Achievements
                  </h4>
                  <ul className="space-y-2">
                    {quickViewData.achievements.map((achievement) => (
                      <li key={achievement} className="flex items-start gap-2 text-gray-300 text-sm">
                        <Shield className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                        <span>{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Contact */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <Mail className="w-5 h-5 text-red-400" />
                    Contact
                  </h4>
                  <div className="space-y-2">
                    <a href={`mailto:${quickViewData.contact.email}`} className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
                      <Mail className="w-4 h-4" />
                      {quickViewData.contact.email}
                    </a>
                    <a href={`tel:${quickViewData.contact.phone}`} className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
                      <Shield className="w-4 h-4" />
                      {quickViewData.contact.phone}
                    </a>
                    <a
                      href={quickViewData.contact.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      LinkedIn
                    </a>
                    <a
                      href={quickViewData.contact.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      GitHub
                    </a>
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="p-6 border-t border-white/10 flex gap-3">
                <a
                  href="/resume.pdf"
                  download
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg transition-all"
                >
                  <Download className="w-4 h-4" />
                  Download Resume
                </a>
                <a
                  href="mailto:bilalhyder889@gmail.com"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg transition-all"
                >
                  <Mail className="w-4 h-4" />
                  Contact
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
