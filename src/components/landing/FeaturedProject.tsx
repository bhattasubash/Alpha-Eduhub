"use client";

import { motion } from "framer-motion";
import { ArrowRight, ExternalLink, Play, Shield, Server, Database, Code2, Users, CheckCircle, Zap } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import DemoModal from "./DemoModal";
import { getFeaturedProject } from "@/data/projects";

export default function FeaturedProject() {
  const [demoOpen, setDemoOpen] = useState(false);
  const project = getFeaturedProject();

  if (!project) return null;

  return (
    <section id="featured-project" className="py-24 bg-gradient-to-b from-[#0a0f1e] to-[#050816] relative overflow-hidden scroll-mt-20">
      <DemoModal open={demoOpen} onClose={() => setDemoOpen(false)} />
      
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
          <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-full px-4 py-2 mb-6">
            <Zap className="w-4 h-4 text-red-400" />
            <span className="text-red-400 text-sm font-medium">Featured Project</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {project.name}
          </h2>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            {project.shortDescription}
          </p>
        </motion.div>

        {/* Project Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-2xl p-8 mb-12"
        >
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">What I Built</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                {project.description}
              </p>
              {project.problem && (
                <p className="text-gray-300 leading-relaxed">
                  <strong className="text-white">Problem it solves:</strong> {project.problem}
                </p>
              )}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">What I Personally Built</h3>
              <ul className="space-y-3">
                {project.whatIBuilt?.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-gray-300">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Tech Stack */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-12"
        >
          <h3 className="text-2xl font-bold text-white mb-6 text-center">Technologies Used</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {project.technologies.slice(0, 8).map((tech, index) => (
              <motion.div
                key={tech}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                className="bg-white/5 border border-white/10 rounded-xl p-6 text-center hover:border-white/20 transition-all"
              >
                <Code2 className="w-8 h-8 text-indigo-400 mx-auto mb-3" />
                <p className="text-white font-semibold mb-1">{tech}</p>
                <p className="text-gray-400 text-sm">Technology</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-12"
        >
          <h3 className="text-2xl font-bold text-white mb-6 text-center">Key Features</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {project.features.map((feature, index) => (
              <motion.div
                key={feature}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.6 + index * 0.05 }}
                className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-xl hover:border-white/20 transition-all"
              >
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span className="text-gray-300 text-sm">{feature}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Role-Based Access */}
        {project.roleBasedAccess && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-12"
          >
            <h3 className="text-2xl font-bold text-white mb-6 text-center">Role-Based Access Control</h3>
            <div className="grid md:grid-cols-5 gap-4">
              {project.roleBasedAccess.map((role, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                  className="text-center p-4 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-xl"
                >
                  <div className="text-3xl mb-2">👤</div>
                  <h4 className="text-white font-semibold mb-1 text-sm">{role.split(':')[0]}</h4>
                  <p className="text-gray-400 text-xs">{role.split(':')[1]?.trim()}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="flex flex-wrap gap-4 justify-center"
        >
          {project.liveDemo && (
            <Link
              href={project.liveDemo}
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white rounded-2xl bg-gradient-to-r from-red-600 via-purple-600 to-blue-600 hover:from-red-500 hover:via-purple-500 hover:to-blue-500 shadow-2xl shadow-red-500/30 hover:shadow-red-500/50 transition-all duration-300 hover:scale-105"
            >
              <Play className="w-4 h-4" />
              Try Live Demo
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white rounded-2xl border border-white/20 bg-white/5 hover:bg-white/10 transition-all duration-300"
            >
              <ExternalLink className="w-4 h-4" />
              View on GitHub
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
          {project.demoLogin && (
            <button
              onClick={() => setDemoOpen(true)}
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white rounded-2xl border border-white/20 bg-white/5 hover:bg-white/10 transition-all duration-300"
            >
              <Users className="w-4 h-4" />
              Demo Login Credentials
            </button>
          )}
          {project.appUrl && (
            <Link
              href={project.appUrl}
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white rounded-2xl border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 transition-all duration-300"
            >
              <ExternalLink className="w-4 h-4" />
              Visit Full Application
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
        </motion.div>
      </div>
    </section>
  );
}
