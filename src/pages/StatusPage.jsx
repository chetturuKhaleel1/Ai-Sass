import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function StatusPage() {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cardsPreview, setCardsPreview] = useState(null);
  const [cardsLoading, setCardsLoading] = useState(false);
  const [cardsError, setCardsError] = useState("");
  const backend = "http://localhost:5000";

  // ==============================
  // FIX: Convert absolute path → public URL
  // ==============================
  function toPublicPath(fullPath) {
    if (!fullPath) return "";
    const normalized = fullPath.replace(/\\/g, "/"); // Windows fix
    const idx = normalized.indexOf("/uploads/");
    return idx !== -1 ? normalized.substring(idx) : null;
  }

  useEffect(() => {
    let interval;

    async function fetchStatus() {
      try {
        const res = await fetch(`${backend}/api/process/status/${jobId}`);
        const data = await res.json();

        setJob(data.job);
        setLoading(false);

        if (data.job && data.job.status === "done") {
          clearInterval(interval);
        }

        const notesAvailable =
          (data.job?.finalNotes || data.job?.notes || "").trim().length > 0;
        const transcriptAvailable =
          (data.job?.transcript || "").trim().length > 0;

        if ((notesAvailable || transcriptAvailable) && !cardsPreview && !cardsLoading) {
          fetchFlashcardsPreview(data.job?.jobId);
        }

      } catch (err) {
        console.error("Status error:", err);
      }
    }

    fetchStatus();
    interval = setInterval(fetchStatus, 2000);
    return () => clearInterval(interval);

  }, [jobId]);

  async function fetchFlashcardsPreview(id) {
    if (!id) return;
    setCardsLoading(true);
    setCardsError("");
    try {
      const res = await fetch(`${backend}/api/flashcards/${id}`);
      const data = await res.json();

      if (data.error) {
        setCardsError(data.error);
        setCardsPreview([]);
      } else {
        const preview = (data.cards || []).slice(0, 3);
        setCardsPreview(preview);
      }

    } catch (err) {
      console.error("Flashcards preview error:", err);
      setCardsError("Failed to load flashcards preview");
      setCardsPreview([]);
    }

    setCardsLoading(false);
  }

  if (loading) return <div className="p-10 text-white">Loading...</div>;
  if (!job) return <div className="p-10 text-red-500">Job not found</div>;

  const finalNotes = job.finalNotes || job.notes || "";

  const frameDir =
    job.framesPath?.length
      ? job.framesPath[0].split("/").slice(0, -1).join("/")
      : null;

  const canShowFlashcardsSection =
    finalNotes.trim().length > 0 ||
    (job.transcript || "").trim().length > 0;

  return (
    <div className="min-h-screen bg-depth p-10 container mx-auto pb-20">
      <div className="bg-grain opacity-20" />

      <h1 className="text-display text-center mb-12 text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-500">
        Processing Status
      </h1>

      {/* JOB INFO CARD */}
      <div className="glass-tech rounded-xl p-8 mb-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-50" />

        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-2">JOB_ID</p>
            <p className="text-xl font-mono text-white">{job.jobId}</p>
          </div>
          <div>
            <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-2">STATUS</p>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${job.status === "failed" ? "bg-red-500" : "bg-emerald-500 animate-pulse"}`} />
              <p className="text-xl font-bold text-white uppercase tracking-tight">
                {job.status}
              </p>
            </div>
          </div>
          <div>
            <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-2">PROGRESS</p>
            <div className="flex items-center gap-4">
              <div className="flex-1 h-1 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-1000 ease-out ${job.status === "failed" ? "bg-red-500" : "bg-indigo-500"
                    }`}
                  style={{ width: `${job.progress}%` }}
                />
              </div>
              <span className="text-lg font-mono text-white">{job.progress}%</span>
            </div>
          </div>
        </div>

        {job.error && (
          <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-200 font-mono text-sm">
            <span className="font-bold">ERROR:</span> {job.error}
          </div>
        )}
      </div>

      {/* RESULTS SECTION */}
      <div className="space-y-12">

        {/* SLIDE PREVIEW */}
        <div className="glass-tech p-8 rounded-xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-3 text-white">
              <span className="text-zinc-500">01.</span> Clean Slides
            </h2>
            {job.slidesPdf && (
              <a
                href={`${backend}${job.slidesPdf}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-tech flex items-center gap-2 px-4 py-2 text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download PDF
              </a>
            )}
          </div>

          {frameDir ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {job.framesPath.slice(0, 8).map((frame, idx) => {
                const publicPath = toPublicPath(frame);
                if (!publicPath) return null;

                return (
                  <div key={idx} className="group relative rounded-lg overflow-hidden border border-white/10 shadow-lg hover:border-indigo-500/50 transition-all duration-300">
                    <img
                      src={`${backend}${publicPath}`}
                      alt="Slide Preview"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-zinc-500 font-mono text-sm">NO_FRAMES_DETECTED</p>
          )}
        </div>

        {/* FINAL NOTES */}
        {finalNotes && (
          <div className="glass-tech p-8 rounded-xl">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-white">
              <span className="text-zinc-500">02.</span> Final Notes
            </h2>
            <div className="prose prose-invert max-w-none">
              <pre className="whitespace-pre-wrap text-base leading-relaxed text-zinc-300 font-sans bg-transparent p-0 border-0">
                {finalNotes}
              </pre>
            </div>
          </div>
        )}

        {/* TRANSCRIPT */}
        {job.transcript && (
          <div className="glass-tech p-6 rounded-xl bg-black/20">
            <h2 className="text-lg font-bold mb-4 text-zinc-400 font-mono uppercase tracking-wider">Raw Transcript</h2>
            <div className="max-h-60 overflow-y-auto custom-scrollbar pr-2">
              <pre className="whitespace-pre-wrap text-zinc-500 text-xs font-mono leading-relaxed">{job.transcript}</pre>
            </div>
          </div>
        )}

        {/* OCR */}
        {job.ocrText && (
          <div className="glass-tech p-6 rounded-xl bg-black/20">
            <h2 className="text-lg font-bold mb-4 text-zinc-400 font-mono uppercase tracking-wider">OCR Output</h2>
            <div className="max-h-60 overflow-y-auto custom-scrollbar pr-2">
              <pre className="whitespace-pre-wrap text-zinc-500 text-xs font-mono leading-relaxed">{job.ocrText}</pre>
            </div>
          </div>
        )}

        {/* FLASHCARDS PREVIEW */}
        {canShowFlashcardsSection && (
          <div className="glass-tech p-8 rounded-xl border-indigo-500/20">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold flex items-center gap-3 text-white">
                <span className="text-zinc-500">03.</span> Flashcards
              </h2>
              <span className="px-3 py-1 rounded bg-indigo-500/10 text-indigo-400 text-[10px] font-mono font-bold uppercase tracking-wider border border-indigo-500/20">
                AI Generated
              </span>
            </div>

            {cardsLoading ? (
              <div className="flex items-center gap-3 text-zinc-500 font-mono text-sm animate-pulse">
                <div className="w-2 h-2 rounded-full bg-indigo-500" />
                GENERATING_CARDS...
              </div>
            ) : cardsError ? (
              <p className="text-red-400 font-mono text-sm">{cardsError}</p>
            ) : cardsPreview && cardsPreview.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
                {cardsPreview.map((c, i) => (
                  <div key={i} className="p-6 bg-zinc-900/50 rounded-lg border border-white/5 hover:border-indigo-500/30 transition-colors group">
                    <div className="font-medium text-white mb-4 group-hover:text-indigo-400 transition-colors">{c.front}</div>
                    <div className="text-sm text-zinc-500 mb-4 line-clamp-3">{c.back}</div>
                    {c.hints?.length > 0 && (
                      <div className="text-[10px] text-zinc-600 font-mono flex gap-2">
                        <span className="text-indigo-500">::</span>
                        {c.hints.length} HINTS
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-zinc-500 font-mono text-sm">NO_CARDS_GENERATED</p>
            )}

            <div className="flex gap-4">
              <a
                href={`/flashcards/${job.jobId}`}
                className="btn-primary-tech flex items-center gap-2 px-6 py-3"
              >
                <span>View Deck</span>
                <span className="text-lg">→</span>
              </a>

              <button
                onClick={() => fetchFlashcardsPreview(job.jobId)}
                className="btn-tech px-6 py-3"
              >
                Refresh Preview
              </button>
            </div>
          </div>
        )}

        {/* REELS SECTION */}
        <div className="glass-tech p-8 rounded-xl border-purple-500/20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-3 text-white">
              <span className="text-zinc-500">04.</span> Viral Reels
            </h2>
            <span className="px-3 py-1 rounded bg-purple-500/10 text-purple-400 text-[10px] font-mono font-bold uppercase tracking-wider border border-purple-500/20">
              New Feature
            </span>
          </div>
          <p className="text-zinc-400 mb-6 max-w-2xl">
            Turn this video into viral short-form content with auto-captions, emojis, and Hormozi-style animations.
          </p>
          <a
            href={`/reels/${job.jobId}`}
            className="btn-primary-tech flex items-center gap-2 px-6 py-3 w-fit bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 border-none"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
            <span>Open Reels Editor</span>
          </a>
        </div>

      </div>
    </div>
  );
}
