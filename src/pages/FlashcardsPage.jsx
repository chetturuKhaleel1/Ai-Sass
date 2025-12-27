import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import FlashcardDeck from "../components/FlashcardDeck";
import { API_BASE_URL } from "../config";

export default function FlashcardsPage() {
  const { jobId } = useParams();
  const backend = API_BASE_URL;

  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchCards() {
      try {
        const res = await fetch(`${backend}/api/flashcards/${jobId}`);
        const data = await res.json();

        if (data.error) {
          setError(data.error);
        } else {
          setCards(data.cards || []);
        }

      } catch (err) {
        setError("Failed to load flashcards");
      }

      setLoading(false);
    }

    fetchCards();
  }, [jobId]);

  if (loading)
    return (
      <div className="min-h-screen bg-depth flex items-center justify-center text-white text-xl">
        Generating Flashcards...
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-depth flex items-center justify-center text-red-400 text-xl">
        {error}
      </div>
    );

  if (!cards.length)
    return (
      <div className="min-h-screen bg-depth flex items-center justify-center text-white">
        <p className="text-lg opacity-80">No flashcards available.</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-depth flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="bg-grain opacity-20" />
      <div className="bg-grid-pattern absolute inset-0 opacity-30" />

      <div className="relative z-10 w-full max-w-4xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">Study Mode</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight">Flashcard Review</h1>
          <p className="text-zinc-500 max-w-lg mx-auto">Master concepts through active recall. Powered by spaced repetition algorithms.</p>
        </div>

        <FlashcardDeck cards={cards} />

        <div className="mt-16 text-center">
          <a
            href={`/status/${jobId}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-white transition-colors group"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span>
            <span>Return to Dashboard</span>
          </a>
        </div>
      </div>
    </div>
  );
}
