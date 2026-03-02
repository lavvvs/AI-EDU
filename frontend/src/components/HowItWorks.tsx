"use client";

import React from "react";
import { motion } from "framer-motion";
import { Upload, Cpu, MessageSquare } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      title: "Upload Content",
      desc: "Drag & drop PDFs, paste YouTube links, or record voice.",
      icon: Upload,
    },
    {
      title: "AI Matrix Processing",
      desc: "Our RAG pipeline analyzes and segments your data securely.",
      icon: Cpu,
    },
    {
      title: "Ask & Learn",
      desc: "Get verified answers and smart summaries instantly.",
      icon: MessageSquare,
    },
  ];

  return (
    <section id="how-it-works" className="py-24 relative overflow-hidden bg-background-end/40">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold font-heading mb-4 text-white">How It Works</h2>
          <p className="text-white/50 max-w-xl mx-auto">Three simple steps to unlock the full potential of your study materials.</p>
        </div>

        <div className="relative flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8 max-w-6xl mx-auto">
          {/* Animated Connecting Line (Desktop) */}
          <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent hidden lg:block -z-10" />

          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="flex-1 w-full flex flex-col items-center text-center group"
            >
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-primary blur-2xl opacity-0 group-hover:opacity-30 transition-opacity" />
                <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center relative z-10 backdrop-blur-md group-hover:border-primary/50 transition-all duration-300">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white shadow-lg">
                    <step.icon className="w-8 h-8" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-background-end border border-white/10 flex items-center justify-center text-xs font-bold text-white">
                    0{index + 1}
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3 text-white font-heading">{step.title}</h3>
              <p className="text-white/40 max-w-[250px] leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
