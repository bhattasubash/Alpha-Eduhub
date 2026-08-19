"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, Play, Code2, Database, Server, Shield, CheckCircle, ArrowRight, Zap } from "lucide-react";
import { useState } from "react";
import { type Project } from "@/data/projects";

interface ProjectDetailModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProjectDetailModal({ project, isOpen, onClose }: ProjectDetailModalProps) {
  if (!project) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
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
            <div className="flex items-center justify-between p-6 border-b border-white/10 bg-gradient-to-r from-indigo-500/10 to-purple-500/10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Code2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{project.name}</h2>
                  <p className="text-indigo-400 text-sm">{project.category}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white/60 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* Project Overview */}
              <Section title="Project Overview" icon={Zap}>
                <p className="text-gray-300 leading-relaxed">{project.description}</p>
              </Section>

              {/* Problem */}
              {project.problem && (
                <Section title="Problem" icon={Zap}>
                  <p className="text-gray-300 leading-relaxed">{project.problem}</p>
                </Section>
              )}

              {/* Solution */}
              {project.solution && (
                <Section title="Solution" icon={CheckCircle}>
                  <p className="text-gray-300 leading-relaxed">{project.solution}</p>
                </Section>
              )}

              {/* What I Built */}
              {project.whatIBuilt && project.whatIBuilt.length > 0 && (
                <Section title="What I Built" icon={Code2}>
                  <ul className="space-y-2">
                    {project.whatIBuilt.map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-300">
                        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </Section>
              )}

              {/* Key Features */}
              {project.features && project.features.length > 0 && (
                <Section title="Key Features" icon={Zap}>
                  <div className="grid md:grid-cols-2 gap-3">
                    {project.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 p-3 bg-white/5 border border-white/10 rounded-lg">
                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </Section>
              )}

              {/* Technologies */}
              {project.technologies && project.technologies.length > 0 && (
                <Section title="Technologies" icon={Code2}>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <span key={tech} className="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-sm">
                        {tech}
                      </span>
                    ))}
                  </div>
                </Section>
              )}

              {/* Technical Architecture */}
              {project.technicalArchitecture && (
                <Section title="Technical Architecture" icon={Server}>
                  <p className="text-gray-300 leading-relaxed font-mono text-sm bg-white/5 p-4 rounded-lg">
                    {project.technicalArchitecture}
                  </p>
                </Section>
              )}

              {/* Authentication */}
              {project.authentication && (
                <Section title="Authentication" icon={Shield}>
                  <p className="text-gray-300 leading-relaxed">{project.authentication}</p>
                </Section>
              )}

              {/* Role-Based Access */}
              {project.roleBasedAccess && project.roleBasedAccess.length > 0 && (
                <Section title="Role-Based Access" icon={Shield}>
                  <div className="space-y-3">
                    {project.roleBasedAccess.map((role, index) => (
                      <div key={index} className="p-3 bg-white/5 border border-white/10 rounded-lg">
                        <p className="text-white font-medium text-sm">{role.split(':')[0]}</p>
                        <p className="text-gray-400 text-xs">{role.split(':')[1]?.trim()}</p>
                      </div>
                    ))}
                  </div>
                </Section>
              )}

              {/* Challenges */}
              {project.challenges && project.challenges.length > 0 && (
                <Section title="Challenges" icon={Zap}>
                  <ul className="space-y-2">
                    {project.challenges.map((challenge, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-300">
                        <Zap className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                        <span>{challenge}</span>
                      </li>
                    ))}
                  </ul>
                </Section>
              )}

              {/* What I Learned */}
              {project.whatILearned && project.whatILearned.length > 0 && (
                <Section title="What I Learned" icon={CheckCircle}>
                  <ul className="space-y-2">
                    {project.whatILearned.map((learning, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-300">
                        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                        <span>{learning}</span>
                      </li>
                    ))}
                  </ul>
                </Section>
              )}

              {/* Screenshots */}
              {project.screenshots && project.screenshots.length > 0 && (
                <Section title="Screenshots" icon={ExternalLink}>
                  <div className="grid grid-cols-2 gap-4">
                    {project.screenshots.map((screenshot, index) => (
                      <img
                        key={index}
                        src={screenshot}
                        alt={`${project.name} screenshot ${index + 1}`}
                        className="w-full rounded-lg border border-white/10"
                      />
                    ))}
                  </div>
                </Section>
              )}

              {/* Pricing */}
              {project.pricing && project.pricing.plans && project.pricing.plans.length > 0 && (
                <Section title="Pricing" icon={Zap}>
                  <div className="grid md:grid-cols-3 gap-4">
                    {project.pricing.plans.map((plan, index) => (
                      <div
                        key={index}
                        className={`relative p-6 rounded-xl border ${
                          plan.popular
                            ? "border-indigo-500/50 bg-gradient-to-br from-indigo-500/10 to-purple-500/10"
                            : "border-white/10 bg-white/5"
                        }`}
                      >
                        {plan.popular && (
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-indigo-600 text-white text-xs font-medium rounded-full">
                            Popular
                          </div>
                        )}
                        <h4 className="text-white font-bold text-lg mb-2">{plan.name}</h4>
                        <div className="mb-4">
                          <span className="text-3xl font-bold text-white">{plan.price}</span>
                          {plan.period && <span className="text-gray-400 text-sm ml-1">/{plan.period}</span>}
                        </div>
                        <ul className="space-y-2 mb-6">
                          {plan.features.map((feature, featureIndex) => (
                            <li key={featureIndex} className="flex items-start gap-2 text-gray-300 text-sm">
                              <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </Section>
              )}
            </div>

            {/* Footer Actions */}
            <div className="p-6 border-t border-white/10 flex gap-3">
              {project.liveDemo && (
                <a
                  href={project.liveDemo}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium rounded-lg transition-all"
                >
                  <Play className="w-4 h-4" />
                  Live Demo
                </a>
              )}
              {project.appUrl && (
                <a
                  href={project.appUrl}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg transition-all"
                >
                  <ExternalLink className="w-4 h-4" />
                  Visit App
                </a>
              )}
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg transition-all"
                >
                  <ExternalLink className="w-4 h-4" />
                  GitHub
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function Section({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
        <Icon className="w-5 h-5 text-indigo-400" />
        {title}
      </h3>
      <div className="text-gray-300">{children}</div>
    </div>
  );
}
