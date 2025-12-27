import React from "react";
import { BookOpen, Github, Linkedin, Heart } from "lucide-react";

export default function Footer() {
    return (
        <footer className="relative mt-32 border-t border-white/5 bg-black/40 backdrop-blur-xl">
            <div className="container mx-auto px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">

                    {/* Brand Column */}
                    <div className="col-span-1 md:col-span-2 space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                                <BookOpen size={16} className="text-black" strokeWidth={3} />
                            </div>
                            <span className="font-semibold tracking-tight text-xl text-white">StudySnap</span>
                        </div>
                        <p className="text-zinc-500 max-w-sm leading-relaxed">
                            Transforming educational content into digestible insights.
                            Built for the modern learner who values speed, clarity, and aesthetics.
                        </p>
                        <div className="flex gap-4">
                            <a href="https://www.linkedin.com/in/chetturu-khaleel-25a96b266" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-zinc-400 hover:bg-white hover:text-black transition-all duration-300">
                                <Linkedin size={18} />
                            </a>
                            <a href="https://github.com/chetturuKhaleel1" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-zinc-400 hover:bg-white hover:text-black transition-all duration-300">
                                <Github size={18} />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-xs">Product</h4>
                        <ul className="space-y-4">
                            {['Features', 'Changelog', 'Docs'].map((item) => (
                                <li key={item}>
                                    <a href="#" className="text-zinc-500 hover:text-indigo-400 transition-colors text-sm">
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Links Column 2 */}
                    <div>
                        <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-xs">Legal</h4>
                        <ul className="space-y-4">
                            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
                                <li key={item}>
                                    <a href="#" className="text-zinc-500 hover:text-indigo-400 transition-colors text-sm">
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-zinc-600 text-xs font-mono">
                        © {new Date().getFullYear()} StudySnap Inc. All rights reserved.
                    </p>
                    <div className="flex items-center gap-2 text-zinc-600 text-xs font-mono">
                        <span>Made with</span>
                        <Heart size={12} className="text-red-500 fill-red-500" />
                        <span>by Antigravity</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
