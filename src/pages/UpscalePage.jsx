import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { Upload, Image as ImageIcon, Video as VideoIcon, Loader2, CheckCircle, AlertCircle, Download } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from "../config";

export default function UpscalePage() {
    // ...
    const handleSubmit = async () => {
        if (!file) return;

        setStatus('uploading');
        const formData = new FormData();
        formData.append(mode, file);

        try {
            const endpoint = mode === 'video' ? `${API_BASE_URL}/api/upscale/video` : `${API_BASE_URL}/api/upscale/image`;
            const response = await axios.post(endpoint, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setJobId(response.data.jobId);
            setStatus('processing');
        } catch (err) {
            // ...
            useEffect(() => {
                let interval;
                if (status === 'processing' && jobId) {
                    interval = setInterval(async () => {
                        try {
                            const response = await axios.get(`${API_BASE_URL}/api/upscale/status/${jobId}`);
                            const job = response.data;

                            if (job.status === 'completed') {
                                // ...
                                {
                                    mode === 'video' ? (
                                        <video
                                            src={`${API_BASE_URL}${resultUrl}`}
                                            controls
                                            className="max-w-full max-h-[70vh] w-auto rounded-xl"
                                        />
                                    ) : (
                                    <img
                                        src={`${API_BASE_URL}${resultUrl}`}
                                        alt="Upscaled Result"
                                        className="max-w-full max-h-[70vh] w-auto object-contain rounded-xl"
                                    />
                                )
                                }
                            </div >

                            <div className="flex justify-center gap-4">
                                <a
                                    href={`${API_BASE_URL}/api/upscale/download/${jobId}`}
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
                        </div >
                    )
}

{
    status === 'failed' && (
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
    )
}

{/* Upload UI */ }
{
    (status === 'idle' || status === 'uploading') && (
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
    )
}

                </div >
            </div >
        </div >
    );
}
