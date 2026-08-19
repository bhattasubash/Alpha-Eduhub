"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function LoadingScreen() {
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(0);
  const [canSkip, setCanSkip] = useState(false);

  const loadingSteps = [
    "INITIALIZING...",
    "WEB SYSTEM — ONLINE",
    "PORTFOLIO — ONLINE",
    "PROJECTS — ONLINE",
    "WELCOME, BILAL."
  ];

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setStep((prev) => {
        if (prev < loadingSteps.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 500);

    const skipTimeout = setTimeout(() => {
      setCanSkip(true);
    }, 1000);

    const completeTimeout = setTimeout(() => {
      setLoading(false);
    }, 2500);

    return () => {
      clearInterval(stepInterval);
      clearTimeout(skipTimeout);
      clearTimeout(completeTimeout);
    };
  }, []);

  const handleSkip = () => {
    setLoading(false);
  };

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[100] bg-[#050816] flex items-center justify-center"
        >
          <div className="text-center space-y-8">
            {/* Web Animation */}
            <div className="relative w-32 h-32 mx-auto">
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 border-2 border-red-500/50 rounded-full"
              />
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1.5, opacity: 0 }}
                transition={{ duration: 1, repeat: Infinity }}
                className="absolute inset-0 border border-red-500/30 rounded-full"
              />
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 2, opacity: 0 }}
                transition={{ duration: 1, delay: 0.3, repeat: Infinity }}
                className="absolute inset-0 border border-blue-500/20 rounded-full"
              />
              {/* Web strands */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="w-0.5 h-16 bg-gradient-to-b from-red-500 to-blue-500 origin-top"
                />
                <motion.div
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="w-0.5 h-16 bg-gradient-to-b from-red-500 to-blue-500 origin-top -rotate-45"
                />
                <motion.div
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="w-0.5 h-16 bg-gradient-to-b from-red-500 to-blue-500 origin-top rotate-45"
                />
              </div>
            </div>

            {/* Loading Text */}
            <div className="space-y-2">
              <AnimatePresence mode="wait">
                <motion.p
                  key={step}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="text-red-400 font-mono text-lg tracking-widest"
                >
                  {loadingSteps[step]}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Skip Button */}
            {canSkip && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={handleSkip}
                className="px-6 py-2 text-sm text-white/60 hover:text-white border border-white/10 rounded-lg hover:bg-white/5 transition-all"
              >
                Skip
              </motion.button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
