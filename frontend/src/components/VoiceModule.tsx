"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Square, Play, Trash2, FileText, Sparkles, Wand2, Loader2, ChevronRight, Send } from "lucide-react";
import api from "@/lib/api";

export default function VoiceModule() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcription, setTranscription] = useState("");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        setAudioURL(URL.createObjectURL(blob));
      };

      mediaRecorder.start();
      setIsRecording(true);
      setTranscription("");
    } catch (err) {
      console.error("Failed to start recording", err);
      alert("Microphone access denied or not available.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const handleTranscribe = async () => {
    if (!audioBlob) return;
    setIsTranscribing(true);
    
    try {
      const formData = new FormData();
      formData.append("file", audioBlob, "recording.webm");
      
      const response = await api.post("/voice/process/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      setTranscription(response.data.transcription);
    } catch (error) {
      console.error("Transcription failed", error);
      alert("Failed to transcribe audio. Please try again.");
    } finally {
      setIsTranscribing(false);
    }
  };

  return (
    <div className="space-y-10 max-w-5xl mx-auto animate-fade-in">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2 font-heading tracking-tight">Voice to Smart Notes</h2>
        <p className="text-white/40 font-medium font-sans">Turn your lectures and thoughts into perfectly structured academic summaries.</p>
      </div>

      {/* Recording Interface */}
      <div className="glass-panel p-12 flex flex-col items-center justify-center gap-8 relative overflow-hidden bg-white/[0.02] border-white/5">
        {/* Decorative Waveform (Animated) */}
        {isRecording && (
          <div className="absolute inset-0 flex items-center justify-center gap-1 opacity-20 pointer-events-none">
            {[...Array(30)].map((_, i) => (
              <motion.div 
                key={i}
                animate={{ height: [10, Math.random() * 60 + 20, 10] }}
                transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.05 }}
                className="w-1 bg-primary rounded-full"
              />
            ))}
          </div>
        )}

        <div className="relative z-10">
          <motion.button 
            onClick={isRecording ? stopRecording : startRecording}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl ${
              isRecording 
              ? 'bg-red-500 shadow-red-500/50 animate-pulse' 
              : 'bg-primary shadow-purple-glow hover:shadow-neon-glow'
            }`}
          >
            {isRecording ? <Square className="w-10 h-10 text-white fill-current" /> : <Mic className="w-10 h-10 text-white" />}
          </motion.button>
        </div>

        <div className="text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-primary-light">
            {isRecording ? "Listening..." : audioURL ? "Recording Ready" : "Start New Recording"}
          </span>
          <p className="text-[10px] text-white/30 uppercase tracking-tighter mt-2 font-bold">Crystal clear audio capture for heavy academic sessions</p>
        </div>
      </div>

      <AnimatePresence>
        {audioURL && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {/* Playback Controls */}
            <div className="glass-panel p-6 flex flex-col gap-6 bg-white/[0.01] border-white/5">
              <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                <audio src={audioURL} controls className="w-full h-8 accent-primary" />
              </div>
              
              <div className="flex gap-4">
                <button 
                  onClick={handleTranscribe}
                  className="flex-1 btn-glow flex items-center justify-center gap-2 font-bold text-[10px] uppercase tracking-widest"
                  disabled={isTranscribing}
                >
                  {isTranscribing ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : <Wand2 className="w-4 h-4 text-white" />}
                  {isTranscribing ? "Transcribing..." : "AI Transcribe"}
                </button>
                <button 
                  onClick={() => setAudioURL(null)}
                  className="p-4 bg-white/5 rounded-xl border border-white/10 text-red-500/60 hover:text-red-500 transition-all"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Results Panel */}
            <div className="glass-panel p-6 min-h-[300px] flex flex-col bg-white/[0.02] border-white/5">
              <header className="flex items-center gap-3 mb-6">
                <FileText className="w-5 h-5 text-primary-light" />
                <h3 className="font-bold font-heading">Intelligence Output</h3>
              </header>
              
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                {!transcription ? (
                  <div className="opacity-30">
                    <Sparkles className="w-12 h-12 mb-4 mx-auto" />
                    <p className="text-sm italic font-medium">Click &apos;AI Transcribe&apos; to process <br /> your voice notes.</p>
                  </div>
                ) : (
                  <div className="text-left w-full space-y-6">
                    <div className="p-4 bg-white/5 border-l-4 border-primary rounded-xl">
                      <p className="text-sm text-white/70 italic leading-relaxed">
                        &quot;{transcription}&quot;
                      </p>
                    </div>
                    <button className="w-full p-4 glass-card border-primary/20 flex items-center justify-between group transition-all hover:bg-primary/10">
                      <span className="text-xs font-bold uppercase tracking-widest text-primary-light">Linked to Knowledge Base</span>
                      <ChevronRight className="w-4 h-4 text-primary-light group-hover:translate-x-1 transition-transform" />
                    </button>
                    <p className="text-[10px] text-white/20 text-center font-bold uppercase tracking-tighter">Voice data has been indexed for history and QA</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
