"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Youtube, Search, Loader2, PlayCircle, Clock, BookOpen, Sparkles, Send } from "lucide-react";
import api from "@/lib/api";

export default function YouTubeModule() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [processed, setProcessed] = useState(false);
  const [documentId, setDocumentId] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"transcript" | "summary" | "qa">("transcript");
  const [query, setQuery] = useState("");
  const [qaMessages, setQaMessages] = useState<any[]>([]);
  const [sending, setSending] = useState(false);

  const handleFetch = async () => {
    if (!url.trim()) return;
    setLoading(true);
    setProcessed(false);
    
    try {
      const formData = new URLSearchParams();
      formData.append("url", url);
      
      const response = await api.post("/youtube/process", formData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });
      
      setData(response.data);
      setDocumentId(response.data.document_id);
      setProcessed(true);
      setActiveTab("summary");
      setQaMessages([{ role: 'assistant', content: "I've analyzed the video transcript. Ask me anything about the content!" }]);
    } catch (error: any) {
      console.error("YouTube processing failed", error);
      const detail = error.response?.data?.detail || "Failed to process video. Make sure it has captions enabled.";
      alert(detail);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || sending || !documentId) return;

    const userMsg = query;
    setQuery("");
    setQaMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setSending(true);

    try {
      const formData = new URLSearchParams();
      formData.append("query", userMsg);
      formData.append("document_id", documentId);
      
      const { data } = await api.post("/youtube/qa", formData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      let response = data.answer;
      if (data.confidence > 0) {
        response += `\n\n🎯 Confidence: ${(data.confidence * 100).toFixed(0)}%`;
      }

      setQaMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error: any) {
      const detail = error.response?.data?.detail || "Error connecting to AI engine.";
      setQaMessages(prev => [...prev, { role: 'assistant', content: `❌ ${detail}` }]);
    } finally {
      setSending(false);
    }
  };

  const videoId = url.includes('v=') ? url.split('v=')[1].split('&')[0] : url.split('/').pop() || 'dQw4w9WgXcQ';

  return (
    <div className="space-y-10 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold mb-2 font-heading tracking-tight">YouTube Summarizer</h2>
        <p className="text-white/40 font-medium">Extract wisdom from hours of video content in seconds.</p>
      </div>

      <div className="max-w-3xl mx-auto w-full">
        <div className="glass-panel p-8 flex flex-col gap-6 border-red-500/10 bg-red-500/[0.02]">
          <div className="relative group">
            <Youtube className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-red-500 transition-transform group-focus-within:scale-110" />
            <input 
              type="text" 
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste YouTube Video URL (e.g., https://www.youtube.com/watch?v=...)"
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-32 outline-none focus:border-red-500/50 transition-all text-sm font-medium"
            />
            <button 
              onClick={handleFetch}
              disabled={loading || !url}
              className={`absolute right-2 top-2 bottom-2 px-6 rounded-xl bg-red-600 font-bold text-[10px] uppercase tracking-widest hover:bg-red-500 transition-all disabled:opacity-30`}
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Analyze Video"}
            </button>
          </div>
        </div>
      </div>

      {processed && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          <div className="lg:col-span-1 space-y-6">
            <div className="aspect-video glass-panel overflow-hidden border-white/10 relative group bg-black">
              <img 
                src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`} 
                alt="Thumbnail" 
                className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                onError={(e: any) => e.target.src = `https://img.youtube.com/vi/${videoId}/0.jpg`}
              />
              <PlayCircle className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 text-white/80 group-hover:scale-110 group-hover:text-red-500 transition-all" />
            </div>
            
            <div className="glass-card p-6 space-y-4 border-white/5">
              <h4 className="text-xs font-bold uppercase tracking-widest text-red-400 flex items-center gap-2">
                <Clock className="w-4 h-4" /> Video Metadata
              </h4>
              <div className="space-y-4 text-sm font-medium">
                <div className="flex justify-between">
                  <span className="text-white/30">Chunks:</span>
                  <span className="text-white/80">{data?.chunk_count} segments</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/30">Language:</span>
                  <span className="text-white/80">Auto-detected</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 glass-panel border-white/5 p-8 h-[600px] flex flex-col bg-white/[0.01]">
            <header className="flex gap-8 border-b border-white/10 mb-8">
              {[
                { id: "summary", label: "AI Summary" },
                { id: "qa", label: "Ask AI" }
              ].map(tab => (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`pb-4 font-bold text-[10px] uppercase tracking-widest transition-all border-b-2 ${
                    activeTab === tab.id ? "border-red-500 text-white" : "border-transparent text-white/30 hover:text-white/60"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </header>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
              {activeTab === "summary" && (
                <div className="space-y-6 p-6 glass-card bg-white/5 border-white/10 rounded-xl">
                  <h3 className="font-bold text-red-400 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" /> Smart Overview
                  </h3>
                  <p className="text-sm text-white/80 leading-relaxed whitespace-pre-wrap">
                    {data?.summary}
                  </p>
                </div>
              )}

              {activeTab === "qa" && (
                <div className="h-full flex flex-col">
                  <div className="flex-1 space-y-4 mb-4">
                    {qaMessages.map((msg, i) => (
                      <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] p-3 rounded-xl text-sm whitespace-pre-wrap ${
                          msg.role === 'user' ? 'bg-red-600/20 border border-red-500/30' : 'bg-white/5 border border-white/10'
                        }`}>
                          {msg.content}
                        </div>
                      </div>
                    ))}
                    {sending && <Loader2 className="w-4 h-4 animate-spin text-red-500 mx-auto" />}
                  </div>
                  <form onSubmit={handleSendMessage} className="mt-auto flex gap-2">
                    <input 
                      type="text" 
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Ask about the video..."
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-red-500/50"
                    />
                    <button type="submit" disabled={sending || !documentId} className="bg-red-600 p-3 rounded-xl hover:bg-red-500 transition-colors disabled:opacity-30">
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
