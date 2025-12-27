import { useState, useEffect } from "react";
import Flashcard from "./Flashcard";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";

export default function FlashcardDeck({ cards }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextCard = () => {
    setCurrentIndex((i) => Math.min(i + 1, cards.length));
  };

  const prevCard = () => {
    setCurrentIndex((i) => Math.max(i - 1, 0));
  };

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowRight") nextCard();
      if (e.key === "ArrowLeft") prevCard();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [cards.length]);

  return (
    <div className="w-full max-w-md mx-auto">

      {/* Deck Container */}
      <div className="relative h-96 w-full mb-8 perspective-1000">
        {cards.map((card, index) => {
          // Only render current and next few cards for performance/stacking
          if (index < currentIndex) return null;
          if (index > currentIndex + 2) return null;

          const offset = index - currentIndex;
          const scale = 1 - offset * 0.05;
          const translateY = offset * 15;
          const opacity = 1 - offset * 0.3;
          const zIndex = 50 - offset;

          return (
            <div
              key={index}
              className="absolute inset-0 transition-all duration-500 ease-spring"
              style={{
                transform: `translateY(${translateY}px) scale(${scale})`,
                opacity,
                zIndex,
              }}
            >
              <Flashcard card={card} />
            </div>
          );
        })}

        {currentIndex >= cards.length && (
          <div className="absolute inset-0 flex items-center justify-center bg-zinc-900/50 border border-white/5 rounded-2xl backdrop-blur-sm">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4 text-emerald-500">
                <Check size={24} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">All Caught Up!</h3>
              <button
                onClick={() => setCurrentIndex(0)}
                className="text-sm text-zinc-400 hover:text-white underline"
              >
                Review Again
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between px-4">
        <button
          onClick={prevCard}
          disabled={currentIndex === 0}
          className="btn-tech flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowLeft size={16} />
          <span>PREV</span>
        </button>

        <span className="font-mono text-sm text-zinc-500">
          {currentIndex + 1} <span className="text-zinc-700">/</span> {cards.length}
        </span>

        <button
          onClick={nextCard}
          disabled={currentIndex >= cards.length}
          className="btn-tech flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>NEXT</span>
          <ArrowRight size={16} />
        </button>
      </div>

    </div>
  );
}
