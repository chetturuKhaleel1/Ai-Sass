import React, { useState } from "react";
import { Sparkles, Zap, Video, ArrowRight, Palette } from "lucide-react";
import UploadBox from "../components/UploadBox";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function ReelsLandingPage() {
    const [activeStyle, setActiveStyle] = useState("hormozi");

    const STYLES = [
        { id: "hormozi", name: "Hormozi", preview: "HORMOZI" },
        { id: "devin", name: "Devin", preview: "DEVIN" },
        { id: "beast", name: "Beast", preview: "BEAST" },
        { id: "neon", name: "Neon", preview: "NEON" },
        { id: "glitch", name: "Glitch", preview: "GLITCH" },
        { id: "minimal", name: "Minimal", preview: "Minimal" },
    ];

    async function handleSubmit(payload) {
        const backend = "http://localhost:5000";

        // If FILE upload
        if (payload.file) {
            const form = new FormData();
            form.append("video", payload.file);

            const res = await fetch(`${backend}/api/process/file`, {
                method: "POST",
                body: form,
            });

            const data = await res.json();
            if (data.jobId) {
                // 🔥 Redirect directly to Reels Editor
                window.location.href = `/reels/${data.jobId}`;
            }
            return;
        }

        // If URL upload
        if (payload.url) {
            const res = await fetch(`${backend}/api/process/url`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url: payload.url }),
            });

            const data = await res.json();
            if (data.jobId) {
                window.location.href = `/reels/${data.jobId}`;
            }
            return;
        }

        alert("No file or URL found.");
    }

    return (
        <div className="min-h-screen relative bg-depth overflow-x-hidden">
            <div className="bg-grain opacity-20" />

            <div className="relative z-10">
                <Header />

                <main className="container mx-auto px-4 pt-32 pb-20">

                    {/* HERO SECTION */}
                    <div className="text-center max-w-4xl mx-auto mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold uppercase tracking-wider mb-6 animate-fade-in-up">
                            <Sparkles size={14} />
                            <span>New Feature</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight leading-tight animate-fade-in-up delay-100">
                            Turn Boring Videos into <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">Viral Reels</span>
                        </h1>

                        <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-12 animate-fade-in-up delay-200">
                            Auto-generate Hormozi-style captions, remove silences, and add viral hooks in seconds.
                            No editing skills required.
                        </p>

                        {/* UPLOAD BOX (Reused) */}
                        <div className="animate-fade-in-up delay-300 mb-24">
                            <UploadBox onSubmit={handleSubmit} buttonText="Create Viral Reel" />
                        </div>

                        {/* LIVE STYLE PREVIEW */}
                        <div className="max-w-5xl mx-auto mb-24 animate-fade-in-up delay-500">
                            <div className="flex items-center justify-center gap-2 mb-8">
                                <Palette className="text-purple-400" size={20} />
                                <h2 className="text-2xl font-bold text-white">Choose Your Vibe</h2>
                            </div>

                            <div className="grid md:grid-cols-2 gap-12 items-center">
                                {/* Style Grid */}
                                <div className="grid grid-cols-2 gap-4">
                                    {STYLES.map((s) => (
                                        <button
                                            key={s.id}
                                            onClick={() => setActiveStyle(s.id)}
                                            className={`h-20 rounded-xl border transition-all relative overflow-hidden group ${activeStyle === s.id
                                                ? "border-purple-500 bg-purple-500/10 ring-1 ring-purple-500 scale-105"
                                                : "border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10"
                                                }`}
                                        >
                                            <span className={`text-lg font-bold ${getPreviewClass(s.id)}`}>{s.name}</span>
                                            {activeStyle === s.id && (
                                                <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.8)]" />
                                            )}
                                        </button>
                                    ))}
                                </div>

                                {/* Live Preview Box */}
                                <div className="aspect-video bg-zinc-900 rounded-2xl border border-white/10 relative overflow-hidden flex items-center justify-center shadow-2xl shadow-purple-900/20">
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black" />

                                    {/* Animated Text */}
                                    <div className="relative z-10 text-center">
                                        <div className={`text-5xl md:text-6xl transition-all duration-300 ${getStyleClass(activeStyle)}`}>
                                            THIS IS VIRAL
                                        </div>
                                        <p className="mt-4 text-zinc-500 font-mono text-sm uppercase tracking-widest">
                                            {STYLES.find(s => s.id === activeStyle)?.name} STYLE
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* FEATURES GRID */}
                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {[
                            {
                                icon: <Zap className="text-yellow-400" />,
                                title: "Hormozi Captions",
                                desc: "Word-by-word animated captions that keep viewers glued to the screen."
                            },
                            {
                                icon: <Video className="text-cyan-400" />,
                                title: "Auto B-Rolls (Coming Soon)",
                                desc: "AI automatically inserts relevant stock footage to break the monotony."
                            },
                            {
                                icon: <Sparkles className="text-purple-400" />,
                                title: "Magic Hooks",
                                desc: "Our AI analyzes your video and suggests viral hooks to skyrocket retention."
                            }
                        ].map((f, i) => (
                            <div key={i} className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500/30 transition-all hover:-translate-y-1 group">
                                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    {f.icon}
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">{f.title}</h3>
                                <p className="text-zinc-500 leading-relaxed">{f.desc}</p>
                            </div>
                        ))}
                    </div>

                </main>

                <Footer />
            </div>
        </div>
    );
}

// Helper for Preview Classes (Static)
function getPreviewClass(style) {
    switch (style) {
        case "hormozi": return "font-black uppercase italic text-yellow-400 drop-shadow-md";
        case "devin": return "font-bold font-sans text-white tracking-tight";
        case "beast": return "font-black uppercase text-red-600 stroke-black stroke-2";
        case "neon": return "font-mono font-bold text-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]";
        case "glitch": return "font-mono font-bold text-green-400 tracking-widest";
        case "minimal": return "font-medium text-zinc-300 bg-black/50 px-2 py-1 rounded";
        default: return "font-bold text-white";
    }
}

// Helper for Actual Styles
function getStyleClass(style) {
    switch (style) {
        case "hormozi":
            return "font-black uppercase italic text-yellow-400 drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] animate-bounce-short leading-tight transform rotate-[-2deg]";
        case "devin":
            return "font-bold font-sans tracking-tight drop-shadow-md text-white";
        case "beast":
            return "font-black uppercase text-red-600 drop-shadow-[4px_4px_0px_rgba(0,0,0,1)] tracking-wide transform scale-110";
        case "neon":
            return "font-mono font-bold text-cyan-400 drop-shadow-[0_0_20px_currentColor] tracking-widest";
        case "glitch":
            return "font-mono font-bold text-green-400 tracking-widest uppercase animate-pulse";
        case "minimal":
            return "font-medium text-white bg-black/60 px-6 py-3 rounded-xl backdrop-blur-md shadow-lg";
        default:
            return "font-bold text-white";
    }
}
