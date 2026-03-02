"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { History, Search, FileText, Youtube, Globe, Mic, Trash2, ExternalLink, Calendar, Loader2 } from "lucide-react";
import api from "@/lib/api";
import { useAppStore } from "@/lib/store";

export default function HistoryModule() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { setActiveModule } = useAppStore();

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/documents/recent");
      setDocuments(data);
    } catch (error) {
      console.error("Failed to fetch history", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const deleteDoc = async (id: string) => {
    if (!confirm("Are you sure you want to delete this session?")) return;
    try {
      await api.delete(`/documents/${id}`);
      setDocuments(prev => prev.filter(doc => doc.id !== id));
    } catch (error) {
      alert("Failed to delete document.");
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <FileText className="w-5 h-5 text-primary-light" />;
      case 'youtube': return <Youtube className="w-5 h-5 text-red-500" />;
      case 'website': return <Globe className="w-5 h-5 text-blue-500" />;
      case 'voice': return <Mic className="w-5 h-5 text-purple-500" />;
      default: return <History className="w-5 h-5 text-white/50" />;
    }
  };

  const filteredDocs = documents.filter(doc => 
    doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold mb-2 font-heading tracking-tight">Your Knowledge Library</h2>
          <p className="text-white/40 font-medium font-sans">Access all your previous AI sessions and extracted wisdom.</p>
        </div>
        
        <div className="relative group max-w-md w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Search sessions, titles, or types..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 outline-none focus:border-primary/50 transition-all text-sm font-medium"
          />
        </div>
      </div>

      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center gap-4 text-white/20">
          <Loader2 className="w-8 h-8 animate-spin" />
          <p className="text-xs font-bold uppercase tracking-widest">Retrieving History...</p>
        </div>
      ) : documents.length === 0 ? (
        <div className="glass-panel p-20 text-center border-dashed border-white/10">
          <History className="w-16 h-16 mx-auto mb-6 text-white/5 opacity-20" />
          <h3 className="text-xl font-bold mb-2">No history found</h3>
          <p className="text-white/30 text-sm max-w-sm mx-auto mb-8">Start by uploading a PDF, analyzing a video, or recording your thoughts.</p>
          <button 
            onClick={() => setActiveModule('dashboard')}
            className="px-8 py-3 bg-primary rounded-xl font-bold text-xs uppercase tracking-widest hover:shadow-neon-glow transition-all"
          >
            Get Started
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredDocs.map((doc, i) => (
              <motion.div 
                key={doc.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: i * 0.05 }}
                className="glass-card p-6 border-white/5 hover:border-white/10 group transition-all"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-primary/10 group-hover:border-primary/20 transition-all">
                      {getIcon(doc.type)}
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-tighter text-white/30">{doc.type}</span>
                      <h4 className="text-sm font-bold text-white/80 line-clamp-1">{doc.title}</h4>
                    </div>
                  </div>
                  <button 
                    onClick={() => deleteDoc(doc.id)}
                    className="p-2 text-white/10 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs text-white/40 leading-relaxed mb-6 line-clamp-2">
                  {doc.summary}
                </p>

                <div className="flex items-center justify-between pt-6 border-t border-white/5">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-white/20 uppercase tracking-widest">
                    <Calendar className="w-3 h-3" />
                    {new Date(doc.created_at).toLocaleDateString()}
                  </div>
                  <button 
                    onClick={() => setActiveModule(doc.type as any)}
                    className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-primary hover:text-primary-light transition-colors"
                  >
                    Open Session <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
