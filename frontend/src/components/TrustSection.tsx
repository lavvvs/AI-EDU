"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Zap, Database, SearchCheck } from "lucide-react";

const trustItems = [
  { icon: ShieldCheck, label: "100% Content-Based Answers", color: "text-green-400" },
  { icon: Database, label: "Zero Hallucinations Guarantee", color: "text-blue-400" },
  { icon: Zap, label: "Ultrafast RAG Processing", color: "text-primary-light" },
  { icon: SearchCheck, label: "Source Citation Included", color: "text-amber-400" },
];

export default function TrustSection() {
  return (
    <section className="py-20 px-6 border-y border-white/5 bg-white/[0.02]">
      <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-8 md:gap-16">
        {trustItems.map((item, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 group"
          >
            <div className={`p-2 rounded-lg bg-white/5 border border-white/10 group-hover:shadow-purple-glow transition-all ${item.color}`}>
              <item.icon className="w-5 h-5" />
            </div>
            <span className="text-sm font-bold text-text-muted group-hover:text-white transition-colors">
              {item.label}
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
