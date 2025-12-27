import { useState } from "react";

export default function Flashcard({ card, onFlip }) {
  const [flip, setFlip] = useState(false);

  const handleFlip = () => {
    setFlip(!flip);
    if (onFlip) onFlip();
  };

  return (
    <div
      className={`flashcard-container-pro w-full h-96 cursor-pointer group ${flip ? "flashcard-flipped" : ""}`}
      onClick={handleFlip}
    >
      <div className="flashcard-inner-pro">

        {/* FRONT */}
        <div className="flashcard-face-pro flex flex-col justify-between p-8">
          <div className="flex justify-between items-start">
            <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-500 text-xs font-mono border border-white/5">
              Q
            </div>
            <div className="px-2 py-1 rounded bg-zinc-800/50 border border-white/5 text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
              Concept Card
            </div>
          </div>

          <h3 className="text-2xl font-semibold text-zinc-100 text-center leading-tight">
            {card.front}
          </h3>

          <div className="text-center text-xs font-mono text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity">
            [CLICK_TO_REVEAL]
          </div>
        </div>

        {/* BACK */}
        <div className="flashcard-face-pro flashcard-back-pro flex flex-col justify-between p-8">
          <div className="flex justify-between items-start">
            <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 text-xs font-mono border border-indigo-500/30">
              A
            </div>
          </div>

          <div className="text-lg text-zinc-300 text-center leading-relaxed">
            {card.back}
          </div>

          {card.hints && card.hints.length > 0 && (
            <div className="mt-4 pt-4 border-t border-white/5">
              <p className="text-[10px] font-mono text-zinc-500 uppercase mb-2">Key Insights</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {card.hints.map((hint, i) => (
                  <span key={i} className="px-2 py-1 rounded bg-zinc-800 text-xs text-zinc-400 border border-white/5">
                    {hint}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
