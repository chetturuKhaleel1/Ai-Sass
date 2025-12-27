import React, { useState, useRef } from "react";
import { Upload, Link as LinkIcon, X, ArrowRight, Loader2 } from "lucide-react";

export default function UploadBox({ onSubmit, buttonText = "Generate Flashcards" }) {
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setUrl(""); // Clear URL if file selected
  };

  const handleSubmit = async () => {
    if (!file && !url) return;

    setLoading(true);
    // Simulate processing delay for effect
    await new Promise(resolve => setTimeout(resolve, 800));

    if (file) {
      onSubmit({ file });
    } else {
      onSubmit({ url });
    }
    setLoading(false);
  };

  return (
    <div id="upload-section" className="w-full max-w-2xl mx-auto">
      <div className="glass-tech rounded-xl overflow-hidden relative group">

        {/* Header Bar */}
        <div className="bg-white/5 border-b border-white/5 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-zinc-500" />
            <span className="text-xs font-mono text-zinc-400">INPUT_STREAM</span>
          </div>
          <div className="flex gap-1">
            <div className="w-1.5 h-1.5 rounded-sm bg-zinc-700" />
            <div className="w-1.5 h-1.5 rounded-sm bg-zinc-700" />
          </div>
        </div>

        <div className="p-8">
          {/* URL Input */}
          <div className="relative mb-6">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">
              <LinkIcon size={16} />
            </div>
            <input
              type="text"
              placeholder="Paste YouTube URL or magnet link..."
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                if (e.target.value) setFile(null);
              }}
              className="w-full bg-black/40 border border-white/10 rounded-lg py-4 pl-12 pr-4 text-sm font-mono text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
            />
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px bg-white/5 flex-1" />
            <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">OR UPLOAD SOURCE</span>
            <div className="h-px bg-white/5 flex-1" />
          </div>

          {/* File Drop Zone */}
          <div className="relative border border-dashed border-white/10 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] transition-colors group/drop">
            <input
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className="p-10 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center mb-4 group-hover/drop:border-indigo-500/50 transition-colors">
                <Upload size={20} className="text-zinc-400 group-hover/drop:text-indigo-400 transition-colors" />
              </div>
              <p className="text-sm text-zinc-300 font-medium mb-1">Drop video file here</p>
              <p className="text-xs text-zinc-600 font-mono">MP4, MOV, MKV (MAX 2GB)</p>
            </div>

            {/* Scanning Effect */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-0 group-hover/drop:opacity-100 transition-opacity">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-indigo-500/5 to-transparent -translate-y-full group-hover/drop:translate-y-full transition-transform duration-1000 ease-linear" />
            </div>
          </div>

          {/* File Preview */}
          {file && (
            <div className="mt-4 p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-indigo-500/20 flex items-center justify-center">
                  <span className="text-xs font-bold text-indigo-400">MP4</span>
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-white">{file.name}</p>
                  <p className="text-[10px] text-indigo-300 font-mono">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              <button onClick={() => setFile(null)} className="p-1 hover:bg-white/10 rounded">
                <X size={14} className="text-zinc-400" />
              </button>
            </div>
          )}

          {/* Action Button */}
          <div className="mt-8">
            <button
              onClick={handleSubmit}
              disabled={loading || (!file && !url)}
              className={`w-full btn-primary-tech py-4 flex items-center justify-center gap-2 ${loading || (!file && !url) ? "opacity-50 cursor-not-allowed" : ""
                }`}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span className="font-mono">PROCESSING_STREAM...</span>
                </>
              ) : (
                <>
                  <span>{buttonText}</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Bottom Status Bar */}
        <div className="bg-black/20 border-t border-white/5 px-4 py-2 flex justify-between items-center">
          <div className="flex gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-[10px] font-mono text-zinc-500">SYSTEM_READY</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
              <span className="text-[10px] font-mono text-zinc-600">V2.1.0</span>
            </div>
          </div>
          <div className="text-[10px] font-mono text-zinc-600">
            LATENCY: 24ms
          </div>
        </div>

      </div>
    </div>
  );
}
