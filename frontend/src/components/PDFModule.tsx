"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, CheckCircle2, AlertCircle, Search, Sparkles, Loader2, Send, Shield } from "lucide-react";
import api from "@/lib/api";

export default function PDFModule() {
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessed, setIsProcessed] = useState(false);
  const [documentId, setDocumentId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([
    { role: 'assistant', content: 'Upload a PDF to start our study session! I can help you summarize complex topics or answer specific questions from your material.' }
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(10);
    
    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploadProgress(40);
      const { data } = await api.post("/pdf/process", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUploadProgress(100);
      setIsProcessed(true);
      setDocumentId(data.document_id);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `✅ Successfully indexed "${file.name}" (${data.chunk_count} chunks).\n\n**Summary:** ${data.summary}\n\nYou can now ask me anything about it!` 
      }]);
    } catch (error: any) {
      console.error("Upload failed", error);
      const detail = error.response?.data?.detail || "Unknown error";
      setMessages(prev => [...prev, { role: 'assistant', content: `❌ Upload failed: ${detail}` }]);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || sending || !documentId) return;

    const userMessage = input;
    setInput("");
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setSending(true);

    try {
      const formData = new URLSearchParams();
      formData.append("query", userMessage);
      formData.append("document_id", documentId);

      const { data } = await api.post("/pdf/qa", formData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      let response = data.answer;
      if (data.confidence > 0) {
        response += `\n\n🎯 Confidence: ${(data.confidence * 100).toFixed(0)}%`;
      }
      if (data.sources && data.sources.length > 0) {
        response += `\n📚 Based on ${data.sources.length} source(s)`;
      }

      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error: any) {
      const detail = error.response?.data?.detail || "Connection error";
      setMessages(prev => [...prev, { role: 'assistant', content: `❌ ${detail}` }]);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start animate-fade-in">
      {/* Upload Section */}
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold mb-2 font-heading tracking-tight">PDF Intelligence</h2>
          <p className="text-white/40 font-medium">Upload your study material and let AI uncover its secrets.</p>
        </div>

        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept=".pdf"
          className="hidden"
        />

        <div 
          className={`h-80 glass-card border-dashed border-2 flex flex-col items-center justify-center p-12 transition-all cursor-pointer group ${isProcessed ? 'border-green-400/30' : 'border-white/10'}`}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mb-6 shadow-purple-glow group-hover:scale-110 transition-transform">
            <Upload className="w-8 h-8 text-primary-light" />
          </div>
          <h3 className="text-lg font-bold mb-2 font-heading">
            {isProcessed ? "Upload Another File" : "Drag & Drop Study Material"}
          </h3>
          <p className="text-sm text-white/40 mb-8">Supports all academic PDFs up to 50MB</p>
          <button className="btn-glow text-xs px-8 py-3 uppercase tracking-widest font-bold">Select File</button>
        </div>

        <AnimatePresence>
          {isUploading && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-6 glass-panel border-primary/20"
            >
              <div className="flex justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-widest text-primary-light">Processing Document...</span>
                <span className="text-xs font-bold text-primary-light">{uploadProgress}%</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${uploadProgress}%` }}
                  className="h-full bg-primary shadow-purple-glow"
                ></motion.div>
              </div>
            </motion.div>
          )}

          {isProcessed && !isUploading && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }}
              className="p-6 glass-panel border-green-400/20 bg-green-400/5"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-green-400/20 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Semantic Index Ready</h3>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Qdrant vector embeddings created</p>
                </div>
                <button 
                  onClick={() => { setIsProcessed(false); setDocumentId(null); }}
                  className="ml-auto text-[10px] font-bold text-white/20 hover:text-white uppercase tracking-widest transition-colors"
                >
                  Reset
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hallucination Safety Card */}
        <div className="p-4 glass-card border-amber-400/20 bg-amber-400/5 flex items-start gap-4">
          <Shield className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <p className="text-[11px] text-amber-200/50 leading-relaxed italic font-medium">
            Answers are generated strictly from uploaded content with confidence scoring. If the information isn&apos;t in your document, I will let you know.
          </p>
        </div>
      </div>

      {/* QA Section */}
      <div className="glass-panel h-[700px] flex flex-col border-white/5 bg-white/[0.02]">
        <header className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-primary-light" />
            <h3 className="font-bold font-heading">AI Query Engine</h3>
          </div>
          {isProcessed && <span className="text-[10px] font-bold text-green-400 uppercase bg-green-400/10 px-2 py-1 rounded">Active Session</span>}
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 flex flex-col">
          {messages.map((msg, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] p-4 glass-card text-sm leading-relaxed whitespace-pre-wrap ${
                msg.role === 'user' 
                  ? 'bg-primary/20 border-primary/30 rounded-tr-none' 
                  : 'bg-white/5 border-white/10 rounded-tl-none'
              }`}>
                {msg.content}
              </div>
            </motion.div>
          ))}
          {sending && (
            <div className="flex justify-start">
              <div className="p-4 glass-card bg-white/5 border-white/10 rounded-tl-none">
                <Loader2 className="w-4 h-4 animate-spin text-primary-light" />
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSendMessage} className="p-6 border-t border-white/10">
          <div className="flex gap-4">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={!isProcessed || sending}
              placeholder={isProcessed ? "Ask about your material..." : "Upload a PDF to unlock chat..."}
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-4 outline-none focus:border-primary/50 text-sm transition-all disabled:opacity-50"
            />
            <button 
              type="submit"
              disabled={!isProcessed || sending || !input.trim()}
              className="btn-glow px-6 flex items-center justify-center disabled:opacity-50 disabled:grayscale"
            >
              {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
