"use client";

import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Youtube, Globe, Mic, Sparkles, CheckCircle2 } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col w-full bg-background-end text-white overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 px-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(108,43,217,0.15),transparent_70%)] pointer-events-none"></div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center z-10 max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary-light text-xs font-bold uppercase tracking-widest mb-8 shadow-purple-glow">
            <Sparkles className="w-4 h-4" />
            Empowering Your Learning with AI
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black mb-8 leading-[1.1] tracking-tight">
            Your AI-Powered <br />
            <span className="bg-gradient-to-r from-primary-light via-secondary to-primary bg-clip-text text-transparent italic">
              Study Companion
            </span>
          </h1>
          
          <p className="text-xl text-text-muted mb-12 max-w-2xl mx-auto leading-relaxed">
            Ultimate educational assistant for PDFs, YouTube videos, websites, and voice notes. Study smarter, not harder, with 100% accurate AI summaries.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button className="btn-glow flex items-center gap-2 px-8 py-4 text-lg">
              Get Started Now <ArrowRight className="w-5 h-5" />
            </button>
            <button className="px-8 py-4 text-lg font-semibold border border-white/10 rounded-xl hover:bg-white/5 transition-all">
              Try Interactive Demo
            </button>
          </div>
        </motion.div>

        {/* Abstract Robot / Dashboard Preview */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 100 }}
          animate={{ opacity: 1, scale: 1, y: 50 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative mt-20 w-full max-w-5xl h-[400px] glass-panel rounded-t-3xl border-b-0 p-8 shadow-[0_-20px_50px_rgba(108,43,217,0.1)]"
        >
          <div className="flex gap-4">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
          </div>
          <div className="mt-8 grid grid-cols-3 gap-8">
            <div className="h-40 glass-card"></div>
            <div className="h-40 glass-card"></div>
            <div className="h-40 glass-card"></div>
          </div>
        </motion.div>
      </section>

      {/* Feature Grid */}
      <section className="py-24 px-6 max-w-7xl mx-auto w-full">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">One Platform, Infinite Knowledge</h2>
          <p className="text-text-muted">Master any subject with our specialized AI modules.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: BookOpen, title: "PDF Intelligence", desc: "Interact with your textbooks like never before." },
            { icon: Youtube, title: "YouTube Summarizer", desc: "Get notes from hours of lectures in seconds." },
            { icon: Globe, title: "Website Analyzer", desc: "Crawl and summarize entire educational portals." },
            { icon: Mic, title: "Voice to Smart Notes", desc: "Record lectures and get formatted summaries." }
          ].map((feature, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -10 }}
              className="glass-card p-8 flex flex-col items-start gap-4 hover:shadow-neon-glow border-primary/10"
            >
              <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                <feature.icon className="w-6 h-6 text-primary-light" />
              </div>
              <h3 className="text-xl font-bold">{feature.title}</h3>
              <p className="text-sm text-text-muted leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-24 bg-white/5 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">
          <div className="flex gap-12 flex-wrap justify-center opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            <span className="text-2xl font-black italic">MIT</span>
            <span className="text-2xl font-black italic">STANFORD</span>
            <span className="text-2xl font-black italic">HARVARD</span>
            <span className="text-2xl font-black italic">OXFORD</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/5 text-center">
        <p className="text-text-muted text-sm italic">Designed for the next generation of learners.</p>
      </footer>
    </div>
  );
}
