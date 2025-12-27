import ParallaxCard from "./ParallaxCard";
import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useEffect } from "react";
import { Sparkles, Zap, Brain } from "lucide-react";

export default function HeroCinematic() {
  const [currentStep, setCurrentStep] = useState(0);
  const [flashcards, setFlashcards] = useState([]);

  const demoFlashcards = [
    { q: "What is Photosynthesis?", a: "Process by which plants convert light into energy" },
    { q: "Newton's First Law?", a: "An object in motion stays in motion unless acted upon" },
    { q: "What is DNA?", a: "Deoxyribonucleic acid - genetic blueprint of life" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (currentStep === 2) {
      const cardInterval = setInterval(() => {
        setFlashcards((prev) => {
          if (prev.length < demoFlashcards.length) {
            return [...prev, demoFlashcards[prev.length]];
          }
          return prev;
        });
      }, 800);
      return () => clearInterval(cardInterval);
    } else {
      setFlashcards([]);
    }
  }, [currentStep]);

  const steps = [
    { icon: Sparkles, label: "Uploading Video", color: "indigo" },
    { icon: Zap, label: "Extracting Content", color: "purple" },
    { icon: Brain, label: "Generating Flashcards", color: "pink" },
    { icon: Sparkles, label: "Ready to Study", color: "green" }
  ];

  return (
    <section className="relative pt-48 pb-32 overflow-hidden">
      {/* Background Elements */}
      <div className="bg-grid-pattern absolute inset-0 z-0 opacity-40" />
      <div className="bg-grain" />

      <div className="container relative z-10 flex flex-col items-center text-center">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md flex items-center gap-2"
        >
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
          <span className="text-xs font-mono text-zinc-400 tracking-wide uppercase">v2.0 Public Beta</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-display text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-zinc-500 mb-6 max-w-4xl mx-auto"
        >
          Your lectures, <br />
          <span className="text-white">engineered for clarity.</span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 1 }}
          className="text-lg text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Transform chaotic video lectures into structured, searchable knowledge bases.
          Powered by advanced computer vision and <span className="text-zinc-200 font-medium">precision OCR</span>.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-4 mb-24"
        >
          <button
            onClick={() => {
              const uploadSection = document.getElementById('upload-section');
              if (uploadSection) {
                uploadSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }
            }}
            className="btn-primary-tech px-8 py-4 text-sm font-bold tracking-wide"
          >
            Start Processing
          </button>
          <button
            onClick={() => {
              const featuresSection = document.getElementById('features-section');
              if (featuresSection) {
                featuresSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }}
            className="px-8 py-4 rounded-lg text-sm font-medium text-zinc-400 hover:text-white transition-colors flex items-center gap-2 group"
          >
            <span>View Features</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </motion.div>

        {/* 3D Interface Mockup with Live Animation */}
        <motion.div
          initial={{ opacity: 0, rotateX: 20, y: 100 }}
          animate={{ opacity: 1, rotateX: 0, y: 0 }}
          transition={{ delay: 0.4, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-5xl perspective-2000"
        >
          <ParallaxCard className="w-full aspect-[16/9] bg-[#09090b] rounded-xl border border-white/10 shadow-2xl overflow-hidden group">
            {/* Mockup Header */}
            <div className="h-12 border-b border-white/10 bg-white/5 flex items-center px-4 gap-2">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-zinc-700" />
                <div className="w-3 h-3 rounded-full bg-zinc-700" />
                <div className="w-3 h-3 rounded-full bg-zinc-700" />
              </div>
              <div className="ml-4 px-3 py-1 rounded-md bg-black/40 border border-white/5 text-[10px] font-mono text-zinc-500 flex-1 text-center">
                studysnap.app/dashboard
              </div>
            </div>

            {/* Animated Mockup Content */}
            <div className="p-8 grid grid-cols-12 gap-6 h-full bg-grid-pattern relative overflow-hidden">
              {/* Sidebar with Status */}
              <div className="col-span-3 border-r border-white/10 pr-6 space-y-3">
                <div className="h-8 w-3/4 bg-zinc-800/50 rounded flex items-center px-3">
                  <span className="text-[9px] font-mono text-zinc-500">Processing Status</span>
                </div>
                {steps.map((step, idx) => {
                  const Icon = step.icon;
                  const isActive = idx === currentStep;
                  const isComplete = idx < currentStep;
                  return (
                    <motion.div
                      key={idx}
                      className={`flex items-center gap-2 px-2 py-1.5 rounded transition-all ${isActive ? 'bg-white/5' : ''
                        }`}
                      animate={{
                        opacity: isComplete || isActive ? 1 : 0.3,
                      }}
                    >
                      <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-indigo-500 animate-pulse' :
                        isComplete ? 'bg-green-500' : 'bg-zinc-700'
                        }`} />
                      <span className="text-[8px] font-mono text-zinc-400">{step.label}</span>
                    </motion.div>
                  );
                })}
              </div>

              {/* Main Area - Animated Content */}
              <div className="col-span-9 space-y-4">
                {/* Progress Bar */}
                <div className="flex justify-between items-center">
                  <div className="flex-1 h-2 bg-zinc-800/50 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
                      animate={{
                        width: `${((currentStep + 1) / steps.length) * 100}%`
                      }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  <span className="ml-3 text-[10px] font-mono text-zinc-500">
                    {Math.round(((currentStep + 1) / steps.length) * 100)}%
                  </span>
                </div>

                {/* Dynamic Content Area */}
                <div className="h-64 w-full bg-zinc-900/50 rounded-lg border border-white/5 p-6 relative overflow-hidden">
                  <AnimatePresence mode="wait">
                    {/* Step 0: Upload Animation */}
                    {currentStep === 0 && (
                      <motion.div
                        key="upload"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="flex flex-col items-center justify-center h-full"
                      >
                        <motion.div
                          animate={{
                            rotateY: [0, 360],
                            scale: [1, 1.1, 1]
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="w-16 h-16 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-lg border border-indigo-500/30 flex items-center justify-center mb-3"
                        >
                          <Sparkles className="text-indigo-400" size={24} />
                        </motion.div>
                        <p className="font-mono text-xs text-zinc-500">Uploading lecture video...</p>
                      </motion.div>
                    )}

                    {/* Step 1: OCR Animation */}
                    {currentStep === 1 && (
                      <motion.div
                        key="ocr"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="h-full space-y-2"
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <Zap className="text-purple-400" size={16} />
                          <span className="font-mono text-[10px] text-zinc-400">Extracting text from frames...</span>
                        </div>
                        {[...Array(6)].map((_, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: [0, 1, 0.7], x: 0 }}
                            transition={{ delay: i * 0.15 }}
                            className="h-6 bg-gradient-to-r from-purple-500/10 to-transparent rounded px-2 flex items-center"
                          >
                            <span className="text-[9px] font-mono text-purple-300/50">
                              {i === 0 && "Photosynthesis is the process..."}
                              {i === 1 && "Newton's laws of motion..."}
                              {i === 2 && "DNA structure consists of..."}
                              {i === 3 && "Mitochondria powerhouse..."}
                              {i === 4 && "Chemical equations balance..."}
                              {i === 5 && "Calculus derivatives..."}
                            </span>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}

                    {/* Step 2: Flashcard Generation with 3D */}
                    {currentStep === 2 && (
                      <motion.div
                        key="flashcards"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="h-full"
                      >
                        <div className="flex items-center gap-2 mb-4">
                          <Brain className="text-pink-400" size={16} />
                          <span className="font-mono text-[10px] text-zinc-400">Creating smart flashcards...</span>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          {flashcards.map((card, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, rotateY: -90, z: -100 }}
                              animate={{
                                opacity: 1,
                                rotateY: 0,
                                z: 0,
                              }}
                              transition={{
                                type: "spring",
                                stiffness: 200,
                                damping: 20
                              }}
                              style={{ transformStyle: 'preserve-3d' }}
                              className="bg-gradient-to-br from-pink-500/10 to-purple-500/10 border border-pink-500/20 rounded-lg p-3 h-24"
                            >
                              <p className="text-[8px] font-bold text-pink-300 mb-1">Q:</p>
                              <p className="text-[9px] text-zinc-300 leading-tight">{card.q}</p>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* Step 3: Complete */}
                    {currentStep === 3 && (
                      <motion.div
                        key="complete"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center justify-center h-full"
                      >
                        <motion.div
                          animate={{
                            scale: [1, 1.2, 1],
                            rotate: [0, 360]
                          }}
                          transition={{ duration: 2 }}
                          className="w-16 h-16 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-full border border-green-500/30 flex items-center justify-center mb-3"
                        >
                          <Sparkles className="text-green-400" size={24} />
                        </motion.div>
                        <p className="font-mono text-xs text-green-400 mb-2">✓ Processing Complete!</p>
                        <p className="font-mono text-[10px] text-zinc-500">{flashcards.length} flashcards ready to study</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Reflection Overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
          </ParallaxCard>
        </motion.div>

      </div>
    </section>
  );
}
