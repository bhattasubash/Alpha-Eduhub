"use client";

import { motion, useInView } from "framer-motion";
import { useState } from "react";
import { Download, ExternalLink, Mail, Phone, Award, Code, Briefcase, GraduationCap, X, ZoomIn, ZoomOut } from "lucide-react";
import { useRef } from "react";
import html2pdf from "html2pdf.js";

const profile = {
  name: "Mahammad Bilal Hyder",
  role: "CSE Student | Full-Stack Developer",
  location: "Lovely Professional University, Punjab, India",
  summary: "CSE student at Lovely Professional University focused on full-stack web development, backend systems, databases, and problem solving with C++. I enjoy turning ideas into functional real-world applications and building projects that combine frontend, backend, authentication, databases, and deployment. Currently strengthening my DSA and software development skills while actively building and improving production-oriented projects.",
  education: {
    degree: "Bachelor of Technology — Computer Science & Engineering",
    institution: "Lovely Professional University, Punjab",
    year: "2nd Year",
    cgpa: "8.2 / 10"
  },
  skills: {
    programming: ["C++", "JavaScript", "Python"],
    frontend: ["HTML", "CSS", "JavaScript", "React", "Next.js"],
    backend: ["Node.js", "Express.js", "REST APIs"],
    databases: ["MongoDB"],
    tools: ["Prisma", "JWT", "Cloudinary", "Git", "GitHub", "VS Code"],
    problemSolving: ["Data Structures & Algorithms", "C++", "LeetCode"]
  },
  projects: [
    {
      name: "Alpha Edu Hub",
      description: "Full-Stack Education Management Platform",
      details: [
        "Multi-role platform with Super Admin, Admin, Teacher, Student roles",
        "Authentication and role-based authorization",
        "Backend APIs with database integration",
        "Dashboards for different user types",
        "Production deployment"
      ],
      liveDemo: "/demo-login",
      github: "https://github.com/bilalhydercodes"
    },
    {
      name: "AI Mic System",
      description: "AI-powered audio processing system",
      details: [
        "Real-time audio processing",
        "AI integration for speech recognition"
      ],
      liveDemo: "#",
      github: "https://github.com/bilalhydercodes"
    },
    {
      name: "Personal Portfolio",
      description: "Interactive 3D Developer Portfolio",
      details: [
        "Interactive 3D environment with city background",
        "Responsive design for all devices",
        "Project showcase with detailed views",
        "Recruiter-focused UX and navigation"
      ],
      liveDemo: "/",
      github: "https://github.com/bilalhydercodes"
    }
  ],
  achievement: {
    title: "2nd Position — SemiXthon'26",
    track: "Human Device Interface Track",
    team: "Team Nanologic",
    institution: "Delhi Technological University",
    date: "13 April 2026",
    description: "Secured 2nd position in the Human Device Interface track at SemiXthon'26, organized by VDSemiX along with the Semicon Society at Delhi Technological University.",
    certificate: "/certificate.jpg.png"
  },
  coding: {
    language: "C++",
    platform: "LeetCode",
    focus: [
      "Arrays",
      "Strings",
      "Searching",
      "Sorting",
      "Two Pointers",
      "Binary Search",
      "Hashing",
      "Problem Solving"
    ],
    leetcode: "https://leetcode.com"
  },
  experience: "Currently building real-world projects and gaining practical development experience.",
  contact: {
    email: "bilalhyder889@gmail.com",
    github: "https://github.com/bilalhydercodes",
    linkedin: "#",
    leetcode: "https://leetcode.com"
  }
};

