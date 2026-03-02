"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  Plus, 
  FileText, 
  Youtube, 
  Globe, 
  Mic, 
  Clock, 
  Zap,
  TrendingUp,
  BrainCircuit,
  Loader2
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import api from "@/lib/api";

interface DashboardData {
  total_documents: number;
  ai_insights: number;
  study_time: number;
  recent_documents: any[];
}

export default function DashboardHome() {
  const { setActiveModule, user } = useAppStore();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get("/documents/stats");
        setData(response.data);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const quickActions = [
    { id: 'pdf', icon: FileText, label: 'Upload PDF', color: 'bg-primary' },
    { id: 'youtube', icon: Youtube, label: 'Summarize Video', color: 'bg-red-500' },
    { id: 'website', icon: Globe, label: 'Crawl Website', color: 'bg-blue-500' },
    { id: 'voice', icon: Mic, label: 'Voice Memo', color: 'bg-secondary' },
  ];

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  const stats = [
    { label: "Documents", value: data?.total_documents.toString() || "0", icon: Zap, trend: "Live Tracking" },
    { label: "AI Insights", value: data?.ai_insights.toString() || "0", icon: BrainCircuit, trend: "Verified" },
    { label: "Study Time", value: `${data?.study_time || 0}m`, icon: TrendingUp, trend: "Estimated" },
  ];

  return (
    <div className="space-y-10 animate-fade-in">
      <header>
        <h1 className="text-4xl font-extrabold mb-2 font-heading tracking-tight">Welcome back, {user?.name || 'Scholar'}!</h1>
        <p className="text-white/40 font-medium">What would you like to master today?</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-6 flex flex-col gap-4 border-white/5"
          >
            <div className="flex justify-between items-start">
              <div className="p-3 bg-primary/10 rounded-xl">
                <stat.icon className="w-6 h-6 text-primary-light" />
              </div>
              <span className="text-[10px] font-bold text-green-400 uppercase tracking-tighter bg-green-400/10 px-2 py-1 rounded-md">
                {stat.trend}
              </span>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-white/30 mb-1">{stat.label}</p>
              <h3 className="text-3xl font-black font-heading">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Launch */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold font-heading">Quick Launch</h2>
          <button 
            onClick={() => setActiveModule('history')}
            className="text-xs font-bold text-primary-light uppercase tracking-widest hover:underline flex items-center gap-1"
          >
            View All Files <Plus className="w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {quickActions.map((action) => (
            <button 
              key={action.id}
              onClick={() => setActiveModule(action.id as any)}
              className="glass-card p-6 flex flex-col items-center gap-4 group hover:ring-2 ring-primary/50 transition-all border-white/5"
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-lg ${action.color}/20`}>
                <action.icon className="w-7 h-7 text-white" />
              </div>
              <span className="text-sm font-bold">{action.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Recents */}
      <section>
        <h2 className="text-xl font-bold font-heading mb-6">Recent Activities</h2>
        <div className="glass-panel overflow-hidden border-white/5 bg-white/[0.02]">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 border-b border-white/10 uppercase tracking-widest text-[10px] font-bold text-white/40">
              <tr>
                <th className="p-4">Source Name</th>
                <th className="p-4">Type</th>
                <th className="p-4">Date</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {data?.recent_documents.map((item, i) => (
                <tr 
                  key={item.id || item._id} 
                  onClick={() => setActiveModule(item.type as any)}
                  className="hover:bg-white/[0.04] transition-colors cursor-pointer group"
                >
                  <td className="p-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-primary/30 transition-all">
                      {item.type === 'pdf' && <FileText className="w-4 h-4 text-primary-light" />}
                      {item.type === 'youtube' && <Youtube className="w-4 h-4 text-red-500" />}
                      {item.type === 'website' && <Globe className="w-4 h-4 text-blue-500" />}
                      {item.type === 'voice' && <Mic className="w-4 h-4 text-purple-500" />}
                    </div>
                    <span className="font-semibold group-hover:text-primary-light transition-colors text-white/80">{item.title}</span>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-white/5 border border-white/10 rounded-md text-[10px] font-bold uppercase tracking-tighter text-white/40 group-hover:text-white/60">
                      {item.type}
                    </span>
                  </td>
                  <td className="p-4 text-white/20 text-xs font-medium">{new Date(item.created_at).toLocaleDateString()}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-1 text-green-400 font-bold text-[10px] uppercase tracking-widest">
                      <div className="w-1 h-1 rounded-full bg-green-400 animate-pulse" />
                      Ready
                    </div>
                  </td>
                </tr>
              ))}
              {(!data || data.recent_documents.length === 0) && (
                <tr>
                  <td colSpan={4} className="p-12 text-center text-white/20 font-medium italic">
                    No recent activity found. Start by uploading a document!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
