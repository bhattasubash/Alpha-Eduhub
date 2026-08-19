"use client";

import { motion, useInView } from "framer-motion";
import { useState } from "react";
import { Award, Calendar, MapPin, Trophy, X, ZoomIn, ZoomOut } from "lucide-react";
import { useRef } from "react";

const achievement = {
  position: "2nd Position",
  event: "SemiXthon'26",
  organizer: "VDSemiX",
  institution: "Delhi Technological University (DTU)",
  track: "Human Device Interface",
  team: "Team Nanologic",
  date: "13 April 2026",
  certificate: "/certificate.jpg.png"
};

export default function Achievements() {
  const [certificateOpen, setCertificateOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.5));
  const handleResetZoom = () => setZoom(1);

  return (
    <section id="achievements" className="py-24 bg-gradient-to-b from-[#050816] to-[#0a0f1e] relative overflow-hidden scroll-mt-20">
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
            ACHIEVEMENTS <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-blue-400">& MILESTONES</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Recognition and accomplishments in my journey
          </p>
        </motion.div>

        {/* Achievement Timeline */}
        <div ref={ref} className="max-w-3xl mx-auto">
          {/* Timeline Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-red-500/50 via-blue-500/50 to-transparent hidden md:block" style={{ left: '50%' }} />

          {/* Achievement Card */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative mb-16"
          >
            {/* Timeline Dot */}
            <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-gradient-to-r from-red-500 to-blue-500 rounded-full shadow-lg shadow-red-500/50 hidden md:block" style={{ left: '50%', top: '50%' }} />

            {/* Achievement Card */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-3xl p-8 md:p-12 backdrop-blur-xl relative overflow-hidden group hover:border-red-500/30 transition-all duration-500">
              {/* Web strand animation */}
              <motion.div
                initial={{ width: 0 }}
                animate={isInView ? { width: "100%" } : {}}
                transition={{ duration: 1, delay: 0.5 }}
                className="absolute top-0 left-0 h-0.5 bg-gradient-to-r from-red-500 to-blue-500"
              />

              {/* Verified Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="absolute top-4 right-4 bg-gradient-to-r from-red-500/20 to-blue-500/20 border border-red-500/30 rounded-full px-3 py-1 flex items-center gap-1"
              >
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-xs text-green-400 font-medium">VERIFIED</span>
              </motion.div>

              {/* Achievement Content */}
              <div className="text-center md:text-left md:pl-8">
                {/* Position */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="mb-4"
                >
                  <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500/20 to-blue-500/20 border border-red-500/30 rounded-full px-4 py-2 mb-4">
                    <Trophy className="w-5 h-5 text-red-400" />
                    <span className="text-red-400 font-bold text-lg">2ND POSITION</span>
                  </div>
                </motion.div>

                {/* Event Name */}
                <motion.h3
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.7 }}
                  className="text-3xl md:text-4xl font-bold text-white mb-3"
                >
                  SemiXthon&apos;26
                </motion.h3>

                {/* Track */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  className="text-blue-400 font-medium text-lg mb-6"
                >
                  Human Device Interface
                </motion.p>

                {/* Details Grid */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.9 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
                >
                  <div className="flex items-center gap-2 text-gray-400">
                    <Award className="w-4 h-4 text-red-400" />
                    <span>Team Nanologic</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <MapPin className="w-4 h-4 text-blue-400" />
                    <span>Delhi Technological University</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <Calendar className="w-4 h-4 text-red-400" />
                    <span>13 April 2026</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <Trophy className="w-4 h-4 text-blue-400" />
                    <span>Organized by VDSemiX</span>
                  </div>
                </motion.div>

                {/* View Certificate Button */}
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.5, delay: 1 }}
                  onClick={() => setCertificateOpen(true)}
                  className="group inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-blue-600 hover:from-red-500 hover:to-blue-500 text-white font-medium rounded-xl transition-all duration-300 hover:scale-105 shadow-lg shadow-red-500/30"
                >
                  <ZoomIn className="w-4 h-4" />
                  View Certificate
                </motion.button>
              </div>

              {/* Particle/Web Effect */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-red-500/30 rounded-full animate-pulse" />
                <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-blue-500/30 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
                <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-red-500/30 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
              </div>
            </div>
          </motion.div>
        </div>
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
                  src={achievement.certificate}
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
