"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Search, Loader2, Layers, CheckCircle2, ChevronRight, LayoutPanelTop, Sparkles, Send } from "lucide-react";
import api from "@/lib/api";

export default function WebsiteModule() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [crawled, setCrawled] = useState(false);
  const [documentId, setDocumentId] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);
  const [query, setQuery] = useState("");
  const [qaMessages, setQaMessages] = useState<any[]>([]);
  const [sending, setSending] = useState(false);

  const handleCrawl = async () => {
    if (!url.trim()) return;
    setLoading(true);
    setCrawled(false);
    
    try {
      const formData = new URLSearchParams();
      formData.append("url", url);
      
      const response = await api.post("/website/process", formData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });
      
      setData(response.data);
      setDocumentId(response.data.document_id);
      setCrawled(true);
      setQaMessages([{ role: 'assistant', content: `✅ Website indexed! ${response.data.chunk_count} chunks created.\n\n**Summary:** ${response.data.summary}\n\nWhat would you like to know?` }]);
    } catch (error: any) {
      console.error("Website crawl failed", error);
      const detail = error.response?.data?.detail || "Failed to crawl website.";
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
      
      const { data } = await api.post("/website/qa", formData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      let response = data.answer;
      if (data.confidence > 0) {
        response += `\n\n🎯 Confidence: ${(data.confidence * 100).toFixed(0)}%`;
      }
      if (data.sources && data.sources.length > 0) {
        response += `\n📚 Based on ${data.sources.length} source(s)`;
      }

      setQaMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error: any) {
      const detail = error.response?.data?.detail || "Error connecting to AI engine.";
      setQaMessages(prev => [...prev, { role: 'assistant', content: `❌ ${detail}` }]);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-10 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold mb-2 font-heading tracking-tight">Website Analyzer</h2>
        <p className="text-white/40 font-medium font-sans">Transform any web resource into structured academic notes.</p>
      </div>

      <div className="max-w-3xl mx-auto w-full">
        <div className="glass-panel p-8 space-y-8 border-blue-500/10 bg-blue-500/[0.02]">
          <div className="relative group">
            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-blue-500 transition-transform group-focus-within:scale-110" />
            <input 
              type="text" 
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter Website URL (e.g., https://en.wikipedia.org/wiki/AI)"
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-32 outline-none focus:border-blue-500/50 transition-all text-sm font-medium"
            />
            <button 
              onClick={handleCrawl}
              disabled={loading || !url}
              className="absolute right-2 top-2 bottom-2 px-6 rounded-xl bg-blue-600 font-bold text-[10px] uppercase tracking-widest hover:bg-blue-500 transition-all disabled:opacity-30"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Start Crawl"}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {crawled && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="grid grid-cols-1 lg:grid-cols-4 gap-8"
          >
            {/* Summary Sidebar */}
            <div className="lg:col-span-1 glass-panel border-white/5 overflow-hidden flex flex-col h-[600px] bg-white/[0.01]">
              <header className="p-4 bg-white/5 border-b border-white/10 font-bold text-[10px] uppercase tracking-widest text-blue-400">Analysis Stats</header>
              <div className="p-6 space-y-6">
                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-white/30 uppercase tracking-tighter">Status</p>
                  <div className="flex items-center gap-2 text-green-400 font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4" /> Fully Indexed
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-white/30 uppercase tracking-tighter">Segments</p>
                  <p className="text-xl font-black font-heading">{data?.chunk_count} Chunks</p>
                </div>
                <button 
                  onClick={() => { setCrawled(false); setDocumentId(null); }}
                  className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-colors"
                >
                  New Analysis
                </button>
              </div>
            </div>

            {/* AI Engine Section */}
            <div className="lg:col-span-3 space-y-8">
              <div className="glass-panel p-8 relative overflow-hidden h-[600px] flex flex-col bg-white/[0.02] border-white/5">
                <header className="flex items-center justify-between mb-8 border-b border-white/10 pb-6">
                  <div className="flex items-center gap-4">
                    <Sparkles className="w-6 h-6 text-blue-400" />
                    <h3 className="text-xl font-bold font-heading">AI Knowledge Navigator</h3>
                  </div>
                </header>
                
                <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar flex flex-col">
                  {qaMessages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                        msg.role === 'user' ? 'bg-blue-600/20 border border-blue-500/30' : 'bg-white/5 border border-white/10'
                      }`}>
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  {sending && <Loader2 className="w-4 h-4 animate-spin text-blue-500 mx-auto" />}
                </div>

                <form onSubmit={handleSendMessage} className="mt-8 pt-6 border-t border-white/10 flex gap-4">
                  <input 
                    type="text" 
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Ask about the website content..."
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-sm outline-none focus:border-blue-500/50 transition-all"
                  />
                  <button type="submit" disabled={sending || !documentId} className="bg-blue-600 px-6 rounded-xl hover:bg-blue-500 transition-shadow shadow-lg shadow-blue-600/20 disabled:opacity-30">
                    <Send className="w-5 h-5 text-white" />
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
