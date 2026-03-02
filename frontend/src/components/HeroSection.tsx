"use client";

import { motion } from "framer-motion";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import EliteRobot from "./EliteRobot";

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-32 px-6 overflow-hidden">
      {/* Background Mesh Gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-full bg-[radial-gradient(circle_at_center,rgba(108,43,217,0.1),transparent_60%)] pointer-events-none -z-10"></div>
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-left"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary-light text-[10px] font-black uppercase tracking-[0.2em] mb-8 shadow-purple-glow">
            <Sparkles className="w-4 h-4" />
            The Future of Learning is Here
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black mb-8 leading-[1] tracking-tight text-white drop-shadow-2xl">
            Master Anything with <br />
            <span className="relative inline-block mt-2">
              <span className="bg-gradient-to-r from-primary-light via-secondary to-primary bg-clip-text text-transparent italic">
                AI Intelligence
              </span>
              <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                transition={{ duration: 1, delay: 0.5 }}
                className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-primary to-transparent"
              />
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-text-muted mb-12 max-w-xl leading-relaxed font-medium">
            Upload PDFs, YouTube videos, websites, or voice notes — and get intelligent summaries and verified, accurate answers instantly. No hallucinations, just hard facts.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <button className="btn-glow flex items-center gap-3 px-10 py-5 text-lg shadow-neon-glow w-full sm:w-auto justify-center">
              Get Started Free <ArrowRight className="w-5 h-5" />
            </button>
            <button className="px-10 py-5 text-lg font-bold border border-white/10 rounded-2xl hover:bg-white/5 transition-all flex items-center gap-3 w-full sm:w-auto justify-center group">
              <Play className="w-5 h-5 text-primary-light group-hover:scale-110 transition-transform" /> 
              Watch Demo
            </button>
          </div>
        </motion.div>

        {/* Right Side - Elite Robot */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          viewport={{ once: true }}
          className="relative"
        >
          <EliteRobot />
          {/* Subtle Floating Elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 blur-[60px] rounded-full animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/10 blur-[80px] rounded-full animate-pulse-slow"></div>
        </motion.div>
      </div>
    </section>
  );
}
