import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { Upload, Image as ImageIcon, Video as VideoIcon, Loader2, CheckCircle, AlertCircle, Download } from 'lucide-react';
import axios from 'axios';

export default function UpscalePage() {
    const [mode, setMode] = useState('video'); // 'video' | 'image'
    const [file, setFile] = useState(null);
    const [jobId, setJobId] = useState(null);
    const [status, setStatus] = useState(null); // 'idle' | 'uploading' | 'processing' | 'completed' | 'failed'
    const [progress, setProgress] = useState(0);
    const [resultUrl, setResultUrl] = useState(null);
    const [error, setError] = useState(null);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setError(null);
        }
    };

    const handleSubmit = async () => {
        if (!file) return;

        setStatus('uploading');
        const formData = new FormData();
        formData.append(mode, file);

        try {
            const endpoint = mode === 'video' ? 'http://localhost:5000/api/upscale/video' : 'http://localhost:5000/api/upscale/image';
            const response = await axios.post(endpoint, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setJobId(response.data.jobId);
            setStatus('processing');
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || err.message);
            setStatus('failed');
        }
    };

    useEffect(() => {
        let interval;
        if (status === 'processing' && jobId) {
            interval = setInterval(async () => {
                try {
                    const response = await axios.get(`http://localhost:5000/api/upscale/status/${jobId}`);
                    const job = response.data;

                    if (job.status === 'completed') {
                        setStatus('completed');
                        setResultUrl(job.outputUrl); // Assuming backend returns relative URL
                        setProgress(100);
                        clearInterval(interval);
                    } else if (job.status === 'failed') {
                        setStatus('failed');
                        setError(job.error);
                        clearInterval(interval);
                    } else {
                        setProgress(job.progress || 0);
                    }
                } catch (err) {
                    console.error("Status check failed", err);
                }
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [status, jobId]);

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-purple-500/30">
            <Header />

            <div className="pt-32 px-4 max-w-4xl mx-auto pb-20">
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold tracking-tight mb-4">
                        AI <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Upscale</span> Engine
                    </h1>
                    <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
                        Distributed CPU processing for 4K video and image enhancement.
                        <br />
                        <span className="text-sm text-zinc-600">Powered by ONNX Runtime & Node.js Workers</span>
                    </p>
                </div>

                {/* Mode Toggle */}
                <div className="flex justify-center mb-10">
                    <div className="bg-white/5 p-1 rounded-full flex gap-1 border border-white/10">
                        <button
                            onClick={() => { setMode('video'); setFile(null); setStatus('idle'); }}
                            className={`px-6 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${mode === 'video' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-zinc-400 hover:text-white'
                                }`}
                        >
                            <VideoIcon size={16} />
                            Video Upscale
                        </button>
                        <button
                            onClick={() => { setMode('image'); setFile(null); setStatus('idle'); }}
                            className={`px-6 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${mode === 'image' ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20' : 'text-zinc-400 hover:text-white'
                                }`}
                        >
                            <ImageIcon size={16} />
                            Image Upscale
                        </button>
                    </div>
                </div>

                {/* Main Card */}
                <div className="glass-tech rounded-3xl p-8 border border-white/10 bg-zinc-900/50 relative overflow-hidden">

                    {/* Status Overlay */}
                    {status === 'processing' && (
                        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center">
                            <div className="relative w-32 h-32 mb-6">
                                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                                    <circle cx="50" cy="50" r="45" fill="none" stroke="#333" strokeWidth="8" />
                                    <circle
                                        cx="50"
                                        cy="50"
                                        r="45"
                                        fill="none"
                                        stroke={mode === 'video' ? '#3b82f6' : '#9333ea'}
                                        strokeWidth="8"
                                        strokeDasharray="283"
                                        strokeDashoffset={283 - (283 * progress) / 100}
                                        className="transition-all duration-500 ease-out"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold font-mono">
                                    {progress}%
                                </div>
                            </div>
                            <p className="text-zinc-300 font-mono animate-pulse">
                                {mode === 'video' ? 'DISTRIBUTING_CHUNKS...' : 'ENHANCING_PIXELS...'}
                            </p>
                            <p className="text-zinc-500 text-xs mt-2">Running on 20 Worker Threads</p>
                        </div>
                    )}

                    {status === 'completed' && (
                        <div className="text-center py-10">
                            <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-400 border border-emerald-500/50">
                                <CheckCircle size={40} />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Upscale Complete!</h3>
                            <p className="text-zinc-400 mb-8">Your {mode} has been enhanced to 4K quality.</p>

                            {/* Result Preview */}
                            <div className="mb-8 rounded-xl border border-white/20 shadow-2xl mx-auto inline-block bg-black/50">
                                {mode === 'video' ? (
                                    <video
                                        src={`http://localhost:5000${resultUrl}`}
                                        controls
                                        className="max-w-full max-h-[70vh] w-auto rounded-xl"
                                    />
                                ) : (
                                    <img
                                        src={`http://localhost:5000${resultUrl}`}
                                        alt="Upscaled Result"
                                        className="max-w-full max-h-[70vh] w-auto object-contain rounded-xl"
                                    />
                                )}
                            </div>

                            <div className="flex justify-center gap-4">
                                <a
                                    href={`http://localhost:5000/api/upscale/download/${jobId}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-2 px-8 py-3 bg-white text-black rounded-full font-bold hover:bg-zinc-200 transition-colors"
                                >
                                    <Download size={20} />
                                    Download Result
                                </a>
                            </div>

                            <button
                                onClick={() => { setStatus('idle'); setFile(null); setProgress(0); }}
                                className="block mx-auto mt-6 text-sm text-zinc-500 hover:text-white transition-colors"
                            >
                                Process Another File
                            </button>
                        </div>
                    )}

                    {status === 'failed' && (
                        <div className="text-center py-10">
                            <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-red-400 border border-red-500/50">
                                <AlertCircle size={40} />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Processing Failed</h3>
                            <p className="text-red-300 mb-8 max-w-md mx-auto">{error || "An unexpected error occurred."}</p>

                            <button
                                onClick={() => { setStatus('idle'); setFile(null); setError(null); }}
                                className="px-6 py-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                            >
                                Try Again
                            </button>
                        </div>
                    )}

                    {/* Upload UI */}
                    {(status === 'idle' || status === 'uploading') && (
                        <div className={status === 'uploading' ? 'opacity-50 pointer-events-none' : ''}>
                            <div className="border-2 border-dashed border-white/10 rounded-2xl p-12 text-center hover:bg-white/[0.02] transition-colors relative group">
                                <input
                                    type="file"
                                    accept={mode === 'video' ? "video/*" : "image/*"}
                                    onChange={handleFileChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                />

                                <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/10 group-hover:border-white/30 transition-colors shadow-xl">
                                    {mode === 'video' ? <VideoIcon size={32} className="text-blue-400" /> : <ImageIcon size={32} className="text-purple-400" />}
                                </div>

                                <h3 className="text-xl font-bold mb-2">
                                    {file ? file.name : `Drop your ${mode} here`}
                                </h3>
                                <p className="text-zinc-500 text-sm mb-6">
                                    {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : (mode === 'video' ? 'MP4, MOV, MKV up to 2GB' : 'JPG, PNG, WEBP up to 50MB')}
                                </p>

                                {!file && (
                                    <button className="px-6 py-2 bg-white/10 rounded-full text-sm font-bold hover:bg-white/20 transition-colors pointer-events-none">
                                        Select File
                                    </button>
                                )}
                            </div>

                            {file && (
                                <div className="mt-8">
                                    <button
                                        onClick={handleSubmit}
                                        disabled={status === 'uploading'}
                                        className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all ${mode === 'video'
                                            ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 shadow-lg shadow-blue-500/20'
                                            : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-lg shadow-purple-500/20'
                                            }`}
                                    >
                                        {status === 'uploading' ? (
                                            <>
                                                <Loader2 size={24} className="animate-spin" />
                                                Uploading...
                                            </>
                                        ) : (
                                            <>
                                                Start Upscaling
                                                <div className="bg-white/20 px-2 py-0.5 rounded text-xs font-mono">4K</div>
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                </div>
            </div>
        </div >
    );
}
