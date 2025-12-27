import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { Play, Pause, Download, Palette, Sparkles, Edit3, Clock } from "lucide-react";
import { API_BASE_URL } from "../config";

export default function ReelsPage() {
    // ...
    const videoRef = useRef(null);
    const backend = API_BASE_URL;

    const STYLES = [
        { id: "hormozi", name: "Hormozi", color: "#FACC15" },
        { id: "devin", name: "Devin", color: "#FFFFFF" },
        { id: "beast", name: "Beast", color: "#FF0000" },
        { id: "neon", name: "Neon", color: "#00FFFF" },
        { id: "glitch", name: "Glitch", color: "#00FF00" },
        { id: "minimal", name: "Minimal", color: "#E5E5E5" },
        { id: "gradient", name: "Gradient", color: "#A855F7" },
        { id: "fire", name: "Fire", color: "#FF6B00" },
        { id: "ice", name: "Ice", color: "#00D9FF" },
        { id: "gold", name: "Gold", color: "#FFD700" },
        { id: "retro", name: "Retro", color: "#FF1493" },
    ];

    // 1. Poll Job Data
    useEffect(() => {
        let interval;
        async function fetchJob() {
            try {
                const res = await fetch(`${backend}/api/process/status/${jobId}`);
                const data = await res.json();
                setJob(data.job);

                if (data.job?.filePath) {
                    const relPath = data.job.filePath.split("src/uploads")[1] || data.job.filePath.split("uploads")[1];
                    setVideoUrl(`${backend}/uploads${relPath}`);
                }

                if (data.job?.transcriptionData?.words && data.job.transcriptionData.words.length > 0) {
                    const w = data.job.transcriptionData.words;
                    setWords(w);
                    setChunks(createChunks(w, 3));
                    setLoading(false);
                    clearInterval(interval);
                }
                else if (data.job?.transcript) {
                    setIsUsingFakeTimestamps(true);
                    const fakeWords = data.job.transcript.split(/\s+/).map((w, i) => ({
                        word: w,
                        start: i * 0.4,
                        end: (i * 0.4) + 0.4
                    }));
                    setWords(fakeWords);
                    setChunks(createChunks(fakeWords, 3));
                    setLoading(false);
                    clearInterval(interval);
                }

                if (data.job?.status === "failed") {
                    setLoading(false);
                    clearInterval(interval);
                }
            } catch (err) {
                console.error("Error fetching job:", err);
            }
        }
        fetchJob();
        interval = setInterval(fetchJob, 2000);
        return () => clearInterval(interval);
    }, [jobId]);

    function createChunks(wordsArray, size) {
        const result = [];
        for (let i = 0; i < wordsArray.length; i += size) {
            const slice = wordsArray.slice(i, i + size);
            result.push({
                words: slice,
                start: slice[0].start,
                end: slice[slice.length - 1].end,
                id: i
            });
        }
        return result;
    }

    // 2. 🔥 PERFECT SYNC (AI + Manual Offset)
    useEffect(() => {
        let animationFrameId;

        const loop = () => {
            if (videoRef.current && !videoRef.current.paused) {
                // AI timestamps + manual fine-tune
                const t = videoRef.current.currentTime + syncOffset;

                const activeC = chunks.find(c => t >= c.start && t <= c.end);
                setCurrentChunk(activeC || null);

                if (activeC) {
                    const idx = activeC.words.findIndex(w => t >= w.start && t < w.end);
                    setActiveWordIndex(idx !== -1 ? idx : -1);
                } else {
                    setActiveWordIndex(-1);
                }
            }
            animationFrameId = requestAnimationFrame(loop);
        };

        if (isPlaying) loop();
        else {
            if (videoRef.current) {
                const t = videoRef.current.currentTime + syncOffset;
                const activeC = chunks.find(c => t >= c.start && t <= c.end);
                setCurrentChunk(activeC || null);
                if (activeC) {
                    const idx = activeC.words.findIndex(w => t >= w.start && t < w.end);
                    setActiveWordIndex(idx !== -1 ? idx : -1);
                }
            }
            cancelAnimationFrame(animationFrameId);
        }

        return () => cancelAnimationFrame(animationFrameId);
    }, [isPlaying, chunks, syncOffset]);

    // 3. Event Listeners
    useEffect(() => {
        const vid = videoRef.current;
        if (!vid) return;

        const onPlay = () => setIsPlaying(true);
        const onPause = () => setIsPlaying(false);
        const onSeek = () => {
            const t = vid.currentTime + syncOffset;
            const activeC = chunks.find(c => t >= c.start && t <= c.end);
            setCurrentChunk(activeC || null);
        };

        vid.addEventListener('play', onPlay);
        vid.addEventListener('pause', onPause);
        vid.addEventListener('seeking', onSeek);

        return () => {
            vid.removeEventListener('play', onPlay);
            vid.removeEventListener('pause', onPause);
            vid.removeEventListener('seeking', onSeek);
        };
    }, [chunks, syncOffset]);

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) videoRef.current.pause();
            else videoRef.current.play();
            setIsPlaying(!isPlaying);
        }
    };

    const handleWordEdit = (idx, newWord) => {
        const updatedWords = [...words];
        updatedWords[idx] = { ...updatedWords[idx], word: newWord };
        setWords(updatedWords);
        setChunks(createChunks(updatedWords, 3));
        setEditingWordIdx(null);
    };

    if (loading) return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white gap-4">
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <h2 className="text-xl font-bold">Generating Captions...</h2>
            <p className="text-zinc-500">AI is creating perfect timestamps...</p>
        </div>
    );

    if (!job) return <div className="text-red-500 p-10">Job not found</div>;

    if (job.status === "failed") return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center text-red-500 gap-4 p-10 text-center">
            <div className="text-3xl">❌</div>
            <h2 className="text-xl font-bold">Processing Failed</h2>
            <p className="text-zinc-500 max-w-md font-mono text-sm bg-zinc-900 p-4 rounded border border-red-900">
                {job.error || "Unknown error occurred"}
            </p>
            <a href="/reels-creator" className="btn-primary-tech px-6 py-2">Try Again</a>
        </div>
    );

    return (
        <div className="min-h-screen bg-black text-white flex flex-col md:flex-row overflow-hidden">

            {/* LEFT: Editor */}
            <div className="w-full md:w-[380px] p-5 border-r border-white/10 flex flex-col gap-5 h-screen overflow-y-auto custom-scrollbar bg-zinc-950">
                <div className="flex items-center gap-3 mb-1">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
                        <Sparkles size={20} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold tracking-tight">Reels Editor</h1>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] text-zinc-500">AI-Powered Sync</span>
                            {!isUsingFakeTimestamps && (
                                <span className="text-[9px] bg-green-500/20 text-green-500 px-1.5 py-0.5 rounded border border-green-500/30">
                                    ✓ Active
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Templates */}
                <div className="space-y-2">
                    <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
                        <Palette size={10} /> Templates ({STYLES.length})
                    </label>
                    <div className="grid grid-cols-3 gap-2 max-h-[180px] overflow-y-auto custom-scrollbar pr-1">
                        {STYLES.map((s) => (
                            <button
                                key={s.id}
                                onClick={() => {
                                    setStyle(s.id);
                                    setTextColor(s.color);
                                }}
                                className={`h-12 rounded-lg border transition-all overflow-hidden ${style === s.id
                                    ? "border-indigo-500 bg-indigo-500/10 ring-1 ring-indigo-500"
                                    : "border-white/10 bg-zinc-900 hover:border-white/20"
                                    }`}
                            >
                                <div className={`flex items-center justify-center text-[10px] font-bold h-full ${style === s.id ? 'text-indigo-300' : 'text-zinc-600'}`}>
                                    {s.name}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Controls */}
                <div className="space-y-3 p-3 bg-zinc-900/50 rounded-lg border border-white/5">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-mono text-zinc-500 uppercase">Color</label>
                        <div className="flex gap-2">
                            <input
                                type="color"
                                value={textColor}
                                onChange={(e) => setTextColor(e.target.value)}
                                className="w-9 h-9 rounded cursor-pointer"
                            />
                            <input
                                type="text"
                                value={textColor}
                                onChange={(e) => setTextColor(e.target.value)}
                                className="flex-1 bg-black border border-white/10 rounded px-2 text-xs font-mono text-zinc-300 focus:outline-none focus:border-indigo-500"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <div className="flex justify-between text-[10px] font-mono text-zinc-500">
                            <span>SIZE</span>
                            <span>{fontSize}px</span>
                        </div>
                        <input type="range" min="20" max="100" value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500" />
                    </div>

                    <div className="space-y-1.5">
                        <div className="flex justify-between text-[10px] font-mono text-zinc-500">
                            <span>POSITION</span>
                            <span>{yPos}%</span>
                        </div>
                        <input type="range" min="10" max="90" value={yPos} onChange={(e) => setYPos(Number(e.target.value))} className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500" />
                    </div>

                    {/* 🔥 MANUAL SYNC OFFSET */}
                    <div className="space-y-1.5 pt-3 border-t border-white/5">
                        <div className="flex justify-between text-[10px] font-mono">
                            <span className="flex items-center gap-1 text-yellow-500">
                                <Clock size={10} /> SYNC OFFSET
                            </span>
                            <span className={syncOffset === 0 ? "text-green-500" : "text-yellow-400"}>
                                {syncOffset > 0 ? `+${syncOffset.toFixed(2)}s` : `${syncOffset.toFixed(2)}s`}
                            </span>
                        </div>
                        <input
                            type="range"
                            min="-1"
                            max="1"
                            step="0.01"
                            value={syncOffset}
                            onChange={(e) => setSyncOffset(Number(e.target.value))}
                            className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-yellow-500"
                        />
                        <p className="text-[9px] text-zinc-600">
                            {syncOffset < 0 ? "⬅️ Earlier" : syncOffset > 0 ? "➡️ Later" : "✅ Perfect"}
                        </p>
                    </div>
                </div>

                {/* Editable Transcript */}
                <div className="flex-1 overflow-y-auto bg-zinc-900/30 rounded-lg p-3 border border-white/5">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-[10px] text-zinc-500 font-mono">TRANSCRIPT</p>
                        <Edit3 size={10} className="text-zinc-600" />
                    </div>
                    <div className="space-y-0.5 leading-relaxed text-sm">
                        {words.map((w, i) => (
                            editingWordIdx === i ? (
                                <input
                                    key={i}
                                    autoFocus
                                    type="text"
                                    defaultValue={w.word}
                                    onBlur={(e) => handleWordEdit(i, e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleWordEdit(i, e.target.value);
                                        if (e.key === 'Escape') setEditingWordIdx(null);
                                    }}
                                    className="inline-block bg-indigo-600/30 text-white px-1 rounded text-sm mr-1 border border-indigo-500 focus:outline-none"
                                />
                            ) : (
                                <span
                                    key={i}
                                    className={`inline-block mr-1 text-sm transition-colors cursor-pointer hover:text-white group ${currentChunk && currentChunk.words.includes(w) ? "text-indigo-400 font-bold" : "text-zinc-600"
                                        }`}
                                    onClick={() => { if (videoRef.current) videoRef.current.currentTime = w.start; }}
                                    onDoubleClick={() => setEditingWordIdx(i)}
                                >
                                    {w.word}
                                </span>
                            )
                        ))}
                    </div>
                    <p className="text-[9px] text-zinc-700 mt-2">Double-click to edit • Click to seek</p>
                </div>

                <button className="btn-primary-tech w-full py-3 flex items-center justify-center gap-2 mt-auto shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all text-sm">
                    <Download size={16} />
                    Export Video
                </button>
            </div>

            {/* RIGHT: Preview */}
            <div className="flex-1 bg-zinc-950 flex items-center justify-center p-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-black to-black pointer-events-none" />

                <div className="relative aspect-[9/16] h-[88vh] bg-black rounded-2xl overflow-hidden shadow-2xl border border-zinc-800 ring-1 ring-white/10">

                    {videoUrl && (
                        <video ref={videoRef} src={videoUrl} className="w-full h-full object-cover" onClick={togglePlay} playsInline loop />
                    )}

                    {/* Captions */}
                    <div className="absolute inset-x-0 pointer-events-none flex justify-center text-center px-8" style={{ top: `${yPos}%` }}>
                        {currentChunk && (
                            <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 max-w-[90%]">
                                {currentChunk.words.map((w, i) => {
                                    const isActive = i === activeWordIndex;
                                    let dynamicStyle = {};

                                    if (style === 'hormozi') {
                                        dynamicStyle = {
                                            transform: isActive ? 'scale(1.15) rotate(-2deg)' : 'scale(1)',
                                            color: isActive ? textColor : '#FFFFFF',
                                            transition: 'all 0.08s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                                        };
                                    } else {
                                        dynamicStyle = {
                                            color: textColor,
                                            opacity: isActive ? 1 : 0.7,
                                            transform: isActive ? 'scale(1.05)' : 'scale(1)',
                                            transition: 'all 0.08s ease'
                                        };
                                    }

                                    return (
                                        <span
                                            key={i}
                                            className={`${getStyleClass(style)} inline-block`}
                                            style={{
                                                fontSize: `${fontSize}px`,
                                                textShadow: style === 'neon' ? `0 0 20px ${textColor}, 0 0 40px ${textColor}` : '2px 2px 0px #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000',
                                                ...dynamicStyle
                                            }}
                                        >
                                            {w.word}
                                        </span>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Play Overlay */}
                    {!isPlaying && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm pointer-events-none transition-opacity duration-300">
                            <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-xl animate-pulse-slow">
                                <Play size={32} className="text-white fill-white ml-1" />
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}

function getStyleClass(style) {
    switch (style) {
        case "hormozi": return "font-black uppercase italic drop-shadow-[0_4px_4px_rgba(0,0,0,0.9)] leading-tight";
        case "devin": return "font-bold font-sans tracking-tight drop-shadow-md";
        case "beast": return "font-black uppercase drop-shadow-[4px_4px_0px_rgba(0,0,0,1)] tracking-wide";
        case "neon": return "font-mono font-bold drop-shadow-[0_0_10px_currentColor] tracking-widest";
        case "glitch": return "font-mono font-bold tracking-widest uppercase animate-pulse";
        case "minimal": return "font-medium bg-black/60 px-2 py-1 rounded-lg backdrop-blur-md shadow-lg";
        case "gradient": return "font-black uppercase bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent drop-shadow-[0_2px_8px_rgba(168,85,247,0.4)]";
        case "fire": return "font-black uppercase drop-shadow-[0_0_15px_rgba(255,107,0,0.8)]";
        case "ice": return "font-bold drop-shadow-[0_0_20px_rgba(0,217,255,0.7)]";
        case "gold": return "font-black uppercase drop-shadow-[0_4px_12px_rgba(255,215,0,0.6)]";
        case "retro": return "font-black drop-shadow-[3px_3px_0px_#000,_6px_6px_0px_rgba(255,20,147,0.3)]";
        default: return "font-bold";
    }
}
