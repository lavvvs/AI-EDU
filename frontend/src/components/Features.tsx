"use client";

import React from "react";
import { motion } from "framer-motion";
import { FileText, Youtube, Globe, Mic, Shield, Zap, Lock, Search } from "lucide-react";

const Features = () => {
  const mainFeatures = [
    {
      title: "PDF Intelligence",
      description: "Summarize and ask questions from your documents with deep retrieval context.",
      icon: FileText,
      color: "from-blue-500/20 to-primary/20",
    },
    {
      title: "YouTube Analyzer",
      description: "Turn any video into smart summaries and actionable notes instantly.",
      icon: Youtube,
      color: "from-red-500/20 to-primary/20",
    },
    {
      title: "Website Intelligence",
      description: "Extract, crawl, and analyze full websites for specific answers.",
      icon: Globe,
      color: "from-green-500/20 to-primary/20",
    },
    {
      title: "Voice to Smart Notes",
      description: "Convert speech into beautifully structured and searchable notes.",
      icon: Mic,
      color: "from-yellow-500/20 to-primary/20",
    },
  ];

  const trustBadges = [
    { title: "100% Content-Based", icon: Shield, desc: "Strictly follows your files." },
    { title: "No Hallucinations", icon: Search, desc: "Verified answers only." },
    { title: "Fast Processing", icon: Zap, desc: "Lightning quick AI RAG." },
    { title: "Secure & Private", icon: Lock, desc: "Your data stays yours." },
  ];

  return (
    <section id="features" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold font-heading mb-4 text-white"
          >
            Built for Serious Learners
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-white/50 max-w-2xl mx-auto text-lg"
          >
            Experience the future of education with AI that understands context, respects accuracy, and never makes things up.
          </motion.p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          {mainFeatures.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative"
            >
              <div className="absolute -inset-2 bg-gradient-to-r from-primary/50 to-secondary/50 rounded-3xl blur-xl opacity-0 group-hover:opacity-20 transition-all duration-500" />
              <motion.div
                whileHover={{ y: -10, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="glass-card h-full p-8 relative z-10 transition-all cursor-pointer hover:shadow-neon-glow"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white font-heading">{feature.title}</h3>
                <p className="text-white/50 leading-relaxed text-sm">{feature.description}</p>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Trust Section */}
        <div className="glass-panel p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {trustBadges.map((badge, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary-light">
                  <badge.icon className="w-6 h-6" />
                </div>
                <h4 className="text-white font-bold mb-1 text-sm md:text-base">{badge.title}</h4>
                <p className="text-white/40 text-xs md:text-sm">{badge.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