export default function Resume() {
  const [certificateOpen, setCertificateOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const ref = useRef(null);
  const resumeRef = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.5));
  const handleResetZoom = () => setZoom(1);
  
  const handleDownloadPDF = () => {
    const element = resumeRef.current;
    if (!element) return;

    const opt = {
      margin: 0,
      filename: 'Mahammad_Bilal_Hyder_Resume.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
  };

  return (
    <section id="resume" className="py-24 bg-gradient-to-b from-[#050816] to-[#0a0f1e] relative overflow-hidden scroll-mt-20">
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
            MISSION <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-blue-400">PROFILE</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Professional overview and credentials
          </p>
        </motion.div>

        {/* Mission Profile Panel */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="max-w-5xl mx-auto"
        >
          {/* Glass Panel */}
          <div ref={resumeRef} className="bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-3xl backdrop-blur-xl overflow-hidden relative">
            {/* Web strand effect */}
            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-red-500 via-blue-500 to-red-500 opacity-50" />
            
            {/* Header */}
            <div className="p-8 md:p-12 border-b border-white/10">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                  <motion.h3
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ delay: 0.2 }}
                    className="text-3xl md:text-4xl font-bold text-white mb-2"
                  >
                    {profile.name}
                  </motion.h3>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ delay: 0.3 }}
                    className="text-blue-400 font-medium text-lg"
                  >
                    {profile.role}
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ delay: 0.4 }}
                    className="text-gray-400 text-sm mt-1"
                  >
                    {profile.location}
                  </motion.p>
                </div>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.5 }}
                  className="flex flex-col sm:flex-row gap-3"
                >
                  <button
                    onClick={handleDownloadPDF}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-blue-600 hover:from-red-500 hover:to-blue-500 text-white font-medium rounded-xl transition-all duration-300 hover:scale-105 shadow-lg shadow-red-500/30"
                  >
                    <Download className="w-4 h-4" />
                    Download Resume
                  </button>
                  <a
                    href="#contact"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-white/20 bg-white/5 hover:bg-white/10 text-white font-medium rounded-xl transition-all duration-300"
                  >
                    <Mail className="w-4 h-4" />
                    Contact Me
                  </a>
                </motion.div>
              </div>
            </div>

            {/* Resume Content */}
            <div className="p-8 md:p-12 space-y-8">
              {/* Summary */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.6 }}
              >
                <h4 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-red-400" />
                  Professional Summary
                </h4>
                <p className="text-gray-300 leading-relaxed">
                  {profile.summary}
                </p>
              </motion.div>

              {/* Education */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.7 }}
              >
                <h4 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-blue-400" />
                  Education
                </h4>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <p className="text-white font-medium">{profile.education.degree}</p>
                  <p className="text-gray-400">{profile.education.institution}</p>
                  <div className="flex flex-wrap gap-4 mt-2 text-sm">
                    <span className="text-blue-400">{profile.education.year}</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-red-400 font-medium">CGPA: {profile.education.cgpa}</span>
                  </div>
                </div>
              </motion.div>

              {/* Technical Skills */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.8 }}
              >
                <h4 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                  <Code className="w-5 h-5 text-red-400" />
                  Technical Skills
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <p className="text-blue-400 font-medium mb-2">Programming</p>
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.programming.map((skill) => (
                        <span key={skill} className="px-3 py-1 bg-white/10 rounded-full text-sm text-gray-300">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <p className="text-blue-400 font-medium mb-2">Frontend</p>
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.frontend.map((skill) => (
                        <span key={skill} className="px-3 py-1 bg-white/10 rounded-full text-sm text-gray-300">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <p className="text-blue-400 font-medium mb-2">Backend</p>
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.backend.map((skill) => (
                        <span key={skill} className="px-3 py-1 bg-white/10 rounded-full text-sm text-gray-300">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <p className="text-blue-400 font-medium mb-2">Databases</p>
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.databases.map((skill) => (
                        <span key={skill} className="px-3 py-1 bg-white/10 rounded-full text-sm text-gray-300">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <p className="text-blue-400 font-medium mb-2">Tools & Technologies</p>
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.tools.map((skill) => (
                        <span key={skill} className="px-3 py-1 bg-white/10 rounded-full text-sm text-gray-300">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <p className="text-blue-400 font-medium mb-2">Problem Solving</p>
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.problemSolving.map((skill) => (
                        <span key={skill} className="px-3 py-1 bg-white/10 rounded-full text-sm text-gray-300">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Featured Projects */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.9 }}
              >
                <h4 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-blue-400" />
                  Featured Projects
                </h4>
                <div className="space-y-4">
                  {profile.projects.map((project, index) => (
                    <div key={index} className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-red-500/30 transition-all duration-300">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div className="flex-1">
                          <h5 className="text-white font-bold text-lg mb-1">{project.name}</h5>
                          <p className="text-blue-400 text-sm mb-2">{project.description}</p>
                          <ul className="text-gray-400 text-sm space-y-1">
                            {project.details.map((detail, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="text-red-400 mt-1">•</span>
                                {detail}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="flex gap-2">
                          {project.liveDemo && (
                            <a
                              href={project.liveDemo}
                              className="inline-flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-red-600 to-blue-600 text-white text-sm rounded-lg hover:from-red-500 hover:to-blue-500 transition-all"
                            >
                              <ExternalLink className="w-3 h-3" />
                              Live Demo
                            </a>
                          )}
                          {project.github && (
                            <a
                              href={project.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-4 py-2 border border-white/20 bg-white/5 text-white text-sm rounded-lg hover:bg-white/10 transition-all"
                            >
                              <ExternalLink className="w-3 h-3" />
                              GitHub
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Achievement */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 1 }}
              >
                <h4 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                  <Award className="w-5 h-5 text-red-400" />
                  Achievement
                </h4>
                <div className="bg-gradient-to-r from-red-500/10 to-blue-500/10 border border-red-500/30 rounded-xl p-4 relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-green-500/20 border border-green-500/30 rounded-full px-3 py-1 flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-xs text-green-400 font-medium">VERIFIED</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="text-3xl">🥈</div>
                    <div className="flex-1">
                      <h5 className="text-white font-bold text-lg">{profile.achievement.title}</h5>
                      <p className="text-blue-400 text-sm">{profile.achievement.track}</p>
                      <p className="text-gray-400 text-sm mt-1">{profile.achievement.team}</p>
                      <p className="text-gray-400 text-sm">{profile.achievement.institution}</p>
                      <p className="text-gray-500 text-xs mt-1">{profile.achievement.date}</p>
                      <p className="text-gray-300 text-sm mt-2">{profile.achievement.description}</p>
                      <button
                        onClick={() => setCertificateOpen(true)}
                        className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm rounded-lg transition-all"
                      >
                        <ZoomIn className="w-4 h-4" />
                        View Certificate
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Coding / DSA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 1.1 }}
              >
                <h4 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                  <Code className="w-5 h-5 text-blue-400" />
                  Data Structures & Algorithms
                </h4>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="flex flex-wrap gap-4 mb-3 text-sm">
                    <span className="text-gray-400">Language: <span className="text-white">{profile.coding.language}</span></span>
                    <span className="text-gray-400">Platform: <span className="text-white">{profile.coding.platform}</span></span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {profile.coding.focus.map((item) => (
                      <span key={item} className="px-3 py-1 bg-white/10 rounded-full text-sm text-gray-300">
                        {item}
                      </span>
                    ))}
                  </div>
                  <a
                    href={profile.coding.leetcode}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-blue-600 text-white text-sm rounded-lg hover:from-red-500 hover:to-blue-500 transition-all"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View LeetCode
                  </a>
                </div>
              </motion.div>

              {/* Experience */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 1.2 }}
              >
                <h4 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-red-400" />
                  Experience
                </h4>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <p className="text-gray-300">{profile.experience}</p>
                </div>
              </motion.div>

              {/* Contact */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 1.3 }}
              >
                <h4 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-blue-400" />
                  Contact
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <a
                    href={`mailto:${profile.contact.email}`}
                    className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-4 hover:border-red-500/30 transition-all"
                  >
                    <Mail className="w-5 h-5 text-red-400" />
                    <div>
                      <p className="text-gray-400 text-xs">Email</p>
                      <p className="text-white text-sm">{profile.contact.email}</p>
                    </div>
                  </a>
                  <a
                    href={profile.contact.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-4 hover:border-blue-500/30 transition-all"
                  >
                    <ExternalLink className="w-5 h-5 text-blue-400" />
                    <div>
                      <p className="text-gray-400 text-xs">GitHub</p>
                      <p className="text-white text-sm">mahammadbilalhyder</p>
                    </div>
                  </a>
                  <a
                    href={profile.contact.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-4 hover:border-blue-500/30 transition-all"
                  >
                    <ExternalLink className="w-5 h-5 text-blue-400" />
                    <div>
                      <p className="text-gray-400 text-xs">LinkedIn</p>
                      <p className="text-white text-sm">View Profile</p>
                    </div>
                  </a>
                  <a
                    href={profile.contact.leetcode}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-4 hover:border-red-500/30 transition-all"
                  >
                    <Code className="w-5 h-5 text-red-400" />
                    <div>
                      <p className="text-gray-400 text-xs">LeetCode</p>
                      <p className="text-white text-sm">View Profile</p>
                    </div>
                  </a>
                </div>
              </motion.div>
            </div>

            {/* Final CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 1.4 }}
              className="p-8 md:p-12 border-t border-white/10 bg-gradient-to-r from-red-500/5 to-blue-500/5"
            >
              <div className="text-center">
                <h4 className="text-2xl font-bold text-white mb-2">
                  READY FOR THE NEXT MISSION?
                </h4>
                <p className="text-gray-400 mb-6">
                  Let&apos;s build something meaningful.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={handleDownloadPDF}
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-red-600 to-blue-600 hover:from-red-500 hover:to-blue-500 text-white font-medium rounded-xl transition-all duration-300 hover:scale-105 shadow-lg shadow-red-500/30"
                  >
                    <Download className="w-4 h-4" />
                    Download Resume
                  </button>
                  <a
                    href="#all-projects"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/20 bg-white/5 hover:bg-white/10 text-white font-medium rounded-xl transition-all duration-300"
                  >
                    <Briefcase className="w-4 h-4" />
                    View Projects
                  </a>
                  <a
                    href="#contact"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/20 bg-white/5 hover:bg-white/10 text-white font-medium rounded-xl transition-all duration-300"
                  >
                    <Mail className="w-4 h-4" />
                    Contact Me
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Certificate Viewer Modal */}
      {certificateOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setCertificateOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative max-w-5xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setCertificateOpen(false)}
              className="absolute -top-12 right-0 text-white hover:text-red-400 transition-colors flex items-center gap-2"
            >
              <X className="w-6 h-6" />
              Close (ESC)
            </button>

            {/* Zoom Controls */}
            <div className="absolute -top-12 left-0 flex items-center gap-2">
              <button
                onClick={handleZoomOut}
                className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
              >
                <ZoomOut className="w-5 h-5" />
              </button>
              <span className="text-white text-sm font-medium">{Math.round(zoom * 100)}%</span>
              <button
                onClick={handleZoomIn}
                className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
              >
                <ZoomIn className="w-5 h-5" />
              </button>
              <button
                onClick={handleResetZoom}
                className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors text-sm"
              >
                Reset
              </button>
            </div>

            {/* Certificate Image */}
            <div className="bg-white rounded-lg overflow-hidden shadow-2xl">
              <div
                className="overflow-auto max-h-[80vh]"
                style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
              >
                <img
                  src={profile.achievement.certificate}
                  alt="SemiXthon'26 Certificate - 2nd Position"
                  className="w-full h-auto"
                />
              </div>
            </div>

            {/* Instructions */}
            <p className="text-center text-gray-400 text-sm mt-4">
              Use zoom controls or scroll to view • Click outside or press ESC to close
            </p>
          </motion.div>
        </motion.div>
      )}

      {/* Keyboard listener for ESC */}
      {certificateOpen && (
        <div
          className="fixed inset-0 z-[99]"
          onClick={() => setCertificateOpen(false)}
        />
      )}
    </section>
  );
}
