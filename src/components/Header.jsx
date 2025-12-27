import React from "react";
import { BookOpen } from "lucide-react";

export default function Header() {
  return (
    <header className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
      <div className="glass-tech rounded-full px-2 py-2 flex items-center gap-2 animate-float shadow-2xl max-w-full overflow-x-auto">

        {/* Logo Area */}
        <div className="pl-4 pr-6 flex items-center gap-3 border-r border-white/10 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.3)]">
            <BookOpen size={16} className="text-black" strokeWidth={3} />
          </div>
          <span className="font-semibold tracking-tight text-sm text-white">StudySnap</span>
        </div>

        {/* Nav Items */}
        <nav className="hidden md:flex items-center px-2 shrink-0 gap-1">
          <button
            onClick={() => {
              const featuresSection = document.getElementById('features-section');
              if (featuresSection) {
                featuresSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }}
            className="px-4 py-2 text-sm text-zinc-400 hover:text-white transition-colors font-medium"
          >
            Features
          </button>
          <a href="/reels-creator" className="px-4 py-2 text-sm text-purple-400 hover:text-purple-300 transition-colors font-bold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
            Viral Reels
          </a>
          <a href="/upscale" className="px-4 py-2 text-sm text-blue-400 hover:text-blue-300 transition-colors font-bold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            Upscale
          </a>
        </nav>

        {/* Actions */}
        <div className="pl-2 flex items-center gap-2 shrink-0 ml-auto md:ml-0">

          <button
            onClick={() => {
              const uploadSection = document.getElementById('upload-section');
              if (uploadSection) {
                uploadSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }
            }}
            className="btn-primary-tech rounded-full px-5 py-2 text-xs font-bold tracking-wide uppercase whitespace-nowrap"
          >
            Get Started
          </button>
        </div>

      </div>
    </header>
  );
}
