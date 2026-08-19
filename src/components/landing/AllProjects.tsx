"use client";

import { motion } from "framer-motion";
import { ExternalLink, ArrowRight, Code2, Filter } from "lucide-react";
import { useState } from "react";
import { projects, getProjectsByCategory, getCategories, getProjectById, type Project } from "@/data/projects";
import ProjectDetailModal from "./ProjectDetailModal";

export default function AllProjects() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const categories = getCategories();
  const filteredProjects = getProjectsByCategory(selectedCategory);

  const handleViewDetails = (projectId: string) => {
    const project = getProjectById(projectId);
    if (project) {
      setSelectedProject(project);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };

  return (
    <section id="all-projects" className="py-24 bg-gradient-to-b from-[#050816] to-[#0a0f1e] relative overflow-hidden scroll-mt-20">
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
            MY <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-blue-400">PROJECTS</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Things I&apos;ve built.
          </p>
        </motion.div>

        {/* Category Filter */}
        {categories.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-wrap justify-center gap-3 mb-12"
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? "bg-gradient-to-r from-red-600 to-blue-600 text-white shadow-lg shadow-red-500/30"
                    : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10"
                }`}
              >
                {category}
              </button>
            ))}
          </motion.div>
        )}

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project, index) => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              index={index} 
              onViewDetails={() => handleViewDetails(project.id)}
            />
          ))}
        </div>

        {/* Project Detail Modal */}
        <ProjectDetailModal 
          project={selectedProject} 
          isOpen={isModalOpen} 
          onClose={handleCloseModal} 
        />

        {filteredProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-gray-400 text-lg">No projects found in this category.</p>
          </motion.div>
        )}
      </div>
    </section>
  );
}

function ProjectCard({ project, index, onViewDetails }: { project: Project; index: number; onViewDetails: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl overflow-hidden hover:border-red-500/30 transition-all duration-300 hover-lift"
    >
      {/* Card Image */}
      <div className="relative h-48 bg-gradient-to-br from-red-500/20 to-blue-500/20 overflow-hidden">
        {project.image ? (
          <img
            src={project.image}
            alt={project.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Code2 className="w-16 h-16 text-white/20" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      {/* Card Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">{project.name}</h3>
            <p className="text-xs text-red-400 font-medium">{project.category}</p>
          </div>
          {project.featured && (
            <span className="px-2 py-1 bg-gradient-to-r from-red-600 to-blue-600 text-white text-xs font-medium rounded-full">
              Featured
            </span>
          )}
        </div>

        <p className="text-gray-400 text-sm mb-4 line-clamp-2">{project.shortDescription}</p>

        {/* Technologies */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies.slice(0, 3).map((tech) => (
            <span
              key={tech}
              className="px-2 py-1 bg-white/5 text-gray-300 text-xs rounded-md border border-white/10"
            >
              {tech}
            </span>
          ))}
          {project.technologies.length > 3 && (
            <span className="px-2 py-1 bg-white/5 text-gray-400 text-xs rounded-md border border-white/10">
              +{project.technologies.length - 3}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {project.liveDemo && (
            <a
              href={project.liveDemo}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-sm font-medium rounded-lg transition-all"
            >
              <ExternalLink className="w-4 h-4" />
              Demo
            </a>
          )}
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-lg transition-all border border-white/10"
            >
              <ExternalLink className="w-4 h-4" />
              GitHub
            </a>
          )}
          <button
            onClick={onViewDetails}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-blue-600 hover:from-red-500 hover:to-blue-500 text-white text-sm font-medium rounded-lg transition-all"
          >
            <ArrowRight className="w-4 h-4" />
            View Details
          </button>
        </div>
      </div>

      {/* Hover Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </motion.div>
  );
}
