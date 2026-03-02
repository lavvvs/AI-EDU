"use client";

import React from "react";
import { motion } from "framer-motion";
import { Rocket } from "lucide-react";
import Link from "next/link";

const CTASection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="relative group p-1 md:p-2 bg-gradient-to-r from-primary via-secondary to-primary rounded-[2.5rem] overflow-hidden">
          {/* Animated Background Pulse */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-primary animate-pulse opacity-50 filter blur-3xl -z-10 group-hover:scale-110 transition-transform duration-700" />
          
          <div className="relative z-10 bg-background-end rounded-[2rem] p-12 md:p-20 text-center flex flex-col items-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-6xl font-extrabold font-heading text-white mb-8 leading-[1.1]"
            >
              Start Studying <br /> Smarter Today
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-white/60 mb-12 max-w-2xl text-lg"
            >
              Join thousands of elite students and professionals who use EduAI Pro to master complex subjects with artificial intelligence.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row items-center gap-6"
            >
              <Link href="/signup">
                <motion.button 
                  whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(108, 43, 217, 0.5)" }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-glow px-12 py-5 rounded-2xl bg-primary text-white font-bold text-xl flex items-center gap-3 transition-shadow"
                >
                  <Rocket className="w-6 h-6" />
                  Create Free Account
                </motion.button>
              </Link>
              <Link href="/login">
                <motion.button 
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.05)" }}
                  whileTap={{ scale: 0.98 }}
                  className="px-10 py-5 rounded-2xl border border-white/10 text-white font-bold text-xl transition-all"
                >
                  Login to Portal
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="py-12 border-t border-white/5 relative z-10">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold font-heading text-white">EduAI <span className="text-primary-light">Pro</span></span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-white/40">
            {["Features", "How It Works", "Privacy Policy", "Terms of Service", "Status"].map((link) => (
              <motion.a 
                key={link}
                href="#" 
                whileHover={{ scale: 1.1, color: "#ffffff" }}
                className="transition-colors"
              >
                {link}
              </motion.a>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary/20 transition-all cursor-pointer">
              <span className="sr-only">GitHub</span>
              <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24"><path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/></svg>
            </div>
          </div>
        </div>
        <div className="text-center text-white/20 text-xs">
          &copy; {new Date().getFullYear()} EduAI Pro. All rights reserved. Designed for elite students.
        </div>
      </div>
    </footer>
  );
};

export { CTASection, Footer };
