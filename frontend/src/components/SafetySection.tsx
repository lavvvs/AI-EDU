"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Info, AlertTriangle } from "lucide-react";

const SafetySection = () => {
  return (
    <section id="safety" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-panel p-8 md:p-16 relative overflow-hidden flex flex-col md:flex-row items-center gap-12"
          >
            {/* Background Glow */}
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/20 blur-[100px] rounded-full" />
            
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-6 font-semibold text-primary-light text-sm">
                <ShieldCheck className="w-4 h-4" />
                <span>AI Safety First</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold font-heading mb-6 text-white">
                Answers Generated Strictly from Your Content
              </h2>
              <p className="text-white/60 mb-8 leading-relaxed">
                Unlike general AI, EduAI Pro uses Retrieval-Augmented Generation (RAG). This means it only answers using the files you provide. If the information isn't there, we don't hallucinate—we truthfully tell you "Answer not found in the source content."
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 mt-1">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <p className="text-sm text-white/80">100% Contextual Accuracy</p>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 mt-1">
                    <Info className="w-4 h-4" />
                  </div>
                  <p className="text-sm text-white/80">Source Citing for Every Response</p>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 mt-1">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <p className="text-sm text-white/80">No Data Leakage to AI Training</p>
                </div>
              </div>
            </div>

            <div className="flex-shrink-0 w-full md:w-1/3">
              <div className="relative group p-6 rounded-2xl bg-background-end border border-white/5 shadow-2xl">
                <div className="absolute inset-0 bg-primary/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10 px-4 py-3 rounded-lg bg-white/5 border border-white/10 mb-4 animate-pulse-slow">
                  <div className="w-full h-2 bg-white/20 rounded-full mb-3" />
                  <div className="w-[80%] h-2 bg-white/10 rounded-full" />
                </div>
                <div className="relative z-10 p-4 rounded-xl bg-primary/20 border border-primary/30">
                  <p className="text-[10px] text-primary-light uppercase font-bold tracking-widest mb-2 font-heading">AI Response</p>
                  <p className="text-xs text-white/90 leading-normal italic font-medium">
                    "Based on page 42 of your PDF, the solution is calculated using the Euler-Lagrange equation..."
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SafetySection;
