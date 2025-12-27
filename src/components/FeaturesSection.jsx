import React, { useState, useRef } from "react";
import { Sparkles, Zap, Clock, Brain, Video, FileText } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

export default function FeaturesSection() {
    const features = [
        {
            icon: Video,
            title: "Video to Knowledge",
            description: "Transform lengthy lecture videos into structured, searchable knowledge bases with precision OCR technology.",
            color: "from-blue-500 to-cyan-500",
            delay: 0
        },
        {
            icon: Brain,
            title: "AI-Powered Flashcards",
            description: "Automatically generate smart flashcards from your content, making studying more effective and engaging.",
            color: "from-purple-500 to-pink-500",
            delay: 0.1
        },
        {
            icon: Zap,
            title: "Instant Processing",
            description: "Lightning-fast processing that converts hours of content into digestible insights in minutes.",
            color: "from-yellow-500 to-orange-500",
            delay: 0.2
        },
        {
            icon: Clock,
            title: "Time Saver",
            description: "Spend less time organizing notes and more time mastering the material that matters.",
            color: "from-green-500 to-emerald-500",
            delay: 0.3
        },
        {
            icon: Sparkles,
            title: "Viral Reels Creator",
            description: "Create engaging short-form educational content with animated flashcards for social media.",
            color: "from-pink-500 to-rose-500",
            delay: 0.4
        },
        {
            icon: FileText,
            title: "Export Options",
            description: "Download your flashcards as videos, PDFs, or share them directly with your study group.",
            color: "from-indigo-500 to-purple-500",
            delay: 0.5
        }
    ];

    return (
        <section
            id="features-section"
            className="py-32 relative"
        >
            <div className="container mx-auto px-4 relative z-10">
                {/* Section Header */}
                <motion.div
                    className="text-center mb-20 space-y-6"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-4"
                    >
                        <Sparkles size={18} className="text-indigo-400 animate-pulse" />
                        <span className="text-sm font-bold text-indigo-300 tracking-wider">WHAT WE OFFER</span>
                    </motion.div>

                    <motion.h2
                        className="text-6xl md:text-7xl font-black text-white"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    >
                        Powerful Features
                    </motion.h2>

                    <motion.p
                        className="text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                    >
                        Everything you need to transform your learning experience with cutting-edge AI technology
                    </motion.p>
                </motion.div>

                {/* Interactive Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {features.map((feature, index) => (
                        <FeatureCard
                            key={index}
                            feature={feature}
                            index={index}
                        />
                    ))}
                </div>

                {/* CTA Section */}
                <motion.div
                    className="mt-24 text-center"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                >
                    <div className="inline-flex flex-col md:flex-row items-center gap-6 p-10 rounded-3xl bg-white/5 border border-white/10 relative overflow-hidden group">
                        <div className="space-y-3 text-left relative z-10">
                            <h3 className="text-3xl font-black text-white">Ready to get started?</h3>
                            <p className="text-zinc-400 text-lg">It's completely free! Transform lectures or create viral reels.</p>
                        </div>

                        <div className="flex gap-4 relative z-10">
                            <motion.button
                                onClick={() => {
                                    const uploadSection = document.getElementById('upload-section');
                                    if (uploadSection) {
                                        uploadSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                    }
                                }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="btn-primary-tech rounded-full px-8 py-4 text-sm font-bold tracking-wide uppercase whitespace-nowrap"
                            >
                                Start Processing
                            </motion.button>

                            <motion.button
                                onClick={() => window.location.href = '/reels-creator'}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-8 py-4 rounded-full border-2 border-purple-500/50 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 hover:border-purple-400 transition-all text-sm font-bold tracking-wide uppercase whitespace-nowrap flex items-center gap-2"
                            >
                                <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                                Viral Reels
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

// Separate Interactive Feature Card Component
function FeatureCard({ feature, index }) {
    const [isHovered, setIsHovered] = useState(false);
    const cardRef = useRef(null);

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [5, -5]), { stiffness: 300, damping: 30 });
    const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-5, 5]), { stiffness: 300, damping: 30 });

    const handleMouseMove = (e) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        mouseX.set((e.clientX - centerX) / rect.width);
        mouseY.set((e.clientY - centerY) / rect.height);
    };

    const handleMouseLeave = () => {
        mouseX.set(0);
        mouseY.set(0);
        setIsHovered(false);
    };

    const Icon = feature.icon;

    return (
        <motion.div
            ref={cardRef}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{
                delay: feature.delay,
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1]
            }}
            style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d"
            }}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
            className="group relative"
        >
            {/* Card Container */}
            <div className="relative p-8 rounded-3xl bg-white/[0.05] border border-white/10 hover:border-white/20 transition-all duration-500 overflow-hidden h-full">

                {/* Shine Effect */}
                <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                    style={{ transform: "translateZ(50px)" }}
                />

                <div className="relative z-10 space-y-5" style={{ transform: "translateZ(50px)" }}>
                    {/* Icon with Gradient */}
                    <motion.div
                        className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-2xl relative`}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <Icon size={28} className="text-white" strokeWidth={2.5} />

                        {/* Glow Ring */}
                        <motion.div
                            className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.color} blur-xl opacity-0 group-hover:opacity-60 transition-opacity`}
                            animate={isHovered ? { scale: 1.3 } : { scale: 1 }}
                        />
                    </motion.div>

                    {/* Content */}
                    <div className="space-y-3">
                        <h3 className="text-2xl font-black text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-indigo-300 transition-all">
                            {feature.title}
                        </h3>
                        <p className="text-zinc-400 leading-relaxed text-sm">
                            {feature.description}
                        </p>
                    </div>
                </div>

                {/* Corner Accent */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
        </motion.div>
    );
}
